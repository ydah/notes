---
created: 2026-08-18
updated: 2026-08-18
---

# default reduction

#parser #compiler #lr #bison

default reductionは、現在のparser stateでlookahead tokenを確認せずに実行するReduce。Bisonではparser tableを小さくするために使う。

## tableでの扱い

parser tableの構築後、Bisonは許可されたstateごとにlookahead集合が最大のReduceを選ぶ。そのReduceのlookahead集合をtableから取り除き、default actionにする。

~~~text
state_i:
  lookaheadが多くのtokenで同じReduce
        ↓
  default reduction
~~~

default reductionを持つconsistent stateをdefaulted stateと呼ぶ。consistent stateは、もともと可能なparser actionが1つしかないstate。

## runtimeで起きること

defaulted stateに入っても、Bisonは次のtokenを得るために字句解析機をすぐ呼ぶとは限らない。lookahead tokenを取得せずにReduceし、その後のstateでtokenが必要になった時点で初めて字句解析機を呼ぶ。

~~~text
stateに入る
   ↓
lookaheadを取得せずdefault reduction
   ↓
次のstateでtokenが必要になったら字句解析機を呼ぶ
~~~

default reductionは、構文的に不正な入力を受理する機能ではない。ただし、不正なtokenを確認する前にReduceや[[semantic-action|semantic action]]を実行する。このため、[[syntax-error|構文エラー]]の検出と[[error-recovery|error recovery]]の開始が遅れることがある。

## Bisonでの設定

どのstateにdefault reductionを許可するかは、次で指定できる。

~~~text
%define lr.default-reduction most
~~~

指定できる値は次の3つ。

- most — LALRとIELRのデフォルト。多くのstateでdefault reductionを許可する
- consistent — consistent stateだけで許可する
- accepting — accept stateだけで許可する。Canonical LRのデフォルト

default reductionを減らすとlookaheadを早く取得できる一方、tableは大きくなる。default reductionや[[nonassoc|%nonassoc]]によるエラー検出の遅れは、[[lookahead-correction|Lookahead Correction（LAC）]]で抑えられる。

## 出典

- [Default Reductions](https://www.gnu.org/software/bison/manual/html_node/Default-Reductions.html)
- [LAC](https://www.gnu.org/software/bison/manual/html_node/LAC.html)
