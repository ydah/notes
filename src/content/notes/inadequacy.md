---
created: 2026-08-18
updated: 2026-08-18
---

# inadequacy

#parser #compiler #lr #ielr

inadequacyは、parser tableが文法の必要な文脈を区別できず、正しいLR actionを選べない状態。IELRの論文では、特にLALRとLR(1)の認識能力の差を説明するために使われる。

## LR(1)-relative inadequacy

Canonical LR(1) tableなら、あるtokenに対してconflictを起こさず、文法の指定したparse treeを認識できるとする。それなのにLALR tableではstate mergeのためにconflictや認識能力の低下が起きる場合、その差がLR(1)-relative inadequacy。

異なるlaneから来たlookaheadが、同じLR(0) coreを持つstateにmergeされると、もともと別だった文脈が同じitemのlookaheadに集まる。LALRにだけ現れる[[mysterious-conflict|mysterious conflict]]は、この典型例。

IELRは、このLR(1)-relative inadequacyに寄与したlaneを調べ、必要な[[isocore|isocore]]だけをsplitする。全てのstateをCanonical LRのように分けるのではなく、認識能力に影響するmergeだけを取り消す。

## grammar-relative inadequacyとの違い

文法自体が曖昧だったり、LR(1)では解けないconflictを持っていたりする場合、Canonical LRにも同じ問題が残る。これはstate mergeが原因ではないので、IELRのstate splittingで消える問題ではない。

つまり、IELRが除去するのは「LALRの近似によって追加された不足」であって、文法が持つ全てのconflictではない。

## contributionとの関係

一つのinadequacyは、conflictに関与する複数のactionやlaneから構成される。個別のstate、lane、lookaheadがそのinadequacyを発生させる経路上の寄与を[[inadequacy-contribution|inadequacy contribution]]と呼ぶ。

IELRはPhase 2で寄与をannotationし、Phase 3で同じ寄与の関係を保てるisocoreだけをmergeする。

## 出典

- [The IELR(1) algorithm](https://malloy.people.clemson.edu/publications/papers/scp09/scp09.pdf)
- [IELR(1) parser tables](https://malloy.people.clemson.edu/publications/papers/sac08/paper.pdf)
- [Mysterious Conflicts](https://www.gnu.org/software/bison/manual/html_node/Mysterious-Conflicts.html)
