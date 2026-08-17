---
created: 2026-08-17
updated: 2026-08-17
---

# Green Tree

#parser #compiler #syntax-tree #incremental

Red-Green Treeのうち、構文の内容そのものを保持するimmutableな木。[[node|node]]のkind、子node、tokenの文字列、subtreeのtext lengthなどを持つ。

Green nodeは親pointerやファイル全体でのabsolute offsetを持たない。位置をnode自身に埋め込まないため、同じ構造のsubtreeを複数の場所から共有できる。実装によっては[[interning|interning]]も行うが、Green Tree一般の必須条件ではない。

Green Treeは「何が書かれているか」を持つデータ層で、親へ辿る・ファイル内の位置を求めるといった操作には向かない。そこに文脈を付けた操作用のviewが[[red-tree|Red Tree]]。

immutableなGreen Treeでは、ソースの一部を変更すると、変更箇所からrootまでの経路だけを作り直し、無関係なsubtreeを共有できる。これが[[incremental-reparse|incremental reparse]]やIDEでの編集に使いやすい理由。

rowanでは、Green Treeが[[lossless-syntax-tree|lossless syntax tree]]の中心になる。rust-analyzerのsyntax crateは、rowanのGreenNodeを使って構文木を作り、その上にRed/SyntaxNodeと型付き[[ast|AST]]を提供する。

## 出典

- [Syntax in rust-analyzer](https://rust-analyzer.github.io/book/contributing/syntax.html)
- [Architecture of rust-analyzer](https://rust-analyzer.github.io/book/contributing/architecture.html)
- [rowan](https://github.com/rust-analyzer/rowan)
