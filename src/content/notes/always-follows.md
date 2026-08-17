---
created: 2026-08-18
updated: 2026-08-18
---

# always_follows

#parser #compiler #lr #ielr

always_followsは、GOTOのfollow setのうち、state splitの前後で変わらないtoken集合。IELRのPhase 1で計算し、Phase 3のlookahead再構築の基準にする。

## 定義

GOTOのfollowには、successor、internal、predecessorなど複数の依存経路からtokenが入る。このうち、successor dependencyとinternal dependencyだけを通って生成され、predecessor dependencyに依存しないtokenをalways_followsに入れる。

したがって、完全なgoto-follow setをgoto_followsと書けば、常に次の関係になる。

~~~text
always_follows(g) ⊆ goto_follows(g)
~~~

always_followsは、先行stateのkernel item lookaheadや、どのpredecessor laneから来たかに依存しない。stateをsplitしても、coreとそのsuccessor/internal dependencyが同じなら、この部分は変化しない。

## なぜ分けるのか

LALR stateをsplitすると、predecessor dependencyを通じて流れてくるlookaheadは、分割先によって変わる可能性がある。一方、successorとinternalだけで決まるtokenは分割の影響を受けない。

IELRはこの不変な部分をalways_followsとして先に切り出す。残りだけを[[follow-kernel-items|follow_kernel_items]]、annotation、[[kernel-item-lookahead-set|kernel item lookahead set]]と組み合わせて、split後のstateへ伝播する。

この分解により、Phase 3で全てのLALR lookaheadを捨てて計算し直す必要がなくなる。

## 依存関係との違い

always_followsは依存関係そのものではなく、依存関係を通じて得られるtokenの集合。[[goto-follow-closures|goto-follow closures]]が依存関係の閉包を計算し、always_followsはそのうちstate splitに対して不変な結果を保持する。

predecessor dependencyを含めて集めた完全なfollowは、always_followsより大きくなることがある。

## 出典

- [The IELR(1) algorithm](https://malloy.people.clemson.edu/publications/papers/scp09/scp09.pdf)
- [IELR(1) parser tables](https://core.ac.uk/download/pdf/82047055.pdf)
