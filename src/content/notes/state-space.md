# 状態空間

#formal-methods #model-checking #state-space

[[state-transition-system|状態遷移系]]が取り得る状態と遷移の集合。初期状態から実際に到達できる部分をreachable state spaceと呼ぶ。

[[model-checking|モデル検査]]は状態空間をgraphとして探索し、違反状態やcycleを探す。訪問済み状態を記録し、同じ状態へ再び到達したときに探索を打ち切る方式もある。

変数や並行componentの組み合わせによって状態空間が急増する問題を、[[state-explosion|状態爆発]]と呼ぶ。状態空間の大きさは、探索の完全性と必要resourceの間に直接関わる。

## [[model-checking|モデル検査]]の中での位置づけ

検査器が探索する対象。

## 出典

- [Program Model Checking: A Practitioner's Guide — NASA](https://ntrs.nasa.gov/citations/20080015887)
- [Model Checking — My 27-year Quest to Overcome the State Explosion Problem](https://ntrs.nasa.gov/citations/20100024455)
