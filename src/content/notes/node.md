---
created: 2026-08-17
updated: 2026-08-17
---

# Node

#parser #compiler #syntax-tree

木構造を構成する一つの要素。構文木では、式・文・宣言などの構文上のまとまりをnodeとして表し、子nodeやtokenを持たせる。

~~~text
source file node
└── function node
    ├── name token
    └── body node
        └── expression node
~~~

構文木のnodeには、少なくとも種類を表すkindと子要素がある。実装によっては、テキストの長さ、ソースファイル内のrange、親への参照、nodeのidentityも持つ。

nodeとtokenは似ているが役割が違う。nodeは複数のtokenからなる構造を表し、tokenはキーワード・識別子・演算子・括弧などの具体的な文字列を表す。空白やコメントはtriviaとしてtokenに付属させる実装がある。

[[green-tree|Green Tree]]のGreen nodeは、kind・子node・tokenのテキストなど、構造そのものを持つ。親pointerやファイル内のabsolute offsetは持たない。[[red-tree|Red Tree]]のRed node、またはrust-analyzerのSyntaxNodeは、Green nodeに親・位置・identityを加えた操作用のview。

[[ast|AST]]では、汎用のSyntaxNodeをFunctionやCallExprなどの型付きnodeで包むことがある。rust-analyzerでは、AST nodeはuntypedなsyntax nodeを透過的に包むAPIであり、構文kindに応じた操作を提供する。

nodeの範囲や親子関係を持つため、構文木を上から下へ走査したり、あるnodeから親・兄弟・子へ移動したりできる。formatter、refactoring、syntax highlighting、IDEの補完などはこのnavigationを利用する。

nodeという呼び方がどの層を指すかは実装によって異なる。Green node、Red node、AST nodeは同じソース上の構造を表すが、保持する文脈とAPIが違う。Tree-sitterでは[[named-node|named node]]と[[anonymous-node|anonymous node]]を区別し、[[hidden-rule|hidden rule]]や[[alias|alias]]で構文木上の見え方を調整できる。

## 出典

- [Syntax in rust-analyzer](https://rust-analyzer.github.io/book/contributing/syntax.html)
- [Crate syntax](https://rust-lang.github.io/rust-analyzer/syntax/index.html)
- [Get started with syntax analysis](https://learn.microsoft.com/en-us/dotnet/csharp/roslyn-sdk/get-started/syntax-analysis)
- [SyntaxNode Class](https://learn.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.syntaxnode)
