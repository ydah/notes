---
created: 2026-08-17
updated: 2026-08-17
---

# 意味解析

#compiler #semantic-analysis

構文として正しいプログラムが、その言語の意味規則にも従っているかを調べる処理。[[semantic-less|semantic-less]]な[[syntax-tree|構文木]]や[[ast|AST]]を入力にして、[[name-resolution|名前解決]]・型検査・[[type-inference|型推論]]などを行う。

~~~text
ソースコード
    ↓
字句解析・構文解析
    ↓
構文木 / AST
    ↓
意味解析
    ├── 名前解決
    ├── 型推論・型検査
    └── その他の言語規則の検査
~~~

例えば、次のコードは文法上は正しくても、型の規則に反する可能性がある。

~~~text
let x = 1;
x + true;
~~~

`x + true`をどの演算として解釈できるか、`x`と`true`の型が適合するかを調べるのは意味解析の仕事。文法にないtoken列を拒否する[[syntax-error|構文エラー]]とは別の段階のエラーになる。

意味解析の結果は、エラー一覧だけとは限らない。各識別子が参照する定義や各式の型を、中間表現や意味モデルに付加する。これらの情報は後段の最適化・コード生成・IDE機能で使う。

Rustコンパイラでは、parserが返したASTをHIRへloweringする。HIRを使って[[type-inference|型推論]]、trait solving、型検査を行う。[[name-resolution|名前解決]]やmacro expansionは、型検査より前の段階にも関わる。

## 出典

- [Overview of the compiler](https://rustc-dev-guide.rust-lang.org/overview.html)
- [Name resolution](https://rustc-dev-guide.rust-lang.org/name-resolution.html)
- [Type inference](https://rustc-dev-guide.rust-lang.org/type-inference.html)
