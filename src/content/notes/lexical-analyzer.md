---
created: 2026-08-17
updated: 2026-08-17
---

# 字句解析機

#lexer #compiler #parser

入力文字列を読み、[[parser|構文解析器]]が扱うtokenへ変換するプログラム。英語ではlexical analyzer、lexer、scannerなどと呼ぶ。

入力文字列を[[lexeme|lexeme]]に分割し、各lexemeをtokenの種類へ分類する。

```text
入力:
x + 42

出力:
IDENT("x")
'+'
NUMBER(42)
EOF
```

tokenは通常、token kind、意味値、ソース位置などを持つ。`NUMBER(42)`では`NUMBER`が[[terminal-symbol|終端記号]]に対応するtoken kind、`42`が意味値になる。

空白やコメントは構文上不要なら読み飛ばすことが多い。一方、`<`と`<=`の区別のように、tokenを決めるために数文字先を読むこともある。

字句解析機はtoken列を最初に全部作る必要はない。[[parser|構文解析器]]から次のtokenを要求されたときに、1つずつ返す構成も一般的。GNU Bisonでは、生成されたparserが`yylex`を呼び、`yylex`がtoken kindを戻り値として返す。

字句解析機が担当するのは文字パターンの認識であり、tokenの並びが文法に合うかどうかは構文解析器が担当する。どの段階でエラーにするかは実装によって異なるが、不正な文字や閉じられていない文字列は字句解析のエラーになる。

入力の終端は[[eof|EOF]]としてparserへ伝える。

言語によっては、tokenの種類を決めるためにparserの状態が必要になる。[[pslr|PSLR]]は、現在のparser stateで受理できるtokenの集合を字句解析器の認識に使う方式。lexerとparserの境界を残しつつ、parserの文脈をtokenizeに反映できる。

## 出典

- [The Lexical Analyzer Function `yylex`](https://www.gnu.org/software/bison/manual/html_node/Lexical.html)
- [Calling Convention for `yylex`](https://www.gnu.org/software/bison/manual/html_node/Calling-Convention.html)
- [Compilers Lecture 3](https://cs.nyu.edu/~gottlieb/courses/compilers/lectures/lecture-03.html)
