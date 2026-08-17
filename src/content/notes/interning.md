---
created: 2026-08-17
updated: 2026-08-17
---

# interning

#compiler #syntax-tree #incremental #rust-analyzer

同じ値を何度も作る代わりに、等しい値を一つの共有された表現へ対応づける最適化。文字列、token、構文木のnodeなどをinterningすると、同じ内容のデータを複数回allocateせずに済む。

Green Treeでは、nodeがimmutableであることがinterningを使いやすくする。変更されないnodeは書き換えられないため、同じtokenやsubtreeを複数箇所から安全に共有できる。

例えば、同じtokenが2回現れる入力では、概念的には次のような共有ができる。

~~~text
1 + 1
  ↘   ↙
   同じ「1」のtokenを共有
~~~

rust-analyzerの資料では、1 + 1に含まれる2つの1 tokenが同じtokenを共有し、同じwhitespace tokenも共有できる例が示されている。より大きなsubtreeでも、同じ構造なら共有できる。

interningは、単に変更されていないsubtreeを再利用するpersistent treeの構造共有とは少し違う。構造共有は既存のchildを新しい親から参照するだけでも実現できる。interningは、同じ内容の値を比較して既存の代表へ戻す処理まで行う。

構文木のinterningには次の効果がある。

- tokenやnodeごとのallocationを減らす
- 同じ構造のsubtreeを共有してメモリ使用量を減らす
- immutableな木の更新で、変更された経路だけを作り直しやすくする
- 共有されたGreen nodeを[[red-tree|Red Tree]]やSyntaxNodeから異なる出現位置として扱える

Green nodeが同じ内容を持つことと、構文木上の同じ出現位置であることは別。例えば、同じ式がファイル中に2回現れると、Green Treeでは同じ構造として共有できても、親やoffsetを持つRed nodeでは別のnode identityになる。

interningの実装は、必ずグローバルなtableや整数IDを使うとは限らない。rust-analyzerのGreen Treeでは、interningの結果はArc<Node>であり、tableのindexを保持しなくてもtree単体で生きられる。internerの有効範囲も実装によって異なり、資料上は現在per-fileで作られる。

interningはGreen Treeの必須条件ではない。[[green-tree|Green Tree]]は、構造とテキストをimmutableに保持する設計そのものを指し、interningはその上に加えられるallocation・共有の最適化。

## 出典

- [Syntax in rust-analyzer](https://rust-analyzer.github.io/book/contributing/syntax.html)
- [Architecture of rust-analyzer](https://rust-analyzer.github.io/book/contributing/architecture.html)
- [rowan](https://github.com/rust-analyzer/rowan)
