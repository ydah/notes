---
created: 2026-08-17
updated: 2026-08-17
---

# incremental computation

#compiler #incremental #salsa #rust-analyzer #semantic-analysis

入力の一部が変わったとき、計算結果をすべて捨てて最初から計算し直すのではなく、依存関係をたどって必要な計算だけを再実行する仕組み。日本語では増分計算。

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

各queryは、キーから値を返す関数として考えられる。例えばsyntax_tree(file)はファイルのsource textに依存し、def_map(crate)は複数ファイルのitem treeに依存する。実行時にどのqueryがどのqueryを呼び出したかを記録すると、依存グラフができる。

incremental computation engineは、queryの結果と依存関係をmemoizeする。入力が変わったときの流れは概ね次のようになる。

- 入力queryの値を更新し、revisionを進める
- 必要になったqueryについて、依存先が変わったかを確認する
- 依存先が変わっていなければ、memoizedされた結果を再利用する
- 依存先が変わっていればqueryを再実行する
- 再実行後の結果が以前と同じなら、上位のqueryへの変更伝播を止める

最後の動作はearly cutoffと呼ばれる。入力のsource textが変わっても、ASTの構造やitem treeの内容が変わらなければ、その結果に依存するqueryまで再計算しなくてよい。

rust-analyzerでは、Salsaをincremental and on-demand computationのために使う。queryの結果は必要になった時点で計算されるので、入力変更のたびにすべての意味解析を先回りして実行するわけではない。Salsaは入力queryと、入力から値を導出するpureなquery functionを持ち、結果をmemoizeして再利用する。

例えば関数のbodyだけを編集した場合、関数のbodyや型推論に関係するqueryは再計算が必要になる。一方、関数名や公開itemの一覧のように変更されていない情報は、設計次第で以前の結果を再利用できる。rust-analyzerでは、ItemTreeがfunction bodyの変更に対して安定するようにし、crate全体の情報を不必要に無効化しない設計がある。

[[incremental-reparse|incremental reparse]]は、古い構文木を使ってソースの変更範囲だけを再解析する仕組み。incremental computationは、構文木に限らず、[[name-resolution|名前解決]]・[[type-inference|型推論]]・意味モデルなどの計算にも適用できる。部分再解析は、より大きなincremental computationの一段階として使える。

incremental computationは単に「変更された箇所だけを処理する」ことではない。何が何に依存するかを正しく記録し、変更後の結果が同じかを判定できるようにqueryの境界を設計する必要がある。依存関係が粗すぎると再計算が増え、細かすぎると依存グラフとmemoの管理コストが増える。

## 出典

- [Salsa: The red-green algorithm](https://salsa-rs.github.io/salsa/reference/algorithm.html)
- [Salsa - rust-analyzer](https://rust-analyzer.github.io/book/contributing/guide.html)
- [Architecture of rust-analyzer](https://rust-analyzer.github.io/book/contributing/architecture.html)
- [Durable Incrementality](https://rust-analyzer.github.io/blog/2023/07/24/durable-incrementality.html)
