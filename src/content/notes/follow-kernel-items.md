---
created: 2026-08-18
updated: 2026-08-18
---

# follow_kernel_items

#parser #compiler #lr #ielr

follow_kernel_itemsは、IELRのPhase 1で作る補助表。あるGOTOのfollowが、同じstateにあるどのkernel itemのlookaheadに依存するかを記録する。

## 表の意味

GOTOをg、同じstateのkernel itemをkとすると、follow_kernel_items[g][k]が真になるのは、gのfollowを計算するinternal dependencyの閉包が、kernel item kのdot直後のsymbolに対応するGOTOへ到達し、そのsymbolの後ろの記号列がnullableになる場合。

平たくいうと、gのfollowに入るtokenを、同じstateのkernel item kのlookaheadから供給できるかを表すboolean値。

これは文法全体のFOLLOW集合ではない。state、GOTO、kernel itemの組に依存するため、同じ非終端記号でも別stateのGOTOなら値が変わり得る。

## IELRでの用途

Phase 3でisocoreをsplitすると、stateのkernel item lookahead setはlaneごとに変わり得る。そこでfollow_kernel_itemsを使って、各GOTOのfollowのうち、どのkernel itemから影響を受ける部分を再計算する。

[[always-follows|always_follows]]はstate split後も変わらないtokenの基準になり、follow_kernel_itemsは分割されたstateごとに再構築が必要な部分を特定する。両者を組み合わせて、全lookaheadを最初から計算し直さずにpartial kernel item lookahead setを作る。

## 関係する依存

follow_kernel_itemsは[[internal-dependency|internal dependency]]をたどって求める。同じstate内で完結する依存を先に閉包するため、別stateのpredecessorから来るlaneの情報とは分けて扱える。

最終的なreduction lookaheadは、この表だけで決まるわけではない。DeRemer/Pennello方式のgoto-follow計算、[[predecessor-dependency|predecessor dependency]]、kernel itemのlookaheadを合わせて決まる。

## 出典

- [The IELR(1) algorithm](https://malloy.people.clemson.edu/publications/papers/scp09/scp09.pdf)
- [IELR(1) parser tables](https://core.ac.uk/download/pdf/82047055.pdf)
