---
created: 2026-08-18
updated: 2026-08-18
---

# isocore

#parser #compiler #lr #ielr

isocoreは、同じLR(0) coreを持つCanonical LR(1) stateのグループ、またはその関係。同じcoreでもitemのlookaheadが違えば、state全体のactionや認識する文脈は違い得る。

## coreとlookahead

LR(1) itemは、生成規則のdot位置とlookaheadを持つ。coreはlookaheadを除いたitemの集合。

例えば、次の二つはcoreが同じ。

~~~text
A -> α • β, a
A -> α • β, b
~~~

lookaheadだけが違うため、LR(0)の観点では同じcoreになる。しかし、reduce itemのlookaheadがaだけか、bだけかで、reduce actionを置くtokenが変わる。

## LALRとCanonical LR

Canonical LR(1)は、同じcoreを持つstateを別々に残す。つまり、同じisocoreに属するstateでもlookaheadの違いを保持する。

LALR(1)は、同じcoreのstateをmergeし、lookaheadをunionする。state数は減るが、異なるlaneの文脈を混ぜてしまい、LALRだけにconflictが現れることがある。

IELRは、同じisocoreのstateを無条件にmergeしない。[[inadequacy-contribution|inadequacy contribution]]と[[dominant-contribution|dominant contribution]]を比較し、Canonical LR(1)の認識能力に必要な区別だけを残す。

## 用語の使い分け

isocoreは「同じcoreを持つ」という同値関係や、そのグループを指す。stateはparser tableに置かれる個々の状態。

したがって、「isocoreをsplitする」は、同じcoreを持つCanonical LR(1) stateを、lookaheadやlaneの違いを保った複数のIELR stateとして残すという意味になる。

[[kernel-item-lookahead-set|kernel item lookahead set]]は、isocoreを分けるときに、同じcoreの各kernel itemへどのtokenを伝えるかを表す。

## 出典

- [IELR(1) parser tables](https://malloy.people.clemson.edu/publications/papers/sac08/paper.pdf)
- [The IELR(1) algorithm](https://malloy.people.clemson.edu/publications/papers/scp09/scp09.pdf)
- [LR Table Construction](https://www.gnu.org/software/bison/manual/html_node/LR-Table-Construction.html)
