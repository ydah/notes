---
created: 2026-08-18
updated: 2026-08-18
---

# Pennello

#parser #compiler #lr #lalr

Pennelloは、DeRemerとともにLALR(1)のlookaheadを効率よく計算するアルゴリズムを発表した研究者。

## parser generatorでの意味

LALR(1)では、LR(0) automatonを作ったあと、各reduce itemをどのtokenでreduceしてよいかを計算する必要がある。PennelloとDeRemerの方法は、これをCanonical LR(1) stateを全て作る処理としてではなく、GOTO間の関係の計算として行う。

GOTOを頂点として、nullableな記号列を通じてfollowを伝える関係を作る。関係の閉包を求め、token集合を固定点まで伝播させることで、reduce actionのlookaheadを得る。

この方法では、[[lalr-parser|LALR]]のstate数を小さく保ったまま、state merging後に必要なlookaheadを計算できる。実装上は、依存関係をSCCごとに処理して集合のunion回数を抑えることが重要になる。

## IELRでの参照点

IELRのPhase 0では、DeRemer/Pennelloの方法でLALR tableを作る。その後、state mergeによって失われたlookaheadの文脈を調べる。

Phase 3でstateを分割すると、分割前に計算したlookaheadをそのまま使えない。そこで[[follow-kernel-items|follow_kernel_items]]と[[always-follows|always_follows]]を使い、分割後も変わらない部分と、kernel itemのlookaheadに依存する部分を分けて再構築する。

したがって、Pennelloの仕事はIELRそのものを定義するものではないが、IELRが出発点にするLALR lookahead計算の基礎になっている。

## 出典

- [Efficient Computation of LALR(1) Look-Ahead Sets](https://3e8.org/pub/scheme/doc/parsing/Efficient%20Computation%20of%20LALR%281%29%20Look-Ahead%20Sets.pdf)
- [Efficient computation of LALR(1) look-ahead sets (DBLP)](https://dblp.org/rec/conf/pldi/PennelloD79)
- [The IELR(1) algorithm](https://malloy.people.clemson.edu/publications/papers/scp09/scp09.pdf)
