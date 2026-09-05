---
created: 2026-08-17
updated: 2026-08-17
---

# alias

#parser #grammar #cst #tree-sitter

Tree-sitterのaliasは、ruleが構文木に現れるときの名前を変える指定。文法では既存のruleを使い、treeでは別のnode kindとして見せられる。

~~~javascript
property: $ => seq(
  alias($.identifier, $.property_name),
  ":",
  $.value,
)
~~~

この例ではidentifierの構文を使う一方、propertyの子はproperty_nameというnamed nodeとして現れる。同じruleを複数の文脈で使い、treeやqueryでは役割ごとに別名で扱いたいときに使う。

aliasの第2引数が名前付きruleへの参照なら、結果は[[named-node|named node]]になる。文字列リテラルなら[[anonymous-node|anonymous node]]になる。

~~~javascript
alias($.identifier, $.property_name) // named node
alias($.identifier, "property")       // anonymous node
~~~

aliasは入力にマッチする文字列を変えない。変わるのは構文木上のnode名だけで、grammar上のrule名や実際のテキストとは区別する。生成されたnode-types.jsonやqueryにはalias後のnode名が現れる。

supertype ruleにaliasを付ける場合、aliasされたnodeは名前の上ではsupertypeに見える。ただし、subtypeを透過的にまとめて扱う性質までは引き継がない。

## 出典

- [The Grammar DSL](https://tree-sitter.github.io/tree-sitter/creating-parsers/2-the-grammar-dsl.html)
- [Writing the Grammar](https://tree-sitter.github.io/tree-sitter/creating-parsers/3-writing-the-grammar.html)
- [Static Node Types](https://tree-sitter.github.io/tree-sitter/using-parsers/6-static-node-types)
