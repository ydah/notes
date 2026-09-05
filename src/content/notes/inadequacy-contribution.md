---
created: 2026-08-18
updated: 2026-08-18
---

# inadequacy contribution

#parser #compiler #lr #ielr

inadequacy contributionは、特定のinadequacyの発生に寄与するstate、lane、lookahead、action。

## conflict全体との違い

conflictは、あるstateとlookahead tokenに複数のaction候補がある状態。conflict全体を一つの寄与とせず、各actionが来たlaneやlookaheadの経路に分解する。

例えば、別々のlaneから同じreduce itemに異なるlookaheadが集まり、shift actionとreduce actionが同じtoken上で衝突したとする。shiftを作るlane、reduceのlookaheadを運ぶlane、対応するstateやGOTOが、それぞれconflictへのcontributionになる。

## IELRのannotation

IELRのPhase 2では、LALR tableの[[inadequacy|inadequacy]]からlaneを逆向きにたどる。annotationは「このisocoreをこのままmergeすると、どのinadequacy contributionが保たれるか」を記録する。

寄与はstate番号だけでは表せない。同じLR(0) coreを持つstateでも、経由したlaneによってlookaheadが異なる。そこで、[[isocore|isocore]]、kernel item、token、actionの組み合わせとして追跡する。

Phase 3では、同じinadequacyに対して[[dominant-contribution|dominant contribution]]が同じになるisocoreだけをmergeする。異なる寄与を一つに混ぜるとLR(1)の区別を失うため、そのisocoreは別stateに分ける。

## lane annotationsとの関係

[[lane-annotations|lane annotations]]は、inadequacy contributionをstate machine上の経路に結び付ける。inadequacy contributionは「何がconflictに効いたか」、lane annotationは「どの経路を通って来たか」を表す。

## 出典

- [The IELR(1) algorithm](https://malloy.people.clemson.edu/publications/papers/scp09/scp09.pdf)
- [IELR(1) parser tables](https://malloy.people.clemson.edu/publications/papers/sac08/paper.pdf)
