---
created: 2026-08-18
updated: 2026-08-18
---

# lane annotations

#parser #compiler #lr #ielr

lane annotationsは、LALRのconflictに関係する経路やlookaheadの寄与を記録するメタデータ。IELR(1)の状態分割に使う。

## lane

LRオートマトンの開始状態から、ある状態へ到達する遷移の経路をlaneと考える。

~~~text
開始状態
   ↓
state_1
   ↓
state_4
   ↓
conflict state
~~~

同じLR(0) coreを持つ状態をLALRでマージすると、異なるlaneを通った情報が1つの状態に集まる。lookaheadの集合も統合されるため、Canonical LRでは発生しなかったconflictが発生することがある。

## annotationの役割

conflict stateだけを分割しても十分とは限らない。conflictへlookaheadを運んだ前方の状態やGOTO遷移も、異なるlaneを区別できるように分割する場合がある。

lane annotationは、次のような関係を状態やisocoreに付ける。

- どのconflictまたは[[inadequacy|inadequacy]]に関係するか
- どのtokenやreduce [[inadequacy-contribution|contribution]]が問題になっているか
- どの先行状態・GOTO遷移を通じて、その寄与が伝わったか

このannotationは、ソースコードや文法規則への注釈ではない。IELR parser tableを生成する途中で使う、状態機械上の解析結果。

## lane tracing

IELRのannotation計算では、conflictを含む状態から、先行状態へ向かってlaneを逆向きにたどる。[[goto-follow-closures|goto-follow closures]]で計算したfollow依存関係と、itemのlookahead依存関係を使って、conflictに寄与し得る経路だけを調べる。ここでいうfollow依存関係には、[[predecessor-dependency|predecessor dependency]]のように先行laneからlookaheadを運ぶ関係も含まれる。

laneは分岐・合流・ループを含む。開始状態からの経路をすべて列挙すると組み合わせが増え続けるため、同じ寄与関係を持つ複数のlaneをannotationにまとめ、状態ごとに伝播させる。

概念的には次の処理になる。

~~~text
LALRでconflictを検出
        ↓
conflict stateからlaneを逆向きにtrace
        ↓
lookaheadの寄与をannotationとして記録
        ↓
annotationを使って状態の互換性を判定
        ↓
必要なisocoreだけをsplit
~~~

## IELRでの位置づけ

IELRはCanonical LRの全状態をそのまま作るのではなく、LALRの状態を出発点にして、LR(1)の認識能力を失う原因になった状態だけを分割する。

lane annotationsは、状態分割が必要な箇所を特定する材料である。annotationがあっても常に分割するとは限らない。状態を分割しても[[dominant-contribution|dominant contribution]]が変わらない場合は、分割不要と判定できる。

lane annotationsはparser runtimeが使う情報ではない。IELRのparser table生成時にだけ使う。

## goto-follow closuresとの関係

goto-follow closuresが「lookaheadがどのGOTOへ伝播するか」を計算し、lane annotationsが「その伝播がどの経路を通ってconflictに寄与したか」を記録する。

この2つを組み合わせ、LALRの小さい状態機械を基礎に、Canonical LRで必要な文脈の区別だけを復元する。

## 出典

- [The IELR(1) algorithm](https://malloy.people.clemson.edu/publications/papers/scp09/scp09.pdf)
- [IELR(1) parser tables](https://core.ac.uk/download/pdf/82047055.pdf)
- [IELR(1) implementation notes](https://branchtaken.com/reports/ielr1/ielr1)
