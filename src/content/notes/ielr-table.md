---
created: 2026-08-18
updated: 2026-08-18
---

# IELR table

#parser #compiler #lr #ielr

IELR tableは、IELR(1)のstate分割とlookahead計算から作るparser table。LALRに近いstate数を保ちながら、Canonical LR(1)と同じ言語認識能力を持つことを目的にしている。

## LALR tableからの分割

IELRはCanonical LR(1)の全stateをそのまま残すのではなく、まずLALRに近いマージを基礎にする。そのマージによってLR(1)の文脈を区別できなくなり、conflictや認識能力の不足につながるstateだけを必要に応じて分割する。

~~~text
LALR table
    ↓  inadequateなstateを検出
必要なlane・lookaheadを区別
    ↓
IELR table
~~~

そのため、IELR tableはLALR tableより大きくなることはあるが、Canonical LR tableの全stateを持つ必要はない。LALRで起きる人工的なconflictを減らしつつ、tableの大きさを抑えるための構築方式。

## tableの役割

生成されたIELR tableのruntime上の構造は、他のLR tableと同じくACTIONとGOTO。現在のstateと[[lookahead-token|lookahead token]]を使ってShift・Reduce・Accept・Errorを決める。

IELR tableを使っても、曖昧な文法やLR(1)でない文法のconflictがすべて消えるわけではない。IELRが取り除くのは、主にLALRのstate mergeによって人工的に生じた不足。

## Bisonでの選択

Bisonでは次の指定でIELR tableを生成する。

~~~text
%define lr.type ielr
~~~

default reductionや[[nonassoc|%nonassoc]]を含むparser runtimeの挙動は、tableの種類だけでなく、構築されたactionとruntime設定にも依存する。lookaheadの確認前に起きるReduceやerror recoveryの文脈を調べるときは、[[default-reduction|default reduction]]と[[lookahead-correction|Lookahead Correction（LAC）]]も一緒に見る。

IELRの内部では、[[goto-follow-closures|goto-follow closures]]や[[lane-annotations|lane annotations]]を使って、どのlookaheadの寄与を区別すべきかを調べる。

## 出典

- [LR Table Construction](https://www.gnu.org/software/bison/manual/html_node/LR-Table-Construction.html)
- [The IELR(1) algorithm](https://malloy.people.clemson.edu/publications/papers/scp09/scp09.pdf)
- [IELR(1) parser tables](https://malloy.people.clemson.edu/publications/papers/sac08/paper.pdf)
