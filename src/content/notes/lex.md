---
created: 2026-09-07
updated: 2026-09-07
---

# Lex

#unix #lexer #compiler #generator

Lexは、regular expressionとactionの組から[[scanner]]を生成するツール。POSIXの`lex` utilityは、文字入力の字句処理に使うCプログラムを生成し、[[yacc|Yacc]]のinterfaceとして利用できる仕様を定めている。

Lexの入力は`%%`で区切る三つのsectionからなる。

1. definitions — 名前付きpatternやC宣言
2. rules — 左列にpattern、右列に認識時のC action
3. user subroutines — 補助関数や`main`

user subroutinesがなければ、rules sectionの終端を示す二つ目の`%%`は省略できる。

~~~text
DIGIT   [0-9]
%%
{DIGIT}+    return NUMBER;
[ \t]+      ;
%%
~~~

既定の生成先は`lex.yy.c`。生成コードにはscanner関数`yylex()`が入り、入力からpatternを認識してactionを実行する。Yaccと組み合わせる場合、Yaccが生成したparserから`yylex()`を呼び、次のtokenを受け取る。

[[flex]]はAT&T Lexを書き直した別実装で、Lex互換を目指しながら独自機能も加えている。Lex／flexはscanner generator、Yacc／[[gnu-bison|Bison]]はparser generatorであり、担当する段階が異なる。

Lexにも[[start-condition|start condition]]がある。POSIXはinclusiveな`%s`とexclusiveな`%x`を規定し、`<SC>`で規則を特定のconditionへ限定する。

## 出典

- [The Open Group Base Specifications: lex](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/lex.html)
- [The Flex Manual: Incompatibilities with Lex and Posix](https://westes.github.io/flex/manual/Lex-and-Posix.html)
