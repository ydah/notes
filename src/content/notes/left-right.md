---
created: 2026-08-20
updated: 2026-08-20
---

# %left、%right

#parser #compiler #lr #bison

%leftと%rightは、GNU Bisonでtokenのprecedenceとassociativityを同時に指定するprecedence declaration。tokenを宣言する点は%tokenと同じだが、演算子を繰り返したときの結合方向と、parser tableのshift/reduce conflictの解決方法も指定する。

~~~text
%left  '+' '-'
%left  '*' '/'
%right '^'
~~~

同じ宣言行に並べたtokenは、同じprecedenceとassociativityを持つ。宣言行は上から下へ読み、後に書いた行ほどprecedenceが高い。上の例では+と-より*と/の方が強く、^が最も高い。

## %left

%leftはleft-associativeを指定する。「x - y - z」のように同じprecedenceの演算子が連続した場合、左側から先にまとめる。

~~~text
(x - y) - z
~~~

LR parserのACTION表で、左辺の規則をreduceできる状態に同じprecedenceのlookahead tokenが来た場合、%leftはReduceを選ぶ。先に左側の式を完成させてから、次の演算子を処理するため。

## %right

%rightはright-associativeを指定する。「x = y = z」のように同じprecedenceの演算子が連続した場合、右側から先にまとめる。

~~~text
x = (y = z)
~~~

同じprecedenceでReduceとShiftが競合した場合、%rightはShiftを選ぶ。右側の式を先に読み進めて、後でまとめてreduceするため。

## precedenceの比較

%leftと%rightが影響するのは、主にshift/reduce conflict。lookahead tokenのprecedenceが規則のprecedenceより高ければShift、規則の方が高ければReduceを選ぶ。同じprecedenceならassociativityを使う。

規則のprecedenceは、デフォルトでは右辺に現れる最後のterminal symbolから決まる。規則に別のprecedenceを与えたい場合は%precを使う。

precedenceが付いていないtokenまたは規則がconflictに関係する場合、BisonのデフォルトはShiftである。%leftと%rightは文法の曖昧性を一般に消すのではなく、特定のconflictに対するactionの選択を宣言する。

## %nonassocとの違い

同じprecedenceの演算子を繰り返したとき、左にも右にも結合させたくないなら[[nonassoc|%nonassoc]]を使う。%leftならReduce、%rightならShiftになる場面で、%nonassocはruntimeのsyntax errorを選ぶ。

%precedenceはprecedenceだけを与え、associativityを指定しない。associativityに関係するconflictを残して、Bisonにcompile-time errorとして報告させたい場合に使える。

%leftと%rightは、一般の[[lr-parser|LRパーサー]]のtable生成時にconflictを解決する宣言。演算子間の関係を直接使って式を解析する[[precedence-parsing|順位構文解析]]そのものではない。

## 出典

- [Bison Manual: Precedence Decl](https://www.gnu.org/software/bison/manual/html_node/Precedence-Decl.html)
- [Bison Manual: Using Precedence](https://www.gnu.org/software/bison/manual/html_node/Using-Precedence.html)
- [Bison Manual: How Precedence Works](https://www.gnu.org/software/bison/manual/html_node/How-Precedence.html)
- [Bison Manual: Infix Notation Calculator](https://www.gnu.org/software/bison/manual/html_node/Infix-Calc.html)
