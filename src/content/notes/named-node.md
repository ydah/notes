---
created: 2026-08-17
updated: 2026-08-17
---

# named node

#parser #cst #tree-sitter

Tree-sitterで、文法の名前付きruleに対応するnode。grammar.jsで、$.identifierのように名前付きruleを参照すると、そのruleに対応するnodeはnamed nodeになる。

~~~javascript
binary_expression: $ => seq(
  $.identifier,
  "+",
  $.identifier,
)
~~~

この例では、binary_expressionとidentifierがnamed nodeで、"+"は[[anonymous-node|anonymous node]]になる。named nodeは構文上のまとまりや、後から参照したいtokenを表すために使う。

Tree-sitterのqueryでは、named nodeを括弧で書く。

~~~scheme
(identifier) @name
~~~

node-types.jsonのnamedフィールドでも、そのnode kindがnamedかどうかを確認できる。parser APIにはnamed childだけを辿る操作があり、句読点や演算子などのanonymous nodeを飛ばして構造を走査できる。

named nodeは「意味解析済みのnode」という意味ではない。identifierがnamed nodeであっても、それがどの変数や定義を参照するかは[[semantic-less|semantic-less]]な構文木には含まれず、[[name-resolution|名前解決]]などの後段で決まる。

[[hidden-rule|hidden rule]]の中で参照されたnamed ruleは、hiddenな親nodeが木から消えても、子のnamed nodeとして木に残る。[[alias|alias]]で別名を付けると、元のruleがnamed nodeでも、構文木上では別のnamed nodeとして見える。

## 出典

- [Basic Parsing](https://tree-sitter.github.io/tree-sitter/using-parsers/2-basic-parsing.html)
- [The Grammar DSL](https://tree-sitter.github.io/tree-sitter/creating-parsers/2-the-grammar-dsl.html)
- [Static Node Types](https://tree-sitter.github.io/tree-sitter/using-parsers/6-static-node-types)
