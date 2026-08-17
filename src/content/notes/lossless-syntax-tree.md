---
created: 2026-08-17
updated: 2026-08-17
---

# Lossless Syntax Tree

#parser #compiler #syntax-tree #cst

入力テキストを構文木に変換したあと、木から元のテキストを完全に再構成できる構文木。空白、改行、コメント、tokenの元の表記などを捨てずに保持する。

例えば、次のコードでは、関数や式の親子関係だけでなく、コメント、改行、インデント、tokenの文字列も木のどこかに対応づけられる。

~~~rust
fn add(a: i32, b: i32) -> i32 { // comment
    a + b
}
~~~

~~~text
入力テキスト
    ↓ parse
Lossless Syntax Tree
    ↓ text
元の入力テキスト
~~~

この性質により、木を経由しても入力テキストを変えずに戻せる。[[ast|AST]]のように空白・コメント・括弧などを省略する木とは異なり、formatterやrefactoringで変更していない部分を保持しやすい。

典型的には、次の要素を組み合わせる。

- [[node|node]] — 式・文・宣言などの構造
- token — キーワード、識別子、演算子、括弧など
- trivia — 空白、コメント、改行、プリプロセッサディレクティブなど

losslessは特定のparser algorithmを指す言葉ではない。[[lr-parser|LRパーサー]]でも再帰下降パーサーでも実装できる。構文エラーがある入力をどこまで木に残せるかは実装ごとに違うが、rust-analyzerのようにerror nodeやparser errorを扱いながら木を作る設計もある。

rust-analyzerでは、[[green-tree|Green Tree]]が構造とテキストを保持し、[[red-tree|Red Tree]]やSyntaxNodeが親・位置を持つviewになる。rowanはこのための[[rust-analyzer-rowan|lossless syntax treeライブラリ]]。

## 出典

- [Guide - rust-analyzer](https://rust-analyzer.github.io/book/contributing/guide.html)
- [Syntax in rust-analyzer](https://rust-analyzer.github.io/book/contributing/syntax.html)
- [rowan](https://github.com/rust-analyzer/rowan)
- [Get started with syntax analysis](https://learn.microsoft.com/en-us/dotnet/csharp/roslyn-sdk/get-started/syntax-analysis)
