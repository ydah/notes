---
created: 2026-08-17
aliases: [lr-table, 構文解析表]
updated: 2026-09-07
---

# LR table

#parser #compiler #lr

LR tableは、LRパーサーが現在の[[parser-state|parser state]]から次の操作や遷移先を調べる表。文法から作った状態機械の遷移とReduce条件を、状態ごとの行にまとめる。

終端記号に対する[[action-table|ACTION表]]と、非終端記号に対する[[goto-table|GOTO表]]に分かれる。

```text
ACTION[state, terminal]    -> shift / reduce / accept / error
GOTO[state, nonterminal]   -> next state
```

例えば、文法が、

```text
E -> E "+" T | T
T -> NUMBER
```

だとする。パーサーは状態`state`と[[lookahead-token|lookahead token]]を使い、`ACTION[state, NUMBER]`や`ACTION[state, "+"]`を調べる。Reduceしたら右辺に対応する状態をpopする。残ったスタック頂上の状態を`p`として、`GOTO[p, E]`から次の状態を得る。

[[slr-parser|SLR]]ではFOLLOW集合を使い、[[lalr-parser|LALR]]・[[ielr|IELR]]・[[canonical-lr-parser|Canonical LR]]ではstateに紐づくlookaheadを使う。生成後の表は、いずれもACTIONとGOTOを使ってLRパーサーの動作を決める。

## 出典

- [The Bison Parser Algorithm](https://www.gnu.org/software/bison/manual/html_node/Algorithm.html)
- [Parser States](https://www.gnu.org/software/bison/manual/html_node/Parser-States.html)
- [LR Table Construction](https://www.gnu.org/software/bison/manual/html_node/LR-Table-Construction.html)
- [Compilers Lecture 7](https://cs.nyu.edu/~gottlieb/courses/2000s/2008-09-fall/compilers/lectures/lecture-07.html)
