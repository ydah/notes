---
created: 2026-08-17
updated: 2026-08-17
---

# skipped token

#parser #compiler #cst #roslyn #syntax-error

構文解析中に、現在の構文へ組み込めない余分なtokenを一時的に読み飛ばし、あとで構文木へ残すエラー回復の表現。Roslynでは、読み飛ばしたtokenをSkippedTokensTriviaというtrivia nodeとして別のtokenに付加する。

例えば、parserが式のあとにセミコロンを期待している場所で、余分なtokenを読んだとする。

~~~text
int value = 1 2;
                ↑
          ここでセミコロンを期待
~~~

parserは次に解析を続けられるtokenまで入力を進める。このとき、余分な`2`を捨てずにSkippedTokensTriviaとして保持する。どのtokenに付加されるかは、実装のAPIで確認する必要がある。これにより、木から元のソーステキストへ戻せる。

[[lossless-syntax-tree|lossless syntax tree]]では、skipped tokenは通常の文法構造の子として扱えなくても、入力に現れた文字列を失わないために木のどこかへ残す。これにより、構文エラーを含む編集中のソースでもformatterやIDEが残りの構造を扱える。

[[syntax-error|構文エラー]]からの回復には、skipped token以外の方法もある。

- missing token — 必須tokenが入力に存在しないとき、期待された位置に幅0のtokenを挿入する
- skipped token — 入力には存在するが現在の構造に合わないtokenを読み飛ばし、triviaとして保持する
- ERROR node — Tree-sitterのように、認識できない範囲をERROR nodeとして構文木に入れる

missing tokenが「足りない入力」を表すのに対し、skipped tokenは「余分な入力」を表す。使う方式や、parser errorの診断情報を木の中と外のどちらに持つかは、parser実装によって異なる。

skipped tokenは、意味解析で無視してよいという意味ではない。ソースに構文エラーがあることを示す診断とは別に、losslessな構文木を維持するための構文表現である。

## 出典

- [Use the .NET Compiler Platform SDK syntax model](https://learn.microsoft.com/en-us/dotnet/csharp/roslyn-sdk/work-with-syntax)
- [Get started with syntax analysis](https://learn.microsoft.com/en-us/dotnet/csharp/roslyn-sdk/get-started/syntax-analysis)
- [Syntax in rust-analyzer](https://rust-analyzer.github.io/book/contributing/syntax.html)
