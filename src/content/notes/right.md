---
created: 2026-09-06
updated: 2026-09-06
---

# %right

#parser #compiler #lr #bison

`%right`は、GNU Bisonでtokenのprecedenceとright associativityを同時に指定する[[precedence-declaration|precedence declaration]]。

~~~text
%right '='
~~~

同じprecedenceの演算子が連続した場合、右側から先にまとめる。

~~~text
x = y = z

x = (y = z)
~~~

LR parserのACTION表で、規則とlookahead tokenが同じprecedenceのshift/reduce conflictを起こした場合、`%right`はShiftを選ぶ。右側の式を先に読み進め、後でreduceするため。

[[left|%left]]は同じ状況でReduceを選び、左結合にする。[[nonassoc|%nonassoc]]はどちらも選ばずsyntax errorにする。

## 出典

- [Bison Manual: Precedence Decl](https://www.gnu.org/software/bison/manual/html_node/Precedence-Decl.html)
- [Bison Manual: How Precedence Works](https://www.gnu.org/software/bison/manual/html_node/How-Precedence.html)
