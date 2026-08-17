---
created: 2026-08-17
updated: 2026-08-17
---

# anonymous node

#parser #cst #tree-sitter

Tree-sitterで、文法中の文字列リテラルに対応するnode。"+"、"("、")"、"if"のように、文法へ直接書いた文字列から作られるtokenがanonymous nodeになる。

~~~javascript
if_statement: $ => seq(
  "if",
  "(",
  $.condition,
  ")",
  $.body,
)
~~~

この場合、conditionとbodyは[[named-node|named node]]で、if・括弧はanonymous node。anonymous nodeは構文木から省略されるわけではなく、入力テキストに現れたtokenとして木に残る。

Tree-sitterのqueryでは、anonymous nodeの種類を文字列で書く。

~~~scheme
(binary_expression
  operator: "+")
~~~

named childだけを辿るAPIを使うとanonymous nodeを飛ばせる。全ての子を辿るAPIを使えば、演算子や括弧も含めてlosslessな木を走査できる。したがって、anonymous nodeはAST的な構造からは邪魔になりやすいが、[[lossless-syntax-tree|lossless syntax tree]]の具体的な表記を保持するために必要になる。

anonymous nodeかどうかは、tokenに意味があるかどうかではなく、grammarで名前付きruleとして定義されているか、文字列リテラルとして直接書かれているかで決まる。[[alias|alias]]の名前に文字列リテラルを渡した場合も、結果はanonymous nodeになる。

## 出典

- [Basic Parsing](https://tree-sitter.github.io/tree-sitter/using-parsers/2-basic-parsing.html)
- [Basic Syntax](https://tree-sitter.github.io/tree-sitter/using-parsers/queries/1-syntax.html)
- [The Grammar DSL](https://tree-sitter.github.io/tree-sitter/creating-parsers/2-the-grammar-dsl.html)
