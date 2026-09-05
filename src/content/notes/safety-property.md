# 安全性

#formal-methods #safety-property

「悪いことが起きない」を表す性質。違反した実行には有限の時点で確定するbad prefixがあり、そこまでの状態列を見れば違反を指摘できる。

相互排他の破壊、不正な状態への到達、範囲外の値などが例。すべての到達可能状態で述語が真である[[invariant|不変条件]]は安全性の代表的な形になる。

[[liveness-property|活性]]は「良いことがいつか起きる」を扱うため、安全性だけでは一度も処理を進めないシステムを排除できない。

## [[formal-methods|形式手法]]の中での位置づけ

形式仕様に対して検査・証明する性質の一分類。

## 出典

- [A Science of Concurrent Programs — Safety, Liveness, and Fairness](https://lamport.azurewebsites.net/tla/science.pdf)
- [PlusCal Tutorial — Safety versus Liveness](https://lamport.azurewebsites.net/tla/tutorial/session9.html)
