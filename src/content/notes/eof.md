---
created: 2026-08-19
updated: 2026-08-19
---

# EOF

#lexer #parser #compiler

EOFはEnd Of Fileの略で、入力がもう残っていないことを表す終端の印。ファイルだけでなく、文字列やメモリ上のbufferをparserへ渡す場合も、入力の終端を知らせるために使う。

parserにとってEOFは単なるI/Oの状態ではなく、文法上のlookahead token。開始規則を認識した後にEOFが来たことを確認してはじめて、入力全体を消費したと判断できる。EOF以外のtokenが残っていれば、開始規則が途中まで完成していても[[accept|Accept]]にはならない。

LRの説明では、augmented start ruleを次のように書くことがある。

~~~text
$accept: start $end •
~~~

$endは文法上の入力終端を表す記号。実装ではこれに対応するtoken kindをlexerが返す。GNU Bisonでは、yylexが0または負の値を返すと入力終端として扱われ、YYEOFはEOFを表すtoken kindとして使われる。

EOFは改行や空白とは違う。改行を文法上意味のあるtokenにする言語では、改行を読んだ後にさらにEOFを読む。EOFをsyntax errorと混同してもいけない。閉じ括弧がないままEOFになれば、その時点でparserがsyntax errorを報告することはあるが、EOFそのものはエラーではない。

lexerの入力がOSのファイルでなくても、scannerが入力の最後を検出した時点でEOFを返せばよい。[[lexical-analyzer|字句解析機]]と[[parser|構文解析器]]の間では、通常のtoken列の最後に置く番兵のような役割を持つ。

## 出典

- [Bison Manual: Calling Convention for yylex](https://www.gnu.org/software/bison/manual/html_node/Calling-Convention.html)
- [Bison Manual: Rpcalc Lexer](https://www.gnu.org/software/bison/manual/html_node/Rpcalc-Lexer.html)
- [Bison Manual](https://www.gnu.org/software/bison/manual/bison.html)
