---
created: 2026-08-19
updated: 2026-08-19
---

# Accept

#parser #compiler #lr

LR parserのAcceptは、開始規則と入力の終端を認識したときのACTION。入力全体が文法に従っていたことを示し、parserは成功して終了する。

LR tableでは、開始規則を特別な規則として用意する。

~~~text
$accept: start $end •
                         → Accept
~~~

startの後に[[eof|EOF]]や $end が来てこのitemが完成すると、ReduceではなくAcceptになる。Reduceは途中の規則を完成させて構文木やsemantic actionを進める。Acceptは最終的な成功を表す。

AcceptはErrorや入力途中のReduceとは異なる。開始規則が完成していても、parserがEOF以外のtokenを見ている段階ではAcceptにならない。

PSLRの論文に出てくる acc(sp) や accepted token setは、このACTIONとは別の概念。acc(sp)は、現在のparser state spでpseudo-scannerが候補にできるtokenの集合を表す。scannerへの制約であり、parse全体の成功を意味しない。

## 出典

- [Bison Manual: Parser States](https://www.gnu.org/software/bison/manual/html_node/Parser-States.html)
- [Bison Manual: Look-Ahead Tokens](https://www.gnu.org/software/bison/manual/html_node/Look-Ahead.html)
- [PSLR(1): Pseudo-Scannerless Minimal LR(1) for the Deterministic Parsing of Composite Languages](https://open.clemson.edu/all_dissertations/519/)
