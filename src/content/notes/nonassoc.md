---
created: 2026-08-18
updated: 2026-08-18
---

# %nonassoc

#parser #compiler #lr #bison

%nonassocは、Bisonでtokenのprecedenceを宣言しつつ、そのtokenを左結合にも右結合にもできないことを指定する宣言。

## operatorの連続使用をエラーにする

例えば比較演算子を一つの式に一度だけ許すなら、次のように書く。

~~~text
%nonassoc '<' '>'
~~~

この宣言によって<と>は同じprecedenceになり、同じprecedenceのtokenが繰り返し現れるshift/reduce conflictはsyntax errorとして扱われる。

~~~text
a < b       # 許可
a < b < c   # syntax error
~~~

%leftなら左側にまとめ、%rightなら右側にまとめる場面で、%nonassocはどちらにもまとめずparser actionをerrorにする。

## precedence宣言との違い

%left、%right、%nonassocは、tokenのprecedenceとassociativityを同時に宣言する。異なる宣言行に書いたtokenは、後の行ほど高いprecedenceになる。

%precedenceはprecedenceだけを宣言し、associativityは指定しない。そのため、associativityに関係するconflictをビルド時に残せる。%nonassocは、同じprecedenceの組み合わせをruntimeのsyntax errorにする。

## エラー検出への影響

%nonassocによるerror actionは、入力tokenを見て初めて実行できる。さらにdefault reductionやparser stateのmergeがあると、tokenを確認する前にReduceが進むことがある。

このため、%nonassocは[[default-reduction|default reduction]]と同じく、[[syntax-error|構文エラー]]の検出や[[error-recovery|error recovery]]の開始を遅らせる要因になる。[[lookahead-correction|Lookahead Correction（LAC）]]は、通常のstackを変更せずにtokenを受理できるかを先に調べる。

## 出典

- [Precedence Decl](https://www.gnu.org/software/bison/manual/html_node/Precedence-Decl.html)
- [Specifying Operator Precedence](https://www.gnu.org/software/bison/manual/html_node/Using-Precedence.html)
- [LAC](https://www.gnu.org/software/bison/manual/html_node/LAC.html)
