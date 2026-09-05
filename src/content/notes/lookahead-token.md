---
created: 2026-08-18
updated: 2026-08-18
---

# lookahead token

#parser #compiler #lr

lookahead tokenは、字句解析機が返した、まだparser stackへShiftされていない次のtoken。

## stackの外に置かれる

LR parserはtokenを読み取ってすぐにstackへ積むとは限らない。まずlookaheadとしてstackの外に保持し、現在のstateと組み合わせて[[parsing-table|構文解析表]]のactionを決める。

~~~text
入力:       NUMBER "+" NUMBER
lookahead:  NUMBER
stack:      まだNUMBERをShiftしていない
~~~

lookaheadを見てReduceを選んだ場合、同じtokenはReduce中もstackの外に残る。そのtokenをShiftするactionになった時点で、初めてstackへ移される。

これにより、入力を先に消費せずに、現在の構文のまとまりを閉じるか、lookaheadを現在の構造の続きとして読むかを選べる。

## token列とFOLLOW集合との違い

lookahead tokenは、現在の入力に実際に存在する一つのtoken。[[follow-set|FOLLOW集合]]やLR(1) itemのlookahead集合は、文法とparser stateから計算した「来る可能性のあるtoken」の集合。

~~~text
FOLLOW(A) = { "+", ")", "$" }
実際のlookahead = ")"
~~~

文法上の候補集合と、parser runtimeが実際に見ているtokenは異なる。

%nonassocや[[default-reduction|default reduction]]があると、parserはlookahead tokenを取得する前にReduceを進めることがある。[[lookahead-correction|Lookahead Correction（LAC）]]は、取得済みのlookahead tokenを一時的なstackで先に試す。

## LL parserとの違い

LL(1)のlookaheadも次に読むtokenを指す。LL parserは現在の非終端記号に対する生成規則を選ぶために使う。LR parserは現在のstateとlookahead tokenからShift・Reduceなどのparser actionを決める。

## 出典

- [Lookahead Tokens](https://www.gnu.org/software/bison/manual/html_node/Lookahead.html)
- [Parser States](https://www.gnu.org/software/bison/manual/html_node/Parser-States.html)
