---
created: 2026-08-18
updated: 2026-08-18
---

# DeRemer

#parser #compiler #lr #lalr

DeRemerは、LR構文解析の理論とLALR(1)の構築方法に関わった研究者。このノートでは、Pennelloと共同で発表したLALR(1)のlookahead計算アルゴリズムを扱う。

## DeRemerとLALR

Canonical LR(1)はstateごとにlookaheadを保持し、文脈を正確に区別する。その代わり、同じLR(0) coreを持つstateも別々に残る。

LALR(1)は同じcoreを持つstateをmergeする。DeRemerの研究は、このmergeを前提にreduction用のlookaheadを計算する方法を整理したもの。

文法の非終端記号ごとのFOLLOW集合ではなく、LR(0) automaton上のGOTOを頂点にする。lookaheadがどこからどこへ伝わるかを関係として表す。

## DeRemer/Pennelloの計算

典型的には次のような関係を使う。

- successor、またはread — nullableな遷移先を通じて、GOTOのfollowへtokenを伝える
- includes — あるGOTOのfollowが、別のGOTOのfollowを含む関係
- lookback — reduce itemのlookaheadと、対応するGOTOを結び付ける

これらの関係をグラフとして扱い、推移閉包やSCCを使って固定点までtoken集合を伝播させる。全てのCanonical LR(1) stateを構築せず、LR(0) automaton上で必要な依存だけを計算する。

この計算で得たlookaheadが、LALR tableのreduce actionに使われる。IELRの[[ielr|Phase 0]]も、まずこの方法でLALR tableを作る。

## IELRとの関係

DeRemer/Pennelloの計算では、LALR stateのmergeによって異なるlaneのlookaheadが一つに集まることがある。IELRはこのLALR tableを出発点に、[[inadequacy|inadequacy]]へ寄与した経路を調べ、必要なisocoreだけを分ける。

DeRemer/Pennelloのlookahead計算は、IELRの状態分割にも利用される。そのための構造として、[[goto-follow-closures|goto-follow closures]]、[[internal-dependency|internal dependency]]、[[predecessor-dependency|predecessor dependency]]を捉えられる。

## 出典

- [Efficient Computation of LALR(1) Look-Ahead Sets](https://3e8.org/pub/scheme/doc/parsing/Efficient%20Computation%20of%20LALR%281%29%20Look-Ahead%20Sets.pdf)
- [Efficient computation of LALR(1) look-ahead sets (DBLP)](https://dblp.org/rec/conf/pldi/PennelloD79)
- [The IELR(1) algorithm](https://malloy.people.clemson.edu/publications/papers/scp09/scp09.pdf)
