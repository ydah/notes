# 部分順序削減

#formal-methods #model-checking #state-space-reduction

互いに独立な並行操作について、結果に影響しない実行順序をまとめ、代表的なinterleavingだけを探索する方法。

操作 $a$ と $b$ が独立なら、`a; b`と`b; a`の一方だけを代表として残せる。並行processの全scheduleを展開する場合より[[state-space|状態空間]]を大きく減らせる。

独立性の判定と、検査する性質が削減で保存される条件が必要。共有状態へのaccessなどで操作が依存する場合は順序を落とせない。

## [[model-checking|モデル検査]]の中での位置づけ

[[state-explosion|状態爆発]]を抑えるstate-space reductionの一つ。

## 出典

- [Partial Order Reduction of the State Space — SPIN](https://spinroot.com/spin/Workshops/ws95/papers.html)
- [Formal Assurance Certifiable Tooling Strategy Final Report — NASA](https://ntrs.nasa.gov/citations/20170002595)
