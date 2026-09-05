---
created: 2026-08-17
updated: 2026-08-17
---

# Red Tree

#parser #compiler #syntax-tree

[[green-tree|Green Tree]]に構文木の文脈を加えた、操作用のview。Red nodeは親node、source file内のabsolute offset、nodeのidentityなどを扱える。

Green nodeには親pointerがないため、同じ構造のsubtreeが複数箇所に現れると、出現箇所を区別しにくい。Red nodeはGreen nodeへの参照に親と位置を加え、parent、children、siblingsを辿れるようにする。

Red TreeはGreen Treeの内容をもう一度すべて格納する木ではない。Green Treeを共有し、必要な文脈をRed側で持つ。したがって、同じGreen nodeでも、異なる親やoffsetを持つRed nodeとして見えることがある。

rust-analyzerの資料では`SyntaxNode`をRedNodeとも呼ぶ。実装がmemoized nodeかcursor viewかにかかわらず、Green Treeをnavigationしやすい形で見る層と捉えられる。

Red Treeの上に、構文kindごとの型付きAPIである[[ast|AST]]を重ねる。ASTはRed nodeを直接扱うコードより、`Function`や`CallExpr`のような意味のある型で構文を操作できる。

## 出典

- [Syntax in rust-analyzer](https://rust-analyzer.github.io/book/contributing/syntax.html)
- [Architecture of rust-analyzer](https://rust-analyzer.github.io/book/contributing/architecture.html)
- [rowan](https://github.com/rust-analyzer/rowan)
