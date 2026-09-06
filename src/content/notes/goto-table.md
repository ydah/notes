---
created: 2026-08-17
updated: 2026-09-07
---

# GOTO表

#parser #compiler #lr

GOTO表は、Reduceによって非終端記号ができた後に進む状態を決める。状態と非終端記号の組を受け取り、次の状態を返す。

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

[[action-table|ACTION表]]は、現在のstateと、lookahead tokenである終端記号から操作を決める。GOTO表の列は[[nonterminal-symbol|非終端記号]]で、値は状態番号になる。両方を合わせたものが[[lr-table|LR table]]である。

GOTOという名前は、LR項集合上の[[transition-function|遷移関数]]と、そこから作る表の両方を指す。このノートでは、生成された表の意味を扱う。

IELRの表構築では、次の状態番号に加え、GOTOごとにどのtokenが後続し得るかを計算する。この情報が[[goto-follow-closures|goto-follow closures]]の入力になる。

## 出典

- [Compilers Lecture 7](https://cs.nyu.edu/~gottlieb/courses/2000s/2008-09-fall/compilers/lectures/lecture-07.html)
- [Parser States](https://www.gnu.org/software/bison/manual/html_node/Parser-States.html)
- [LR(1) table construction](https://www.cs.rutgers.edu/courses/515/classes/fall_2018_kremer/lectures/lec8mod.pdf)
