---
created: 2026-08-20
updated: 2026-09-06
---

# precedence declaration

#parser #compiler #lr #bison

precedence declarationは、GNU Bisonでtokenのprecedenceとassociativityを指定する宣言。`%left`、`%right`、`%nonassoc`は両方を指定し、`%precedence`はprecedenceだけを指定する。

tokenを宣言する点は`%token`と同じだが、演算子を繰り返したときの結合方向と、parser tableのshift/reduce conflictの解決方法も指定する。

~~~text
%left  '+' '-'
%left  '*' '/'
%right '^'
~~~

同じ宣言行に並べたtokenは、同じprecedenceとassociativityを持つ。宣言行は上から下へ読み、後に書いた行ほどprecedenceが高い。上の例では`+`と`-`より`*`と`/`の方が強く、`^`が最も高い。

## conflictの解決

precedence declarationが影響するのは、主にshift/reduce conflict。lookahead tokenのprecedenceが規則のprecedenceより高ければShift、規則の方が高ければReduceを選ぶ。同じprecedenceならassociativityを使う。

[[left|%left]]はReduce、[[right|%right]]はShift、[[nonassoc|%nonassoc]]はsyntax errorを選ぶ。

規則のprecedenceは、デフォルトでは右辺に現れる最後のterminal symbolから決まる。規則に別のprecedenceを与えたい場合は`%prec`を使う。

precedenceが付いていないtokenまたは規則がconflictに関係する場合、BisonのデフォルトはShiftである。precedence declarationは文法の曖昧性を一般に消すのではなく、特定のconflictに対するactionの選択を宣言する。

## associativityを指定しない宣言

`%precedence`はprecedenceだけを与え、associativityを指定しない。associativityに関係するconflictを残して、Bisonにcompile-time errorとして報告させたい場合に使える。

precedence declarationは、一般の[[lr-parser|LRパーサー]]のtable生成時にconflictを解決する。演算子間の関係を直接使って式を解析する[[precedence-parsing|順位構文解析]]そのものではない。

## 出典

- [Bison Manual: Precedence Decl](https://www.gnu.org/software/bison/manual/html_node/Precedence-Decl.html)
- [Bison Manual: Using Precedence](https://www.gnu.org/software/bison/manual/html_node/Using-Precedence.html)
- [Bison Manual: How Precedence Works](https://www.gnu.org/software/bison/manual/html_node/How-Precedence.html)
- [Bison Manual: Infix Notation Calculator](https://www.gnu.org/software/bison/manual/html_node/Infix-Calc.html)
