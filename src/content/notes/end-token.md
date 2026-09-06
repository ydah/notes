---
created: 2026-09-07
updated: 2026-09-07
---

# $end

#parser #compiler #lr

`$end`は、GNU Bisonがtoken streamの終端を表すpredefined token。Bisonの内部文法とautomaton reportで使われ、user grammarでは使えない。一般概念としての[[eof|EOF]]とは表現の層が異なる。

Bisonは開始記号`start`を内部規則`$accept: start $end`で包む。automaton reportでは、読み終えたitemを次のように表示する。

~~~text
$accept: start $end •
~~~

このitemは、開始記号`start`と`$end`を読み終えた状態を表す。ここで[[accept|Accept]]が選ばれ、parserは入力全体の解析に成功したと判断する。`start`だけを認識しても、後続の入力が残っていればAcceptにはならない。

GNU BisonのC parser interfaceでは、`YYEOF`が入力終端を表すtoken kindになる。`yylex`は`YYEOF`を返せるほか、0以下の値でも入力終端を通知できる。C標準I/Oの`EOF`は`YYEOF`とは別のidentifier。lexerは入力源の終端を検出し、その状態をBisonの戻り値規約へ変換する。

## 出典

- [Bison Manual: Understanding Your Parser](https://www.gnu.org/software/bison/manual/html_node/Understanding.html)
- [Bison Manual: Table of Symbols](https://www.gnu.org/software/bison/manual/html_node/Table-of-Symbols.html)
- [Bison Manual: Calling Convention for yylex](https://www.gnu.org/software/bison/manual/html_node/Calling-Convention.html)
- [Bison Manual: Special Tokens](https://www.gnu.org/software/bison/manual/html_node/Special-Tokens.html)
