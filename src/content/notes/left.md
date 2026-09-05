---
created: 2026-09-06
updated: 2026-09-06
---

# %left

#parser #compiler #lr #bison

`%left`は、GNU Bisonでtokenのprecedenceとleft associativityを同時に指定する[[precedence-declaration|precedence declaration]]。

~~~text
%left '+' '-'
~~~

同じprecedenceの演算子が連続した場合、左側から先にまとめる。

~~~text
x - y - z

(x - y) - z
~~~

LR parserのACTION表で、規則とlookahead tokenが同じprecedenceのshift/reduce conflictを起こした場合、`%left`はReduceを選ぶ。左側の式を完成させてから、次の演算子を処理するため。

[[right|%right]]は同じ状況でShiftを選び、右結合にする。[[nonassoc|%nonassoc]]はどちらも選ばずsyntax errorにする。

## 出典

- [Bison Manual: Precedence Decl](https://www.gnu.org/software/bison/manual/html_node/Precedence-Decl.html)
- [Bison Manual: How Precedence Works](https://www.gnu.org/software/bison/manual/html_node/How-Precedence.html)
