---
created: 2026-08-18
updated: 2026-08-18
---

# lookahead token

#parser #compiler #lr

lookahead tokenは、字句解析機が返したが、まだparser stackへShiftされていない次のtoken。

## stackの外に置かれる

LR parserはtokenを読み取ってすぐにstackへ積むとは限らない。tokenはまずlookaheadとしてstackの外に保持され、現在のstateと組み合わせて[[parsing-table|構文解析表]]のactionを決める。

~~~text
入力:       NUMBER "+" NUMBER
lookahead:  NUMBER
stack:      まだNUMBERをShiftしていない
~~~

lookaheadを見てReduceを選んだ場合、Reduceの間も同じtokenはstackの外に残る。Reduceが終わり、そのtokenをShiftするactionになった時点で初めてstackへ移される。

これにより、入力を先に消費せずに、現在の構文のまとまりを閉じるか、lookaheadを現在の構造の続きとして読むかを選べる。

## token列とFOLLOW集合との違い

lookahead tokenは、現在の入力に実際に存在する一つのtoken。[[follow-set|FOLLOW集合]]やLR(1) itemのlookahead集合は、文法とparser stateから計算した「来る可能性のあるtoken」の集合。

~~~text
FOLLOW(A) = { "+", ")", "$" }
実際のlookahead = ")"
~~~

集合全体を持つことと、parser runtimeが今見ているtokenを持つことは別。

%nonassocや[[default-reduction|default reduction]]があると、parserはlookahead tokenを取得する前にReduceを進めることがある。[[lookahead-correction|Lookahead Correction（LAC）]]は、取得済みのlookahead tokenを一時的なstackで先に試す。

## LL parserとの違い

LL(1)でいうlookaheadも次に読むtokenを指すが、用途は現在の非終端記号に対してどの生成規則を選ぶかの判断。LR parserでは現在のstateとlookahead tokenからShift・Reduceなどのparser actionを決める。

## 出典

- [Lookahead Tokens](https://www.gnu.org/software/bison/manual/html_node/Lookahead.html)
- [Parser States](https://www.gnu.org/software/bison/manual/html_node/Parser-States.html)
