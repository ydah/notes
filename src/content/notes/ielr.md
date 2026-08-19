---
created: 2026-08-17
updated: 2026-08-17
---

# IELR

#parser #compiler #lr #bison

IELRはInadequacy Elimination LRの略。[[lalr-parser|LALR]]に近い状態数を保ちながら、[[canonical-lr-parser|Canonical LR(1)]]と同じ言語認識能力を持つ[[ielr-table|IELR table]]を構築する方式。

Bisonでは次の指定でIELRを選べる。

```text
%define lr.type ielr
```

Bisonの`lr.type`のデフォルトは`lalr`で、`ielr`と`canonical-lr`にも切り替えられる。

## LALR・Canonical LRとの違い

| 方式 | 状態の扱い | 特徴 |
|---|---|---|
| LALR | 同じLR(0) coreの状態をマージ | 小さいが、人工的なconflictが起きることがある |
| IELR | 必要な文脈を区別しながら状態をマージ | Canonical LRと同じ認識能力とLALRに近い状態数を持つ |
| Canonical LR | 状態をマージしない | 正確だが、状態数とテーブルが大きくなりやすい |

関連ページ: [[lalr-parser|LALRパーサー]]、[[ielr-table|IELR table]]、[[canonical-lr-parser|Canonical LRパーサー]]。

IELRは決定的LRパーサーのtable構築方式。[[glr|GLR]]のように実行時に複数の解析候補を並行して追跡する方式ではない。

[[mysterious-conflict|mysterious conflict]]のように、LALRの状態マージが原因で発生する[[conflict|conflict]]を避けるために使える。Bisonの公式マニュアルでは、IELRは必要な場合だけCanonical LRに相当する状態の区別を残し、それ以外ではLALRに近い表を作る方式として説明されている。

[[pslr|PSLR]]では、現在のparser stateで受理できるtokenを[[pseudo-scanner|pseudo-scanner]]が参照する。状態マージによってこの情報を失うとscannerの判断に影響するため、IELRはPSLRを実現するための基盤になる。

IELRのlookahead計算では、[[goto-follow-closures|goto-follow closures]]でGOTOごとのfollow依存関係を求める。この依存関係には[[internal-dependency|internal dependency]]と[[predecessor-dependency|predecessor dependency]]があり、[[lane-annotations|lane annotations]]でconflictに寄与した経路を記録して、必要な状態だけを分割する。

## IELRの構築手順

IELRはparser runtimeで動的にstateを分ける方式ではない。parser tableを生成するときに、まずLALR tableを作り、そのtableで失われたLR(1)の文脈を調べ、必要なstateだけを分割してからlookaheadとactionを計算し直す。

論文の構成は次の6段階。

~~~text
Phase 0  LALR(1) tableを作る
   ↓
Phase 1  分割に必要な依存関係の補助表を作る
   ↓
Phase 2  conflictからlaneを逆向きにたどってannotationを付ける
   ↓
Phase 3  annotationを使ってstateを分割しながら再構築する
   ↓
Phase 4  分割後のstateでreduction lookaheadを再計算する
   ↓
Phase 5  残ったconflictを通常の方法で解決する
~~~

### Phase 0: LALR table

最初にLR(0)のparser stateと遷移を作る。次に、DeRemerとPennelloの方法でGOTOのfollow setからreductionのlookahead setを計算する。この段階の出力は通常のLALR(1) table。

ここでは同じLR(0) coreを持つstateをまとめるため、異なるlaneから来たlookaheadが同じstateやitemに集まる。Canonical LR(1)なら別stateに残るlookaheadがunionされ、LR(1)なら発生しないconflictや、正しい文脈に必要な区別を失う余地ができる。

### Phase 1: 依存関係の補助表

Phase 2以降でlookaheadの経路を追跡できるように、LALR tableから次の情報を作る。

- [[predecessors-table|predecessors表]] — あるstateへ遷移するstateの一覧。conflict stateから開始stateへlaneを逆向きにたどるために使う。[[predecessor-dependency|predecessor dependency]]とは別の表。
- [[follow-kernel-items|follow_kernel_items]] — GOTOのfollow setが、同じstateのどのkernel itemのlookahead setに依存するかを記録する。[[internal-dependency|internal dependency]]だけをたどって計算できる部分。
- [[always-follows|always_follows]] — kernel itemのlookahead setや先行stateに依存せず、state分割後も変わらないgoto-follow tokenを記録する部分。

この分離があるため、Phase 3は全てのlookaheadを最初から計算し直すのではなく、state分割で変わり得る寄与だけを追跡できる。

### Phase 2: conflictからlaneを逆向きに追跡

LALR tableのconflictを、Canonical LR(1)なら同じ形で発生しないLR(1)-relative inadequacyとして調べる。conflict stateから[[lane-annotations|lane annotations]]を使って先行stateへ戻り、どのlaneのlookaheadがconflictに寄与したかを記録する。

論文の例では、conflict stateへ次の2つのlaneが合流する。

~~~text
λ1 = (0, 2, 16, 17, 18)
λ2 = (0, 5, 16, 17, 18)
~~~

一方のlaneからはac、もう一方のlaneからはbcが同じreduce itemのlookaheadへ伝わる。LALRではそれらが同じstateに集まるため、state 18でconflictになる。IELRはconflict stateだけでなく、laneが合流するstate 16、17も分割候補としてannotationする。

ここで重要なのは、state番号そのものを機械的に分けることではない。同じLR(0) coreを持つ[[isocore|isocore]]のそれぞれについて、どの[[inadequacy-contribution|inadequacy contribution]]を保つ必要があるかを記録すること。

### Phase 3: annotationを使ったstate再構築

Phase 3はLR(0) stateを作る処理に似ている。ただし、同じLR(0) coreを持つ[[isocore|isocore]]を常に一つへmergeするのではなく、annotationが示す全てのinadequacyに対して同じ[[dominant-contribution|dominant contribution]]を持つ場合だけmergeする。

mergeできないisocoreは別々のstateとして残る。これがIELRでいうstate split。lookaheadがどのlaneから来たかを区別する必要がある箇所だけが分割されるので、Canonical LRのように全てのLR(1) contextを別stateにする必要はない。

Phase 3では、[[follow-kernel-items|follow_kernel_items]]と[[always-follows|always_follows]]から部分的な[[kernel-item-lookahead-set|kernel item lookahead set]]を作り、annotationに含まれるlookaheadだけをsuccessor stateへ伝播させる。これによって、別laneのlookaheadが分割後のstateへ誤って混ざることを防ぐ。

### Phase 4・5: tableの完成

stateの再構築後、Phase 4で全てのreduction lookahead setを計算し直す。Phase 3で使った部分的なlookaheadはstateの互換性を判定するための情報で、最終tableのreduction lookaheadそのものではない。

最後にPhase 5で、残ったconflictをBisonの既存のconflict resolutionで処理する。IELRはLALRのstate mergeが原因の人工的なconflictを取り除くが、文法そのものの曖昧性やLR(1)では解けないconflictまで消す方式ではない。

## LALRからIELRになる箇所

IELRの要点は、LALR tableを捨ててCanonical LR tableを作り直すことではない。

~~~text
LALR:
  同じLR(0) coreなら全てmerge

IELR:
  同じLR(0) coreでも、
  conflictへの寄与が異なるならsplit
  寄与が同じならmerge
~~~

したがって、文法を変更せずにLALRの認識能力不足を除去しながら、LALRに近いstate数を保てる。LALRで十分な文法なら、Bisonの説明どおりIELRの出力はLALRと同じになる。

## 他のツールとの関係

IELRはBisonが提供する方式で、Menhirや[[ocamlyacc|ocamlyacc]]に`%define lr.type ielr`を書くものではない。ocamlyaccはLALR(1)を生成し、[[menhir|Menhir]]はLR(1)を扱う。

## 出典

- [LR Table Construction](https://www.gnu.org/software/bison/manual/html_node/LR-Table-Construction.html)
- [Mysterious Conflicts](https://www.gnu.org/software/bison/manual/html_node/Mysterious-Conflicts.html)
- [The IELR(1) algorithm](https://malloy.people.clemson.edu/publications/papers/scp09/scp09.pdf)
- [IELR(1) parser tables](https://malloy.people.clemson.edu/publications/papers/sac08/paper.pdf)
- [Bison Reference Manual](https://www.gnu.org/software/bison/manual/)
