# 不変条件

#formal-methods #formal-verification #invariant

すべての到達可能状態で真であり続ける状態述語。仕様 $S$ と述語 $I$ について、次が成り立つとき $I$ は不変条件になる。

$$
S \models \Box I
$$

初期状態で成立し、各遷移の前に成立していれば遷移後も成立することを示す帰納的な証明が基本。[[model-checking|モデル検査]]では到達状態ごとに評価し、偽になる状態への経路を[[counterexample|反例]]として返せる。

相互排他、型の範囲、resource数の保存などを表す[[safety-property|安全性]]の代表的な形。

## [[model-checking|モデル検査]]の中での位置づけ

到達状態ごとに検査する主要な性質。

## 出典

- [Specifying and Verifying Systems With TLA+](https://lamport.azurewebsites.net/pubs/fm99.pdf)
- [A High-Level View of TLA+](https://lamport.azurewebsites.net/tla/high-level-view.html)
