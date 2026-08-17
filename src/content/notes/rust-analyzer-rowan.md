---
created: 2026-08-17
updated: 2026-08-17
---

# rust-analyzer/rowan

#rust #rust-analyzer #rowan #parser #syntax-tree

rowanは、[[lossless-syntax-tree|lossless syntax tree]]のためのRustライブラリ。rust-analyzerが使う構文木の共通部分を汎用化したもので、rowan自体はRustのparserでもASTの型定義でもない。

rust-analyzerでは、おおまかに次の層に分かれる。

```text
parser
  ↓
GreenNode        構造とテキストを持つlosslessな木
  ↓
SyntaxNode       RedNode。親・位置を持つnavigation用のview
  ↓
AST              構文kindごとの型付きAPI
```

rust-analyzerの`syntax` crateがrowanをRust固有のAPIで包み、`ast`層がrawなrowan treeの上に型安全な操作を提供する。parserは別crateに分離されている。

この構造では、空白・コメントを含む入力を正確に表現できる。構文エラーを含む編集中の入力でも、できるだけ木を作り、IDEのsyntax highlightingや補完などを続ける。parserが返す構文エラーの情報と、木の中のエラー表現は分けて扱える。

Green Treeがimmutableで位置に依存しないため、subtreeを共有しやすい。Red/SyntaxNodeが親とoffsetを提供するので、IDEのnavigation APIからは通常の木のように扱える。変更時に一部のsubtreeだけを作り直す[[incremental-reparse|incremental reparse]]にもつながる。

rowanの設計を読むときは、[[red-green-tree|Red-Green Tree]]、[[green-tree|Green Tree]]、[[red-tree|Red Tree]]、[[cst|CST]]を一緒に見ると整理しやすい。

## 出典

- [rowan](https://github.com/rust-analyzer/rowan)
- [Syntax in rust-analyzer](https://rust-analyzer.github.io/book/contributing/syntax.html)
- [Architecture of rust-analyzer](https://rust-analyzer.github.io/book/contributing/architecture.html)
- [rust-analyzer syntax crate](https://rust-lang.github.io/rust-analyzer/syntax/index.html)
