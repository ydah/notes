---
created: 2026-08-17
updated: 2026-08-17
---

# Red-Green Tree

#parser #compiler #syntax-tree #incremental

構文木を、内容を保持する不変な木と、親や位置を持つ操作用のビューに分ける設計。Roslyn由来の用語で、rust-analyzerの`rowan`という名前もこの用語から来ている。

- [[green-tree|Green Tree]] — nodeの種類、子node、tokenの文字列など、構造そのものを保持する
- [[red-tree|Red Tree]] — Green Treeを包み、親、絶対offset、nodeのidentityを提供する
- [[ast|AST]] — Red/Greenの構文木の上に、型付きで扱いやすいAPIを提供することがある

Green Treeは親pointerやファイル全体での位置を持たない。そのため同じGreen nodeを別の親や別の位置から共有できる。ソースの一部を変更すると、変更されたnodeと祖先だけを作り直し、変更されていないsubtreeを再利用しやすい。

Red Treeは、Green Treeの内容を複製した別の完全な木ではない。Green Treeに文脈を加えたviewなので、同じ構造を複数の位置で扱える。親への移動やsource rangeの計算はRed側で行う。

この分離により、syntax treeをimmutableな値として扱いながら、IDEが必要とする親方向のnavigation、位置情報、部分更新を実装できる。[[cst|CST]]のlosslessな情報もGreen側に保持できる。

Red-Green Treeは特定のparser algorithmではない。[[lr-parser|LRパーサー]]や再帰下降パーサーのどちらでも、構文木の表現として採用できる。

## 出典

- [Syntax in rust-analyzer](https://rust-analyzer.github.io/book/contributing/syntax.html)
- [Architecture of rust-analyzer](https://rust-analyzer.github.io/book/contributing/architecture.html)
- [rowan](https://github.com/rust-analyzer/rowan)
