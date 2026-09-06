---
created: 2026-08-19
updated: 2026-09-07
---

# Accept

#parser #compiler #lr

LR parserのAcceptは、開始記号と入力の終端を認識したときの[[action-table|ACTION]]。入力全体が文法に従っていたことを示し、parserは成功して終了する。

GNU Bisonのautomaton reportでは、内部の開始規則を次のitemで表す。

~~~text
$accept: start $end •
                         → Accept
~~~

開始記号`start`と[[end-token|$end]]を読み終えてこのitemが完成すると、ReduceではなくAcceptになる。Reduceは途中の規則を完成させ、[[syntax-tree|構文木]]を組み立てたり[[semantic-action|semantic action]]を実行したりする。Acceptは最終的な成功を表す。

AcceptはErrorや入力途中のReduceとは異なる。開始記号を認識しても、parserがEOF以外のtokenを見ている段階ではAcceptにならない。

PSLRの論文に出てくる[[accepted-token-set|accepted token set]] $acc(s_p)$は、このACTIONとは別の概念。現在の[[parser-state|parser state]]で[[pseudo-scanner]]が候補にできるtokenの集合であり、parse全体の成功を意味しない。

## 出典

- [Bison Manual: Parser States](https://www.gnu.org/software/bison/manual/html_node/Parser-States.html)
- [Bison Manual: Look-Ahead Tokens](https://www.gnu.org/software/bison/manual/html_node/Look-Ahead.html)
- [PSLR(1): Pseudo-Scannerless Minimal LR(1) for the Deterministic Parsing of Composite Languages](https://open.clemson.edu/all_dissertations/519/)
