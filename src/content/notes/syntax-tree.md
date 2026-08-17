---
created: 2026-08-17
updated: 2026-08-17
---

# 構文木

#parser #compiler #syntax-tree

ソースコードまたはtoken列の構造を、親子関係を持つ木として表したもの。構文解析器の出力を指すことが多いが、AST・CSTのどちらを含むかは実装や文脈によって違う。

構文木の要素は、例えば次のように分かれる。

- **[[node|ノード]]** — 式、文、宣言などの構文上のまとまり
- **token** — キーワード、識別子、リテラル、演算子、括弧など
- **trivia** — 空白、コメント、プリプロセッサディレクティブなど

Roslynのsyntax treeは、構文上のまとまりだけでなくtokenとtriviaも持つ[[lossless-syntax-tree|full-fidelity]]な木。ソーステキストを木から再構成できるため、formatterやrefactoringの基盤にできる。

構文木という言葉だけでは、空白やコメントを保持するかは決まらない。具体的な表記を残す木を[[cst|CST]]、意味に必要な構造へ抽象化した木を[[ast|AST]]と呼ぶことが多い。

rust-analyzerの構文木は、[[green-tree|Green Tree]]をデータ層にして、[[red-green-tree|Red-Green Tree]]の[[red-tree|Red Tree]]と、その上のAST APIを組み合わせる構成になっている。構文木とASTが別の木として存在するとは限らず、同じsyntax treeに異なるビューを重ねる設計もある。

構文エラーがあっても、木全体を捨てる必要はない。Roslynは欠落tokenやskipped tokenを木に残す。一方、rust-analyzerはparser errorを木の外の配列で管理し、余分な入力を`ERROR`ノードとして木に含める。欠落した必須ノードが常に木に現れるわけではない。こうした違いがあるため、構文エラーそのものは[[syntax-error|構文エラー]]として木とは別の診断情報にする設計もある。

構文木は、syntax highlighting、formatter、refactoring、IDEの補完・診断、ASTや意味モデルを作る前段で使う。

## 出典

- [Roslyn syntax model](https://learn.microsoft.com/en-us/dotnet/csharp/roslyn-sdk/work-with-syntax)
- [Syntax in rust-analyzer](https://rust-analyzer.github.io/book/contributing/syntax.html)
- [Crate syntax](https://rust-lang.github.io/rust-analyzer/syntax/index.html)
