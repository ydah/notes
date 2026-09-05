---
created: 2026-08-17
updated: 2026-08-17
---

# early cutoff

#compiler #incremental #salsa #rust-analyzer

early cutoff（早期打ち切り）は、[[incremental-computation|incremental computation]]で変更の伝播を止める最適化。依存先の変更によってqueryを再実行しても以前と同じ結果なら、上位のqueryへ変更を伝播させない。

例えば、ファイルの空白だけが変わり、syntax treeの値が変わらなかったとする。

~~~text
source_text(file)
    ↓ 変更
syntax_tree(file) => 変更前と同じ値
    ↓ early cutoff
item_tree(crate) 以下のqueryは再実行しない
~~~

通常の無効化では、source textが変わると、それに依存するqueryをすべて無効として扱う。early cutoffでは、無効化されたqueryが必要になったときに再実行する。結果が等しければqueryは変わっていないとみなし、変更の伝播を止める。

early cutoffは単なるmemoizationとは異なる。memoizationは同じ入力に対して保存済みの結果を再利用する。early cutoffは依存先の変更後にqueryを再実行し、以前の結果との比較によって上位の再計算を省く。

結果の同一性をどう判定するかが重要になる。queryの結果にソース位置や変更時刻まで含めると、意味のある構造が同じでも結果は異なると判定される。queryの値に含める情報を分けておく必要がある。

Salsaはqueryの依存グラフと結果を記録し、入力変更後の検証を必要になるまで遅延させる。変更後にqueryを実行して結果が同じなら、そのqueryに依存する上位の計算を再実行しない。

early cutoffは、[[incremental-reparse|incremental reparse]]のように入力の一部だけを再解析する仕組みではない。queryの依存関係を持つ構文木、[[semantic-analysis|意味解析]]、型推論などの計算に適用できる。

## 出典

- [Durable Incrementality](https://rust-analyzer.github.io/blog/2023/07/24/durable-incrementality.html)
- [Salsa - rust-analyzer](https://rust-analyzer.github.io/book/contributing/guide.html)
- [The red-green algorithm](https://salsa-rs.github.io/salsa/reference/algorithm.html)
