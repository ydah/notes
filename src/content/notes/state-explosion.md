# 状態爆発

#formal-methods #model-checking #state-explosion

modelを構成する変数や並行componentが増えると、[[state-space|状態空間]]が組み合わせ的・指数的に増える。この増加を状態爆発と呼ぶ。

各componentが $n$ 個の局所状態を持ち、それが $p$ 個独立に組み合わさると、全体は最大で $n^p$ 状態になる。thread interleaving、queue内容、timerなども状態数を増やす。

[[model-abstraction|モデル抽象化]]、[[symmetry-reduction|対称性削減]]、[[partial-order-reduction|部分順序削減]]、[[bounded-model-checking|探索範囲の制限]]などで管理する。最悪の場合の問題自体はなくならない。検査結果が完全探索か部分探索かを区別する必要がある。

## [[model-checking|モデル検査]]の中での位置づけ

実用上の探索規模を決める中心的な制約。

## 出典

- [Model Checking — My 27-year Quest to Overcome the State Explosion Problem](https://ntrs.nasa.gov/citations/20100024455)
- [Program Model Checking: A Practitioner's Guide — NASA](https://ntrs.nasa.gov/citations/20080015887)
