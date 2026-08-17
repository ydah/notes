---
created: 2026-08-17
updated: 2026-08-17
---

# early cutoff

#compiler #incremental #salsa #rust-analyzer

[[incremental-computation|incremental computation]]で、依存先が変わったためにqueryを再実行した結果、以前の結果と同じだった場合に、さらに上位のqueryへ変更を伝播させない最適化。日本語では早期打ち切り。

例えば、ファイルの空白だけが変わり、syntax treeの値が変わらなかったとする。

~~~text
source_text(file)
    ↓ 変更
syntax_tree(file) => 変更前と同じ値
    ↓ early cutoff
item_tree(crate) 以下のqueryは再実行しない
~~~

通常の無効化では、source textが変わるとそこから依存するqueryをすべて無効として扱う。early cutoffでは、無効化されたqueryが必要になったときに再実行して結果を確認する。結果が等しければ、依存先のqueryは変わっていないとみなして、変更の伝播をそこで止める。

これは単なるmemoizationとは少し違う。memoizationは同じ入力に対して保存済みの結果を再利用する仕組みだが、early cutoffでは依存先の変更後にqueryを再実行し、以前の結果と比較する。その比較で上位の再計算を省略する。

結果の同一性をどう判定するかが重要になる。ソース位置や変更時刻のような値までqueryの結果に含めると、意味のある構造が変わっていなくても結果が異なると判定される。どの情報をqueryの値に含めるかを分けておく必要がある。

Salsaではqueryの依存グラフと結果を記録し、入力変更後の検証を必要になった時点まで遅延させる。変更後にqueryを実行して結果が同じなら、そのqueryに依存する上位の計算を再実行せずに済む。

early cutoffは、[[incremental-reparse|incremental reparse]]のように入力の一部だけを再解析する仕組みではない。構文木、[[semantic-analysis|意味解析]]、型推論など、queryの依存関係を持つ計算全体に適用できる。

## 出典

- [Durable Incrementality](https://rust-analyzer.github.io/blog/2023/07/24/durable-incrementality.html)
- [Salsa - rust-analyzer](https://rust-analyzer.github.io/book/contributing/guide.html)
- [The red-green algorithm](https://salsa-rs.github.io/salsa/reference/algorithm.html)
