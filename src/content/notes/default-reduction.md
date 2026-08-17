---
created: 2026-08-18
updated: 2026-08-18
---

# default reduction

#parser #compiler #lr #bison

default reductionは、現在のparser stateで、lookahead tokenを確認せずに先に実行してよいReduce。Bisonではparser tableのサイズを小さくするために使われる。

## tableでの扱い

parser tableを構築した後、Bisonは許可されたstateごとにlookahead集合が最大のReduceを選び、そのReduceのlookahead集合をtableから取り除いてdefault actionにする。

~~~text
state_i:
  lookaheadが多くのtokenで同じReduce
        ↓
  default reduction
~~~

default reductionを持つconsistent stateをdefaulted stateと呼ぶ。consistent stateは、もともと可能なparser actionが1つしかないstate。

## runtimeで起きること

defaulted stateに入ると、Bisonが次のtokenを得るために字句解析機をすぐ呼ぶとは限らない。lookahead tokenをまだ取得していないままReduceを実行し、Reduce後のstateでtokenが必要になった時点で初めて字句解析機を呼ぶ。

~~~text
stateに入る
   ↓
lookaheadを取得せずdefault reduction
   ↓
次のstateでtokenが必要になったら字句解析機を呼ぶ
~~~

default reductionは、構文的に不正な入力を受理するための機能ではない。ただし、不正なtokenを確認する前にReduceや[[semantic-action|semantic action]]が実行されるため、[[syntax-error|構文エラー]]の検出と[[error-recovery|error recovery]]の開始が遅れることがある。

## Bisonでの設定

どのstateにdefault reductionを許可するかは、次で指定できる。

~~~text
%define lr.default-reduction most
~~~

指定できる値は次の3つ。

- most — LALRとIELRのデフォルト。多くのstateでdefault reductionを許可する
- consistent — consistent stateだけで許可する
- accepting — accept stateだけで許可する。Canonical LRのデフォルト

default reductionを減らすとlookaheadを早く取得できるが、tableのサイズとのトレードオフになる。default reductionや[[nonassoc|%nonassoc]]によるエラー検出の遅れは、[[lookahead-correction|Lookahead Correction（LAC）]]で抑えられる。

## 出典

- [Default Reductions](https://www.gnu.org/software/bison/manual/html_node/Default-Reductions.html)
- [LAC](https://www.gnu.org/software/bison/manual/html_node/LAC.html)
