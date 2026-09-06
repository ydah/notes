---
created: 2026-09-07
updated: 2026-09-07
---

# flex

#lexer #compiler #generator

`flex`はpattern matchingを行うプログラムを生成する、[[lex|Lex]]互換のscanner generator。AT&T Lexのrewriteであり、コードを共有しない。AT&T Lexとの互換性を基礎に、exclusive [[start-condition|start condition]]、reentrant API、C++ scannerなどを追加している。

入力仕様は`%%`で区切る三つのsectionからなる。

1. definitions — 名前付きpattern、option、C宣言など
2. rules — `pattern action`の組
3. user code — 補助関数など

生成物は既定で`lex.yy.c`。token matching用table、補助routine、[[scanner]]関数`yylex()`を含む。`yylex()`は入力を走査し、patternに一致すると対応するactionを実行する。actionで`return`すれば呼び出し元へtokenを返し、次の呼び出しでは続きから走査する。

複数のpatternが一致すると、最も長い入力に一致する規則を選ぶ。同じ長さなら、仕様内で先に書いた規則を選ぶ。この既定動作が[[scanner-conflict|scanner conflict]]の暗黙の解決規則になる。

`flex`は[[gnu-bison|GNU Bison]]そのものではない。`flex`がscannerを生成し、Bisonがparserを生成する。組み合わせる場合、Bison側のtoken定義をscannerから参照し、parserが`yylex()`を呼ぶ。

POSIX LexやAT&T Lexと完全に同じではない。`flex` manualは互換性の差を列挙し、`-l`を最大限のLex互換modeとしている。

## 出典

- [westes/flex: The Fast Lexical Analyzer](https://github.com/westes/flex)
- [The Flex Manual](https://westes.github.io/flex/manual/)
- [The Flex Manual: The Generated Scanner](https://westes.github.io/flex/manual/Generated-Scanner.html)
- [The Flex Manual: Interfacing with Yacc](https://westes.github.io/flex/manual/Yacc.html)
- [The Flex Manual: Incompatibilities with Lex and Posix](https://westes.github.io/flex/manual/Lex-and-Posix.html)
