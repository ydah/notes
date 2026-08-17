---
created: 2026-08-18
updated: 2026-08-18
---

# inadequacy contribution

#parser #compiler #lr #ielr

inadequacy contributionは、特定のinadequacyを発生させるのに関与するstate、lane、lookahead、actionの寄与。

## conflict全体との違い

conflictは、あるstateとlookahead tokenに対して複数のaction候補がある状態。そのconflict全体が一つの寄与なのではなく、各actionがどのlaneやlookaheadの経路から来たかを分解して考える。

例えば、別々のlaneから同じreduce itemに異なるlookaheadが集まり、shift actionとreduce actionが同じtoken上で衝突したとする。このとき、shiftを作るlane、reduceのlookaheadを運ぶlane、対応するstateやGOTOが、それぞれconflictへのcontributionになる。

## IELRのannotation

IELRのPhase 2では、LALR tableの[[inadequacy|inadequacy]]からlaneを逆向きにたどる。annotationは「このisocoreをこのままmergeすると、どのinadequacy contributionが保たれるか」を記録する。

寄与はstate番号だけでは表せない。同じLR(0) coreを持つstateでも、どのlaneを経由したかによってlookaheadが違うため、[[isocore|isocore]]、kernel item、token、actionの組み合わせとして追跡する必要がある。

Phase 3では、同じinadequacyに対して[[dominant-contribution|dominant contribution]]が同じになるisocoreだけをmergeする。異なる寄与を一つに混ぜるとLR(1)の区別を失うため、そのisocoreは別stateに分ける。

## lane annotationsとの関係

[[lane-annotations|lane annotations]]は、inadequacy contributionをstate machine上の経路に結び付けたもの。inadequacy contributionが「何がconflictに効いたか」という情報で、lane annotationが「それがどの経路を通って来たか」という情報。

## 出典

- [The IELR(1) algorithm](https://malloy.people.clemson.edu/publications/papers/scp09/scp09.pdf)
- [IELR(1) parser tables](https://malloy.people.clemson.edu/publications/papers/sac08/paper.pdf)
