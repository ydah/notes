---
created: 2026-08-17
updated: 2026-08-17
---

# anonymous node

#parser #cst #tree-sitter

Tree-sitterのanonymous nodeは、文法中の文字列リテラルに対応するnode。"+"、"("、")"、"if"のように、文法へ直接書いた文字列から作られるtokenが該当する。

~~~javascript
if_statement: $ => seq(
  "if",
  "(",
  $.condition,
  ")",
  $.body,
)
~~~

この場合、conditionとbodyは[[named-node|named node]]、ifと括弧はanonymous nodeになる。anonymous nodeは省略されず、入力テキストに現れたtokenとして構文木に残る。

Tree-sitterのqueryでは、anonymous nodeの種類を文字列で書く。

~~~scheme
(binary_expression
  operator: "+")
~~~

named childだけを辿るAPIはanonymous nodeを飛ばす。全ての子を辿るAPIなら、演算子や括弧を含むlosslessな木を走査できる。anonymous nodeはAST的な走査では邪魔になりやすいが、[[lossless-syntax-tree|lossless syntax tree]]が具体的な表記を保持するために必要になる。

anonymous nodeかどうかは、tokenの意味ではなくgrammar上の書き方で決まる。名前付きruleではなく文字列リテラルとして直接書かれたtokenが該当する。[[alias|alias]]の名前に文字列リテラルを渡した場合もanonymous nodeになる。

## 出典

- [Basic Parsing](https://tree-sitter.github.io/tree-sitter/using-parsers/2-basic-parsing.html)
- [Basic Syntax](https://tree-sitter.github.io/tree-sitter/using-parsers/queries/1-syntax.html)
- [The Grammar DSL](https://tree-sitter.github.io/tree-sitter/creating-parsers/2-the-grammar-dsl.html)
