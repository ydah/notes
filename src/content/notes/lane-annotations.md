---
created: 2026-08-18
updated: 2026-08-18
---

# lane annotations

#parser #compiler #lr #ielr

lane annotationsは、IELR(1)の状態分割で、LALRのconflictにどの経路やlookaheadの寄与が関係しているかを記録するメタデータ。

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

conflictが見つかったとき、単にconflict stateだけを分割しても十分とは限らない。そのconflictへlookaheadを運んだ前方の状態やGOTO遷移も、異なるlaneを区別できるように分割する必要がある。

lane annotationは、次のような関係を状態やisocoreに付ける。

- どのconflictまたはinadequacyに関係するか
- どのtokenやreduce contributionが問題になっているか
- どの先行状態・GOTO遷移を通じて、その寄与が伝わったか

このannotationは、ソースコードや文法規則への注釈ではない。IELR parser tableを生成する途中で使う、状態機械上の解析結果。

## lane tracing

IELRのannotation計算では、conflictを含む状態から、先行状態へ向かってlaneを逆向きにたどる。[[goto-follow-closures|goto-follow closures]]で計算したfollow依存関係と、itemのlookahead依存関係を使って、conflictに寄与し得る経路だけを調べる。

laneは分岐・合流・ループを含むため、開始状態からの経路をすべて列挙すると組み合わせが増え続ける。そこで、同じ寄与関係を持つ複数のlaneをannotationにまとめ、状態ごとに伝播させる。

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

lane annotationsは、状態分割が必要な箇所を特定するための材料。annotationがあっても常に分割するとは限らず、状態を分割してもdominant contributionが変わらない場合は、分割が不要と判定できる。

したがって、lane annotationsはparser runtimeが実行時に使う情報ではなく、IELRのparser table生成時にだけ使われる。

## goto-follow closuresとの関係

goto-follow closuresが「lookaheadがどのGOTOへ伝播するか」を計算し、lane annotationsが「その伝播がどの経路を通ってconflictに寄与したか」を記録する。

この2つを組み合わせることで、LALRの小さい状態機械を基礎にしながら、Canonical LRで必要になる文脈の区別を必要な箇所だけ復元できる。

## 出典

- [The IELR(1) algorithm](https://malloy.people.clemson.edu/publications/papers/scp09/scp09.pdf)
- [IELR(1) parser tables](https://core.ac.uk/download/pdf/82047055.pdf)
- [IELR(1) implementation notes](https://branchtaken.com/reports/ielr1/ielr1)
