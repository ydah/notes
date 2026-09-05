---
created: 2026-08-17
updated: 2026-08-17
---

# incremental reparse

#parser #compiler #syntax-tree #incremental

ソースコードの一部が編集されたとき、ファイル全体を最初から解析し直さず、変更の影響を受ける範囲だけを再解析する処理。古い構文木のうち変更されていないsubtreeを新しい木から再利用する。

例えば、次のコードの1を2へ変更した場合、変更されたリテラルから親へ至る経路を作り直す。別の関数や変更されていない式は共有できる。

~~~text
古い構文木
root
├── function_a       ← そのまま共有
└── function_b
    └── block
        └── literal 1 ← 2へ変更して再解析
~~~

概念的な処理は次のようになる。

~~~text
古いテキストと構文木
        ↓ 編集範囲を通知
変更範囲のoffsetや行・列を更新
        ↓ 再解析範囲を決める
部分parserで新しいsubtreeを作る
        ↓ 木を差し替える
変更されていないsubtreeを共有した新しい構文木
~~~

[[green-tree|Green Tree]]はimmutableで、親pointerやabsolute offsetを持たないため、この方式と相性がよい。変更されたsubtreeからrootまでの経路だけを作り直し、無関係なnodeを共有できる。[[interning|interning]]は同じtokenやsubtreeを共有し、allocationを減らす。

Tree-sitterでは、編集内容をTSInputEditとして古いtreeへ反映してから、そのtreeを渡してparserを再実行する。新旧のtreeは構造を内部共有する。編集前に取得したTSNodeを使い続ける場合は、そのnodeの位置にも同じ編集内容を反映する。

rust-analyzerの設計資料は、Green Treeへ変更を適用し、一つの中括弧ブロックに閉じ込められるかをheuristicに判定する方式を説明している。閉じ込められる場合は、そのブロックだけを再解析する。壊れた入力でも中括弧の対応を維持し、再解析範囲を決めやすくする。

incremental reparseは、常に部分解析になるとは限らない。括弧の追加・削除、インデント、文法上の曖昧さ、エラー回復などにより、変更の影響が親やファイル全体へ広がる場合がある。可能な範囲で再解析の作業量を減らす設計である。

構文木の部分的な再解析と、[[semantic-analysis|意味解析]]の部分的な再計算は異なる。[[semantic-less|semantic-less]]な構文木を更新したあと、名前解決や型推論などで無効化する情報は、別の[[incremental-computation|incremental computation]]で設計する。

## 出典

- [Syntax in rust-analyzer](https://rust-analyzer.github.io/book/contributing/syntax.html)
- [Advanced Parsing - Tree-sitter](https://tree-sitter.github.io/tree-sitter/using-parsers/3-advanced-parsing.html)
- [Introduction - Tree-sitter](https://tree-sitter.github.io/tree-sitter/index.html)
