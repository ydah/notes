---
created: 2026-08-18
updated: 2026-08-18
---

# LALR table

#parser #compiler #lr #lalr

LALR tableは、LALR(1)のstate machineとlookaheadから作るparser table。runtimeは現在のstateと[[lookahead-token|lookahead token]]からACTIONを調べる。非終端記号の遷移はGOTOで調べる。

## stateをまとめる

Canonical LR(1)のstateに含まれるLR itemからlookaheadを除いた部分がLR(0) coreである。coreが同じなら、LALRはそのstateを一つにまとめ、lookaheadをunionする。

~~~text
Canonical LR(1):
  [A -> α ., {x}]
  [A -> α ., {y}]

LALR:
  [A -> α ., {x, y}]
~~~

このマージでstate数とtableを小さくできる。LALR tableは、terminalのACTION欄とnonterminalのGOTO欄からなる[[parsing-table|構文解析表]]である。

## マージの副作用

元は別の文脈にあったlookaheadをunionすると、Canonical LR(1)にはなかったReduce/Reduce conflictなどが発生する場合がある。LALR tableのstate mergeが原因で発生する分かりにくいconflictは[[mysterious-conflict|mysterious conflict]]と呼ばれる。

LALR tableは常にCanonical LR(1)と同じ言語を認識できるわけではない。文法によっては、LALRのマージで必要な文脈を区別できなくなり、Canonical LR(1)や[[ielr-table|IELR table]]なら受理できる入力を受理できない。

## Bisonでの選択

Bisonでは次の指定でLALR tableを生成する。lr.typeのデフォルトもlalr。

~~~text
%define lr.type lalr
~~~

LALR parserはtableを使うruntimeの方式を指すことが多い。LALR tableは、そのruntimeが参照する具体的なACTION/GOTOのデータを指す。

## 出典

- [LR Table Construction](https://www.gnu.org/software/bison/manual/html_node/LR-Table-Construction.html)
- [Parser States](https://www.gnu.org/software/bison/manual/html_node/Parser-States.html)
- [Mysterious Conflicts](https://www.gnu.org/software/bison/manual/html_node/Mysterious-Conflicts.html)
