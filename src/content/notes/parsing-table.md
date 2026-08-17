---
created: 2026-08-17
updated: 2026-08-17
---

# 構文解析表

#parser #compiler #lr

LRパーサーが、現在の状態とlookahead tokenから次の操作を調べるための表。文法から状態機械を作り、その遷移とReduce条件を表にしたもの。

通常は、終端記号に対する`ACTION`と、非終端記号に対する[[goto-table|GOTO表]]に分けて考える。

```text
ACTION[state, terminal]    -> shift / reduce / accept / error
GOTO[state, nonterminal]   -> next state
```

`ACTION`表の主な値は次のとおり。

- `shift j` — tokenを読み、状態`j`へ進む
- `reduce A -> α` — 生成規則でReduceする
- `accept` — 入力全体を受理した
- `error` — その状態では入力を処理できない

例えば、文法が、

```text
E -> E "+" T | T
T -> NUMBER
```

だとする。パーサーは状態`state`と入力の終端記号を使って、`ACTION[state, NUMBER]`や`ACTION[state, "+"]`を調べる。Reduceして右辺に対応する状態をpopしたら、残ったスタック頂上の状態を`p`として、`GOTO[p, E]`のように次の状態を調べる。

SLR・LALR・Canonical LRの違いは、主にこの表をどの状態とlookahead情報から構築するかに現れる。[[slr-parser|SLR]]ではFOLLOW集合、[[lalr-parser|LALR]]と[[canonical-lr-parser|Canonical LR]]では状態に紐づくlookaheadを使う。

## 出典

- [The Bison Parser Algorithm](https://www.gnu.org/software/bison/manual/html_node/Algorithm.html)
- [Parser States](https://www.gnu.org/software/bison/manual/html_node/Parser-States.html)
- [LR Table Construction](https://www.gnu.org/software/bison/manual/html_node/LR-Table-Construction.html)
- [Compilers Lecture 7](https://cs.nyu.edu/~gottlieb/courses/2000s/2008-09-fall/compilers/lectures/lecture-07.html)
