---
created: 2026-08-17
updated: 2026-08-17
---

# incremental computation

#compiler #incremental #salsa #rust-analyzer #semantic-analysis

入力の一部が変わったとき、計算結果をすべて捨てず、依存関係をたどって必要な計算だけを再実行する仕組み。日本語では増分計算。

コンパイラやIDEでは、入力とそこから導出される値をqueryとして扱う。

~~~text
source_text(file)
    ↓
syntax_tree(file)
    ↓
item_tree(file)
    ↓
def_map(crate)
    ↓
type_of(expression)
~~~

各queryは、キーから値を返す関数として考えられる。例えばsyntax_tree(file)はファイルのsource textに依存する。def_map(crate)は複数ファイルのitem treeに依存する。実行時にquery間の呼び出しを記録すると、依存グラフができる。

incremental computation engineは、queryの結果と依存関係をmemoizeする。入力が変わったときの流れは概ね次のようになる。

- 入力queryの値を更新し、revisionを進める
- 必要になったqueryについて、依存先が変わったかを確認する
- 依存先が変わっていなければ、memoizedされた結果を再利用する
- 依存先が変わっていればqueryを再実行する
- 再実行後の結果が以前と同じなら、上位のqueryへの変更伝播を止める

最後の動作は[[early-cutoff|early cutoff]]と呼ばれる。入力のsource textが変わっても、ASTの構造やitem treeの内容が同じなら、依存するqueryまで再計算しない。

rust-analyzerは、incremental and on-demand computationにSalsaを使う。queryの結果は必要になった時点で計算されるため、入力変更のたびにすべての意味解析を先回りして実行しない。Salsaは入力queryと、入力から値を導出するpureなquery functionを持ち、結果をmemoizeして再利用する。

例えば関数のbodyだけを編集した場合、bodyや型推論に関係するqueryは再計算する。一方、関数名や公開itemの一覧など、変わっていない情報は設計次第で再利用できる。rust-analyzerはItemTreeをfunction bodyの変更に対して安定させ、crate全体の情報が不必要に無効化されるのを防ぐ。

[[incremental-reparse|incremental reparse]]は、古い構文木を使ってソースの変更範囲だけを再解析する仕組み。incremental computationは、構文木に限らず、[[name-resolution|名前解決]]・[[type-inference|型推論]]・意味モデルなどの計算にも適用できる。部分再解析は、より大きなincremental computationの一段階として使える。

incremental computationには、依存関係の記録と、変更後の結果が同じかを判定できるquery境界が必要である。依存関係が粗すぎると再計算が増える。細かすぎると依存グラフとmemoの管理コストが増える。

## 出典

- [Salsa: The red-green algorithm](https://salsa-rs.github.io/salsa/reference/algorithm.html)
- [Salsa - rust-analyzer](https://rust-analyzer.github.io/book/contributing/guide.html)
- [Architecture of rust-analyzer](https://rust-analyzer.github.io/book/contributing/architecture.html)
- [Durable Incrementality](https://rust-analyzer.github.io/blog/2023/07/24/durable-incrementality.html)
