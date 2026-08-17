---
created: 2026-08-18
updated: 2026-08-18
---

# dominant contribution

#parser #compiler #lr #ielr

dominant contributionは、一つのinadequacyに複数のaction contributionがあるとき、conflict resolutionの結果として選ばれるaction側の寄与。

## 「dominant」の意味

ここでのdominantは、頻度が高いとか、文法的に重要という意味ではない。parser tableのconflict resolution関数が、あるlookahead tokenに対して最終的に採用するactionを指す。

例えば、shift/reduce conflictに対してprecedenceとassociativityを適用し、reduceを選ぶなら、そのinadequacyについてはreduce側のcontributionがdominantになる。resolutionでactionを選べない場合は、dominant contributionも定まらない。

## IELRでの用途

同じLR(0) coreを持つ[[isocore|isocore]]をmergeしてよいかを判定するとき、IELRは各[[inadequacy|inadequacy]]についてdominant contributionが維持されるかを調べる。

二つのisocoreをmergeすると、あるtokenでdominant contributionが変わる場合、そのmergeはCanonical LR(1)と同じ認識結果を保てない。その場合はstateをsplitする。

逆に、異なるlaneが集まっても全てのinadequacyでdominant contributionが変わらないなら、同じstateへmergeできる。この判定によって、IELRは必要なstateだけを増やす。

precedence指定や[[nonassoc|%nonassoc]]は最終的なconflict resolutionに影響するが、dominant contributionの判定はgrammarの記述上の重要度ではなく、actionの選択結果に基づく。

## 出典

- [The IELR(1) algorithm](https://malloy.people.clemson.edu/publications/papers/scp09/scp09.pdf)
- [IELR(1) parser tables](https://malloy.people.clemson.edu/publications/papers/sac08/paper.pdf)
- [Operator Precedence](https://www.gnu.org/software/bison/manual/html_node/Precedence.html)
