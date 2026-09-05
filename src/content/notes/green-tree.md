---
created: 2026-08-17
updated: 2026-08-17
---

# Green Tree

#parser #compiler #syntax-tree #incremental

Green Treeは、Red-Green Treeのうち構文の内容そのものを保持するimmutableな木。[[node|node]]のkind、子node、tokenの文字列、subtreeのtext lengthなどを持つ。

Green nodeは親pointerやファイル全体でのabsolute offsetを持たない。位置をnode自身に埋め込まないため、同じ構造のsubtreeを複数の場所から共有できる。[[interning|interning]]する実装もあるが、Green Treeの必須条件ではない。

Green Treeは「何が書かれているか」を持つデータ層。親を辿る、ファイル内の位置を求める、といった操作には向かない。そこに文脈を付けた操作用のviewが[[red-tree|Red Tree]]。

immutableなGreen Treeは、ソースの一部を変更したとき、変更箇所からrootまでの経路だけを作り直す。無関係なsubtreeを共有できるため、[[incremental-reparse|incremental reparse]]やIDEでの編集に向く。

rowanでは、Green Treeが[[lossless-syntax-tree|lossless syntax tree]]の中心になる。rust-analyzerのsyntax crateはrowanのGreenNodeで構文木を作り、その上にRed/SyntaxNodeと型付き[[ast|AST]]を提供する。

## 出典

- [Syntax in rust-analyzer](https://rust-analyzer.github.io/book/contributing/syntax.html)
- [Architecture of rust-analyzer](https://rust-analyzer.github.io/book/contributing/architecture.html)
- [rowan](https://github.com/rust-analyzer/rowan)
