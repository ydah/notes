---
created: 2026-08-17
updated: 2026-08-17
---

# AST

#parser #compiler #ast

AST（Abstract Syntax Tree）は、ソースコードの具体的な書き方よりも、意味に関係する構造を表すための木。日本語では抽象構文木。

例えば、

```text
1 + 2
```

をASTにすると、概念的には次のようになる。

```text
BinaryOperation(+)
├── Integer(1)
└── Integer(2)
```

括弧、カンマ、空白、コメントのように、意味の構造を読むために不要な情報は省略されやすい。`(1 + 2)`と`1 + 2`を同じASTへ写像する実装もある。ASTから元のソース表記へ完全に戻せるとは限らない。

ASTに残る情報は実装次第で、演算子の種類、識別子の名前、リテラルの値、ソース位置などは持ちうる。一方、名前解決や型情報までASTに含むとは限らない。rust-analyzerでも、syntax treeはsemantic-lessで、意味情報は後段のモデルで扱う。

[[cst|CST]]が具体的なtoken列を保持するのに対し、ASTは構文の細部を抽象化する。ASTを独立した木として作る実装もあれば、losslessな[[syntax-tree|構文木]]の上に型付きAST APIを重ねる実装もある。

[[semantic-action|semantic action]]でReduce時にASTノードを作ることもできる。ただし、ASTはパーサーのsemantic actionから作るものに限らず、CSTや構文木を後から変換して作ることもある。

ASTはコンパイラの型検査、静的解析、定数畳み込み、コード生成、refactoringの意味解析部分などで使う。IDE向けのパーサーでは、構文エラーを含む入力からまずエラー回復可能なCSTを作り、その上にAST相当のAPIを提供する設計もある。

## 出典

- [Python `ast` — Abstract Syntax Trees](https://docs.python.org/3/library/ast.html)
- [Syntax in rust-analyzer](https://rust-analyzer.github.io/book/contributing/syntax.html)
- [Why LibCST?](https://libcst.readthedocs.io/en/latest/why_libcst.html)
