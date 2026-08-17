---
created: 2026-08-17
updated: 2026-08-17
---

# 型推論

#compiler #semantic-analysis #type-inference

型注釈が明示されていない式や変数の型を、周囲の式・代入・関数呼び出しなどの制約から自動的に決める処理。

例えば、Rustの次のコードでは、空のvectorを作った時点では要素型が決まっていないが、pushされた文字列からVec<&str>と推論できる。

~~~rust
let mut things = vec![];
things.push("thing");
~~~

実装では、まだ正確な型が分からない箇所に推論変数を置き、式を調べながら制約を集める。制約を解いて推論変数を具体的な型へ置き換える処理には、unificationの考え方が使われる。

~~~text
let x = 1;
x + 2

xの型は ?T
1から ?T = 整数型
+ 2から ?T と整数型の関係を追加
制約を解いて x の型を決める
~~~

型推論は[[name-resolution|名前解決]]とは違う。名前解決は識別子を定義へ対応付け、型推論は式や値の型を決める。どちらも[[semantic-analysis|意味解析]]の一部で、型推論の結果は型検査で代入可能性や演算子の適用可否を確認するために使われる。

型推論だけでは制約が足りず、型を一意に決められないことがある。その場合は型注釈を追加する必要がある。実際の言語では、generics、subtyping、lifetimeやregion、higher-ranked typeなどの規則も推論を複雑にする。

[[semantic-less|semantic-less]]な構文木に最終的な型を埋め込むのではなく、構文木をもとにした意味モデルや型検査の層で型を計算する設計にすると、構文と意味を分離できる。

## 出典

- [Type inference - Rust Compiler Development Guide](https://rustc-dev-guide.rust-lang.org/type-inference.html)
- [Overview of the compiler](https://rustc-dev-guide.rust-lang.org/overview.html)
