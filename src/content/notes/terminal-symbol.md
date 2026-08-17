---
created: 2026-08-17
updated: 2026-08-17
---

# 終端記号

#formal-language #grammar #parser

[[production-rule|生成規則]]でこれ以上展開しない記号。入力tokenの種類に対応する。例えば、識別子、数値、`if`、`+`、`(`などが終端記号になる。

[[lexical-analyzer|字句解析機]]は入力文字列からtoken列を作り、[[parser|構文解析器]]はそのtoken列を終端記号の列として読む。文法上の`identifier`や`"+"`はtokenの種類を表す記号であり、実際のソースコード中の文字列や値そのものとは分けて考える。

[[nonterminal-symbol|非終端記号]]には生成規則が必要だが、終端記号は[[production-rule|生成規則]]の右辺に現れて入力を構成する。[[first-set|FIRST集合]]は、文法から導出した記号列の先頭に現れうる終端記号を集めたもの。

GNU Bisonでは、終端記号はtoken kindとも呼ばれ、`yylex`が返すtokenの種類に対応する。

## 出典

- [Language and Grammar](https://www.gnu.org/software/bison/manual/html_node/Language-and-Grammar.html)
- [Symbols, Terminal and Nonterminal](https://www.gnu.org/software/bison/manual/html_node/Symbols.html)
