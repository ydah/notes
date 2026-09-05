# 対称性削減

#formal-methods #model-checking #state-space-reduction

同じ役割を持つcomponentの入れ替えによって等価になる状態を、一つの同値類として扱う方法。代表状態だけを探索する。

同一仕様のprocessやnodeが複数あるsystemでは、識別子だけが異なる状態が大量に生まれる。それらを統合して[[state-space|状態空間]]を小さくする。

検査する性質も、componentの入れ替えに対して対称である必要がある。区別すべきnodeを同一視すると結果を壊すため、適用できる対称性を明示する。

## [[model-checking|モデル検査]]の中での位置づけ

[[state-explosion|状態爆発]]を抑えるstate-space reductionの一つ。

## 出典

- [Formal Assurance Certifiable Tooling Strategy Final Report — NASA](https://ntrs.nasa.gov/citations/20170002595)
