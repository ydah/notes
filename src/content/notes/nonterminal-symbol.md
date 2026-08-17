---
created: 2026-08-17
updated: 2026-08-17
---

# 非終端記号

#formal-language #grammar #parser

[[production-rule|生成規則]]によって、より小さな記号列へ展開される記号。式、文、宣言のような構文上のまとまりを表す。非終端記号そのものが入力tokenになるわけではない。

例えば、

```text
expr -> term "+" term
term -> NUMBER
```

では`expr`と`term`が非終端記号、`"+"`と`NUMBER`が[[terminal-symbol|終端記号]]。`expr -> ...`のような[[production-rule|生成規則]]の左辺には非終端記号が来る。

文法全体を表す開始記号も非終端記号。パーサーは入力を読みながら、[[production-rule|生成規則]]を使って終端記号の列を非終端記号のまとまりとして認識する。非終端記号の右辺に[[epsilon|ε]]を指定すれば、そのまとまりを入力を消費せずに生成できる。

## 出典

- [Language and Grammar](https://www.gnu.org/software/bison/manual/html_node/Language-and-Grammar.html)
- [Symbols, Terminal and Nonterminal](https://www.gnu.org/software/bison/manual/html_node/Symbols.html)
