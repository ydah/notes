---
created: 2026-08-17
updated: 2026-08-17
---

# 遷移関数

#parser #compiler #automata #lr

状態機械で、現在の状態と入力記号から次の状態を求める関数。決定性有限オートマトンなら、状態qと入力記号aに対して次のように書ける。

~~~text
δ(q, a) = qʹ
~~~

同じ入力を同じ状態で読んだときに次の状態が1つに決まるなら決定的な遷移関数になる。遷移できない組み合わせをエラーとして扱うか、dead stateへ遷移させるかは状態機械の設計による。

## LRオートマトンの遷移

LRパーサーでは、LR項の集合を状態として扱う。状態Iと文法記号Xから次の項集合を求める操作をGOTOと書く。

~~~text
GOTO(I, X) = J
~~~

例えば次の文法を考える。

~~~text
Sʹ -> expr
expr -> NUMBER
~~~

開始状態I0にSʹ -> . exprとexpr -> . NUMBERが含まれるなら、概念的には次の遷移がある。

~~~text
GOTO(I0, NUMBER) = I1
GOTO(I0, expr)   = I2
~~~

Xが終端記号なら、入力を読んで状態を進める[[shift|Shift]]の遷移に対応する。Xが非終端記号なら、[[reduce|Reduce]]の後にスタック頂上の状態と左辺記号を使って次の状態を求める遷移に対応する。

## 遷移関数とGOTO表

遷移関数はLR項集合から状態グラフを作るための数学的な操作で、GOTO表はその状態に番号を付けて表にしたもの。実行時には、[[parsing-table|構文解析表]]のうち非終端記号を列に持つ部分をGOTO表として使う。

一方、終端記号に対するparserの動作は、単に次の状態を返すだけではない。ACTION表はlookaheadに応じてShift、Reduce、[[accept|Accept]]、Errorなどの操作を返す。したがって、LRオートマトンの遷移関数と、実行時のACTION/GOTO表は関連するが同じものではない。

既存の[[goto-table|GOTO表]]では、生成された表の意味を扱っている。こちらでは、表を作る元になる状態グラフの遷移に焦点を置く。

## 出典

- [Parser States](https://www.gnu.org/software/bison/manual/html_node/Parser-States.html)
- [LR Table Construction](https://www.gnu.org/software/bison/manual/html_node/LR-Table-Construction.html)
- [Compilers Lecture 7](https://cs.nyu.edu/~gottlieb/courses/2000s/2008-09-fall/compilers/lectures/lecture-07.html)
