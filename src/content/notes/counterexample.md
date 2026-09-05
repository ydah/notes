# 反例

#formal-methods #model-checking #counterexample

反例は、主張が成り立たないことを示す具体例。[[model-checking|モデル検査]]では、検査する性質を破る状態や実行経路として返される。

[[safety-property|安全性]]の反例は、初期状態から違反状態までの有限な遷移列になる。[[liveness-property|活性]]の反例は、進展しない状態へ入りcycleを繰り返すlasso状の経路になることがある。

反例はmodelが許した振る舞いを示す。実装のbugだけでなく、[[formal-specification|仕様]]の遷移条件や環境仮定が広すぎる場合にも得られる。

## [[model-checking|モデル検査]]の中での位置づけ

性質が不成立だったときに得られる、原因調査用の出力。

## 出典

- [Model Checking — My 27-year Quest to Overcome the State Explosion Problem](https://ntrs.nasa.gov/citations/20100024455)
- [Program Model Checking: A Practitioner's Guide — NASA](https://ntrs.nasa.gov/citations/20080015887)
