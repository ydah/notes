---
created: 2026-08-17
updated: 2026-08-17
---

# GOTO表

#parser #compiler #lr

Reduceによって非終端記号ができたあと、どの状態へ進むかを決める表。状態と非終端記号の組を受け取り、次の状態を返す。

```text
GOTO[state, nonterminal] -> next state
```

例えば`A -> α`をReduceする場合は、概念的に次の流れになる。

1. `α`に対応する分だけスタック上の状態をpopする
2. その時点のスタック頂上を`p`とする
3. `GOTO[p, A]`を調べる
4. 非終端記号`A`と得られた状態をスタックへpushする

```text
stack: 0 ... p
reduce A -> α
pop |α| 個の状態
push A
push GOTO[p, A]
```

[[parsing-table|構文解析表]]の`ACTION`表が終端記号とlookaheadに対する操作を決めるのに対し、GOTO表の列は[[nonterminal-symbol|非終端記号]]で、値は状態番号になる。

GOTOという名前は、LR項集合上の[[transition-function|遷移関数]]と、そこから作られた表の両方を指すことがある。このページでは、生成された表の意味を扱う。

## 出典

- [Compilers Lecture 7](https://cs.nyu.edu/~gottlieb/courses/2000s/2008-09-fall/compilers/lectures/lecture-07.html)
- [Parser States](https://www.gnu.org/software/bison/manual/html_node/Parser-States.html)
- [LR(1) table construction](https://www.cs.rutgers.edu/courses/515/classes/fall_2018_kremer/lectures/lec8mod.pdf)
