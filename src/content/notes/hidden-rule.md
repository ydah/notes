---
created: 2026-08-17
updated: 2026-08-17
---

# hidden rule

#parser #grammar #cst #tree-sitter

Tree-sitterの構文木に、対応するnodeを作らないgrammar rule。rule名をアンダースコアで始めると、そのruleはhiddenになり、定義された構造が親ruleへ展開されたように木へ現れる。

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

_expressionのようなwrapper nodeをそのまま木へ残すと、単に別のnodeを包むだけの層が増える場合がある。hidden ruleはこの構文上の補助的な層を隠し、identifierやcall_expressionのような具体的なnodeを直接たどりやすくするために使う。

hidden ruleの定義や参照が消えるわけではない。隠されるのはrule自身のnodeであり、定義の中にあるvisibleなnodeやtokenは親の子として残る。[[named-node|named node]]や[[anonymous-node|anonymous node]]とは、nodeを作るかどうかを制御する別の仕組み。

Tree-sitterには、expressionやtypeのような抽象カテゴリをsupertypesとして指定する仕組みもある。supertype ruleは名前がアンダースコアで始まらなくても構文木から隠され、queryではsupertypeとして配下のsubtypeをまとめて扱える。

hidden ruleは[[alias|alias]]で別名を付けられる。aliasで見えるnode名を与えると、hiddenなruleの構造を特定のnode kindとして利用できる。

## 出典

- [Writing the Grammar](https://tree-sitter.github.io/tree-sitter/creating-parsers/3-writing-the-grammar.html)
- [The Grammar DSL](https://tree-sitter.github.io/tree-sitter/creating-parsers/2-the-grammar-dsl.html)
- [Static Node Types](https://tree-sitter.github.io/tree-sitter/using-parsers/6-static-node-types)
