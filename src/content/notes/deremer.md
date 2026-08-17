---
created: 2026-08-18
updated: 2026-08-18
---

# DeRemer

#parser #compiler #lr #lalr

DeRemerは、LR構文解析の理論とLALR(1)の構築方法に大きく関わった研究者。ここで重要なのは、Pennelloと共同で発表したLALR(1)のlookahead計算アルゴリズム。

## DeRemerとLALR

Canonical LR(1)は、stateごとにlookaheadを保持するため、文脈を正確に区別できる。その代わり、同じLR(0) coreを持つstateも別々に残る。

LALR(1)は同じcoreを持つstateをmergeする。DeRemerの研究は、このmergeを前提にして、reductionに必要なlookaheadをどう計算するかを整理したもの。

単に文法の非終端記号ごとのFOLLOW集合を使うのではなく、LR(0) automaton上のGOTOを頂点にして、lookaheadがどこからどこへ伝わるかを関係として表す。

## DeRemer/Pennelloの計算

典型的には次のような関係を使う。

- successor、またはread — nullableな遷移先を通じて、GOTOのfollowへtokenを伝える
- includes — あるGOTOのfollowが、別のGOTOのfollowを含む関係
- lookback — reduce itemのlookaheadと、対応するGOTOを結び付ける

この関係をグラフとして扱い、推移閉包やSCCを使って固定点までtoken集合を伝播させる。全てのCanonical LR(1) stateを構築する代わりに、LR(0) automaton上で必要な依存だけを計算するのが要点。

この計算で得たlookaheadが、LALR tableのreduce actionに使われる。IELRの[[ielr|Phase 0]]も、まずこの方法でLALR tableを作る。

## IELRとの関係

DeRemer/Pennelloの計算だけでは、LALR stateのmergeによって異なるlaneのlookaheadが一つに集まることがある。IELRはこのLALR tableを出発点にして、[[inadequacy|inadequacy]]に寄与した経路を調べ、必要なisocoreだけを分ける。

そのため、[[goto-follow-closures|goto-follow closures]]、[[internal-dependency|internal dependency]]、[[predecessor-dependency|predecessor dependency]]は、DeRemer/Pennelloのlookahead計算をIELRの状態分割に利用するための具体的な構造として見ることができる。

## 出典

- [Efficient Computation of LALR(1) Look-Ahead Sets](https://3e8.org/pub/scheme/doc/parsing/Efficient%20Computation%20of%20LALR%281%29%20Look-Ahead%20Sets.pdf)
- [Efficient computation of LALR(1) look-ahead sets (DBLP)](https://dblp.org/rec/conf/pldi/PennelloD79)
- [The IELR(1) algorithm](https://malloy.people.clemson.edu/publications/papers/scp09/scp09.pdf)
