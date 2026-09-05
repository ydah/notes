---
created: 2026-08-19
updated: 2026-08-19
---

# EOF

#lexer #parser #compiler

EOFはEnd Of Fileの略で、入力が残っていないことを表す終端の印。ファイルだけでなく、文字列やメモリ上のbufferをparserへ渡す場合にも使う。

parserにとってEOFは単なるI/Oの状態ではなく、文法上のlookahead token。開始規則の認識後にEOFを確認して、初めて入力全体を消費したと判断できる。EOF以外のtokenが残っていれば、開始規則が途中まで完成していても[[accept|Accept]]にはならない。

LRの説明では、augmented start ruleを次のように書くことがある。

~~~text
$accept: start $end •
~~~

$endは文法上の入力終端を表す記号。実装では対応するtoken kindをlexerが返す。GNU Bisonはyylexが0または負の値を返すと入力終端として扱い、YYEOFをEOFのtoken kindとして使う。

EOFは改行や空白とは異なる。改行を文法上意味のあるtokenにする言語では、改行の後にさらにEOFを読む。EOFそのものもsyntax errorではない。閉じ括弧がないままEOFになれば、parserはその時点でsyntax errorを報告する。

lexerの入力がOSのファイルでなくても、scannerは入力の最後でEOFを返せばよい。EOFは[[lexical-analyzer|字句解析機]]と[[parser|構文解析器]]の間で、通常のtoken列の最後に置く番兵の役割を持つ。

## 出典

- [Bison Manual: Calling Convention for yylex](https://www.gnu.org/software/bison/manual/html_node/Calling-Convention.html)
- [Bison Manual: Rpcalc Lexer](https://www.gnu.org/software/bison/manual/html_node/Rpcalc-Lexer.html)
- [Bison Manual](https://www.gnu.org/software/bison/manual/bison.html)
