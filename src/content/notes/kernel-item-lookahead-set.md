---
created: 2026-08-18
updated: 2026-08-18
---

# kernel item lookahead set

#parser #compiler #lr #ielr

kernel item lookahead setは、あるparser stateのkernel itemに付いているlookahead tokenの集合。どのtokenをそのitemの文脈として保持するかを表す。

## itemのlookahead

LR(1) itemは、生成規則とdot位置にlookaheadを加えたもの。

~~~text
A -> α • β, a
~~~

このitemのlookaheadがaなら、βを読み終えてAをreduceする文脈にaが含まれる。reduce itemでは、この集合がreduce actionを置くtokenを決める。

kernel itemのlookahead setは、文法全体の非終端記号Aに対するFOLLOW(A)ではない。同じkernel itemでも、stateやそこへ到達したlaneによってlookaheadが変わる。

## predecessorからの生成

あるstateのkernel itemのlookaheadは、同じitemが現れる全てのpredecessor stateから生成される。ただし、predecessor側ではdotが一つ左にある位置から、そのitemへ遷移する場合を考える。

つまり、先行stateのkernel item lookaheadを、遷移先stateの同じkernel itemへ伝える。この生成を経路ごとに分けて保持することで、Canonical LR(1)の文脈を区別できる。

LALRでは同じcoreのstateをmergeするため、この集合がunionされる。IELRでは、どのlaneから来たlookaheadかを[[lane-annotations|lane annotations]]で追跡し、必要ならisocoreをsplitして混合を防ぐ。

## IELRでの用途

[[follow-kernel-items|follow_kernel_items]]は、GOTOのfollowが同じstateのどのkernel item lookaheadに依存するかを表す。[[always-follows|always_follows]]は、kernel item lookaheadに依存しない不変なfollow tokenを切り出す。

Phase 3では、これらを使ってsplit後のstateのpartial kernel item lookahead setを作り、annotationに含まれるlookaheadをsuccessor stateへ伝播する。Phase 4では、最終的なreduction lookaheadを改めて計算する。

## isocoreとの関係

[[isocore|isocore]]はlookaheadを除いたLR(0) coreが同じstateの集まり。isocoreをmergeできるかどうかは、kernel item lookahead setを混ぜても[[inadequacy|inadequacy]]を作らないかどうかに関係する。

## 出典

- [The IELR(1) algorithm](https://malloy.people.clemson.edu/publications/papers/scp09/scp09.pdf)
- [IELR(1) parser tables](https://core.ac.uk/download/pdf/82047055.pdf)
