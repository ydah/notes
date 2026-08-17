---
created: 2026-08-17
updated: 2026-08-17
---

# alias

#parser #grammar #cst #tree-sitter

Tree-sitterの文法で、ruleが構文木に現れる名前を別の名前へ変える指定。文法上は既存のruleを使いながら、tree上では別のnode kindとして見せられる。

~~~javascript
property: $ => seq(
  alias($.identifier, $.property_name),
  ":",
  $.value,
)
~~~

この例では、identifierの構文を使っているが、propertyの子はproperty_nameというnamed nodeとして現れる。同じruleを複数の文脈で使い、treeやqueryの上では役割ごとに別の名前で扱いたいときに使える。

aliasの第2引数が名前付きruleへの参照なら、結果は[[named-node|named node]]になる。文字列リテラルなら[[anonymous-node|anonymous node]]になる。

~~~javascript
alias($.identifier, $.property_name) // named node
alias($.identifier, "property")       // anonymous node
~~~

aliasは入力にマッチする文字列を変えない。変わるのは構文木上のnode名で、grammar上の元のrule名や実際のテキストと区別して考える必要がある。生成されたnode-types.jsonやqueryでは、alias後のnode名が現れる。

supertype ruleにaliasを付ける場合は注意が必要。aliasされたnodeは名前の上ではsupertypeに見えても、supertypeのsubtypeを透過的にまとめて扱う性質までは引き継がない。

## 出典

- [The Grammar DSL](https://tree-sitter.github.io/tree-sitter/creating-parsers/2-the-grammar-dsl.html)
- [Writing the Grammar](https://tree-sitter.github.io/tree-sitter/creating-parsers/3-writing-the-grammar.html)
- [Static Node Types](https://tree-sitter.github.io/tree-sitter/using-parsers/6-static-node-types)
