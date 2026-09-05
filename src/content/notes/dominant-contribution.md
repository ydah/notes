---
created: 2026-08-18
updated: 2026-08-18
---

# dominant contribution

#parser #compiler #lr #ielr

dominant contributionは、一つのinadequacyに複数のaction contributionがあるとき、conflict resolutionで選ばれたaction側の寄与。

## 「dominant」の意味

ここでのdominantは、頻度の高さや文法上の重要性を意味しない。parser tableのconflict resolution関数が、あるlookahead tokenに対して最終的に採用するactionを指す。

例えば、shift/reduce conflictへprecedenceとassociativityを適用してreduceを選ぶとする。そのinadequacyではreduce側のcontributionがdominantになる。resolutionでactionを選べなければ、dominant contributionも定まらない。

## IELRでの用途

IELRは、同じLR(0) coreを持つ[[isocore|isocore]]をmergeしてよいか判定するとき、各[[inadequacy|inadequacy]]のdominant contributionが維持されるかを調べる。

二つのisocoreをmergeした結果、あるtokenのdominant contributionが変わるなら、Canonical LR(1)と同じ認識結果を保てない。その場合はstateをsplitする。

異なるlaneが集まっても、全てのinadequacyでdominant contributionが変わらなければ、同じstateへmergeできる。この判定により、IELRは必要なstateだけを増やす。

precedence指定や[[nonassoc|%nonassoc]]は、最終的なconflict resolutionに影響する。dominant contributionの判定は、grammarの記述上の重要度ではなくactionの選択結果に基づく。

## 出典

- [The IELR(1) algorithm](https://malloy.people.clemson.edu/publications/papers/scp09/scp09.pdf)
- [IELR(1) parser tables](https://malloy.people.clemson.edu/publications/papers/sac08/paper.pdf)
- [Operator Precedence](https://www.gnu.org/software/bison/manual/html_node/Precedence.html)
