---
created: 2026-08-17
updated: 2026-08-17
---

# hidden rule

#parser #grammar #cst #tree-sitter

hidden ruleは、Tree-sitterの構文木に対応するnodeを作らないgrammar rule。rule名をアンダースコアで始めるとhiddenになり、定義した構造が親ruleへ展開されたように木へ現れる。

~~~javascript
call_expression: $ => seq(
  $._expression,
  "(",
  ")",
),

_expression: $ => choice(
  $.identifier,
  $.call_expression,
)
~~~

_expressionのようなwrapper nodeを木へ残すと、別のnodeを包むだけの層が増える場合がある。hidden ruleはこの補助的な層を隠し、identifierやcall_expressionのような具体的なnodeを直接たどりやすくする。

hidden ruleの定義や参照は消えない。隠されるのはrule自身のnodeであり、定義内のvisibleなnodeやtokenは親の子として残る。[[named-node|named node]]と[[anonymous-node|anonymous node]]の違いは、作られたnodeが名前を持つかどうかにある。hidden ruleは、rule自身のnodeを作るかどうかを制御する別の仕組み。

Tree-sitterでは、expressionやtypeのような抽象カテゴリをsupertypesに指定できる。supertype ruleは名前がアンダースコアで始まらなくても構文木から隠される。queryでは、配下のsubtypeをsupertypeとしてまとめて扱える。

hidden ruleには[[alias|alias]]で別名を付けられる。見えるnode名を与えると、hiddenなruleの構造を特定のnode kindとして利用できる。

## 出典

- [Writing the Grammar](https://tree-sitter.github.io/tree-sitter/creating-parsers/3-writing-the-grammar.html)
- [The Grammar DSL](https://tree-sitter.github.io/tree-sitter/creating-parsers/2-the-grammar-dsl.html)
- [Static Node Types](https://tree-sitter.github.io/tree-sitter/using-parsers/6-static-node-types)
