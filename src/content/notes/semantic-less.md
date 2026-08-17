---
created: 2026-08-17
updated: 2026-08-17
---

# semantic-less

#parser #compiler #syntax-tree #semantic-analysis

構文木の設計でいうsemantic-lessは、構文木がソースコードの構造だけを表し、[[name-resolution|名前解決]]や型情報などの意味情報を持たないこと。

例えば、次のコードから作る[[syntax-tree|構文木]]は、`fn`、`add`、引数、ブロック、`+`などのtokenと、それらの親子関係・ソース位置を持つ。

```rust
fn add(x: i32, y: i32) -> i32 {
    x + y
}
```

一方で、次のことは後段の[[semantic-analysis|意味解析]]に任せる。

- `x`と`y`が関数の引数を参照していること
- `x + y`の型が`i32`であること
- `add`という名前がどの定義に対応するか
- 型検査や借用検査に通ること

```text
ソースコード
    ↓
字句解析・構文解析
    ↓
semantic-lessな構文木 / [[ast|AST]]
    ↓
[[name-resolution|名前解決]]・[[type-inference|型推論]]・[[semantic-analysis|意味解析]]
    ↓
意味モデル
```

semantic-lessは情報量が少ないという意味ではない。rust-analyzerの構文木は[[lossless-syntax-tree|lossless]]で、tokenだけでなくコメント・空白やソース位置も保持する。木の内容は入力文字列から決まり、プロジェクト全体の情報や型情報には依存しない。

この分離により、編集途中の不完全なコードをファイル単体で解析しやすくなる。構文木をimmutableな値として扱い、syntax highlightingやformatterなどを意味解析なしで動かせる点も大きい。[[red-green-tree|Red-Green Tree]]や[[rust-analyzer-rowan|rust-analyzer/rowan]]の設計は、この構文データと後段の意味処理を分離する例。

semantic-lessは「意味を理解できないAST」ということではない。[[cst|CST]]やASTを構文の表現として使い、そこから別の層で意味を付加するという責務の分け方を指す。rust-analyzerでは、syntax crateが構文木を提供し、その上で[[name-resolution|名前解決]]や[[type-inference|型推論]]などの意味モデルを構築する。

[[ast|AST]]にsemantic-lessな構文情報を持たせ、[[semantic-action|semantic action]]で意味値を直接作る方式もある。どこで意味を付けるかはパーサーやコンパイラの設計によるが、構文の認識と意味の解釈を分離すると、編集途中の入力や再利用を扱いやすい。

## 出典

- [Syntax in rust-analyzer](https://rust-analyzer.github.io/book/contributing/syntax.html)
- [Architecture of rust-analyzer](https://rust-analyzer.github.io/book/contributing/architecture.html)
