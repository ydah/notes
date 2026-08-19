---
created: 2026-08-19
updated: 2026-08-19
---

# Accept

#parser #compiler #lr

LR parserのAcceptは、開始規則を最後まで認識し、入力の終端も確認したときのACTION。これが実行されると入力全体が文法に従っていたことになり、parserは成功して終了する。

LR tableでは、開始規則を特別な規則として用意する。

~~~text
$accept: start $end •
                         → Accept
~~~

startの後に[[eof|EOF]]や $end が来た状態でこのitemが完成すると、Reduceで通常の規則へ戻るのではなくAcceptになる。途中の規則を完成させるReduceは構文木やsemantic actionを進めるが、Acceptは最終的な成功を表す動作。

AcceptはErrorや、入力途中でのReduceとも別。parserがEOF以外のtokenを見ている段階で開始規則が完成していても、残りのtokenがあるためAcceptにはならない。

PSLRの論文に出てくる acc(sp) や accepted token setは、このACTIONのAcceptとは別の概念。acc(sp)は、現在のparser state spでpseudo-scannerが候補として考慮してよいtokenの集合を表す。これはscannerへ渡す制約であって、parse全体が成功したという意味ではない。

## 出典

- [Bison Manual: Parser States](https://www.gnu.org/software/bison/manual/html_node/Parser-States.html)
- [Bison Manual: Look-Ahead Tokens](https://www.gnu.org/software/bison/manual/html_node/Look-Ahead.html)
- [PSLR(1): Pseudo-Scannerless Minimal LR(1) for the Deterministic Parsing of Composite Languages](https://open.clemson.edu/all_dissertations/519/)
