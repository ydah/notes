---
created: 2026-08-17
updated: 2026-08-17
---

# CST

#parser #compiler #cst

CST（Concrete Syntax Tree）は、ソースに現れた具体的な構文を保持する木。日本語では具象構文木。

ASTでは省略されやすい括弧、カンマ、セミコロン、演算子token、コメント、空白、改行、tokenの元の表記などを保持する実装が多い。コメントや空白まで含めるか、元のソースをどこまで再現できるかは実装による。

例えば、

```text
fn(1, 2)  # comment
```

をCSTとして表すと、概念的には次のようになる。

```text
call
├── NAME("fn")
├── LPAR("(")
├── NUMBER("1")
├── COMMA(",")
├── NUMBER("2")
├── RPAR(")")
└── COMMENT("# comment")
```

ASTなら、`Call(Name("fn"), [1, 2])`のように構文の細部を落とす。CSTはformatter、codemod、refactoring、syntax highlighting、IDEのソース編集に向いている。

CSTが文法ファイルの全ての生成規則を一つずつ可視ノードにするとは限らない。Tree-sitterのように[[named-node|named node]]と[[anonymous-node|anonymous node]]を分けたり、[[hidden-rule|hidden rule]]や[[alias|alias]]を使ったりする実装もある。

CSTは構文エラーとの相性がよい。Tree-sitterの`ERROR`・`MISSING`ノードや、Roslynのmissing token・[[skipped-token|skipped token]]のように、壊れた部分を木に残せる。[[syntax-error|構文エラー]]を別の診断リストとして持ちながら、木自体は部分的に構築できる。

[[ast|AST]]とCSTは必ず別の木になるわけではない。rust-analyzerでは[[lossless-syntax-tree|lossless]]な[[syntax-tree|構文木]]の上に、抽象化されたAST APIを重ねる。

## 出典

- [Basic Parsing](https://tree-sitter.github.io/tree-sitter/using-parsers/2-basic-parsing.html)
- [Writing the Grammar](https://tree-sitter.github.io/tree-sitter/creating-parsers/3-writing-the-grammar.html)
- [Roslyn syntax model](https://learn.microsoft.com/en-us/dotnet/csharp/roslyn-sdk/work-with-syntax)
- [Syntax in rust-analyzer](https://rust-analyzer.github.io/book/contributing/syntax.html)
