# 活性

#formal-methods #liveness-property

「良いことがいつか起きる」を表す性質。要求がいつか処理される、algorithmがいつか終了する、待機中のprocessがいつか進める、といった主張を扱う。

有限の実行prefixだけを見ても、目的の事象がこの先で起きないとは確定できない。[[model-checking|モデル検査]]では、進展しない状態を繰り返すcycleが反例になることがある。

[[safety-property|安全性]]と組み合わせることで、「悪い状態を避ける」だけで停止したままの仕様を区別できる。活性を示すにはschedulerなどのfairness仮定が必要になる場合がある。

## [[formal-methods|形式手法]]の中での位置づけ

形式仕様に対して検査・証明する性質の一分類。

## 出典

- [A Science of Concurrent Programs — Safety, Liveness, and Fairness](https://lamport.azurewebsites.net/tla/science.pdf)
- [PlusCal Tutorial — Liveness](https://lamport.azurewebsites.net/tla/tutorial/session9.html)
