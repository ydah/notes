# 状態遷移系

#formal-methods #model-checking #state-transition-system

システムを、状態の集合と状態間で許される遷移によって表すmodel。

$$
M = (S, I, R)
$$

$S$は状態集合、$I \subseteq S$は初期状態、$R \subseteq S \times S$は遷移関係。初期状態から遷移を繰り返して得られる状態と経路が、システムの可能な振る舞いを表す。

[[formal-specification|形式仕様]]の表現方法の一つで、[[model-checking|モデル検査]]ではこの遷移をたどって[[state-space|状態空間]]を探索する。

## [[model-checking|モデル検査]]の中での位置づけ

検査対象となるmodelの基本構造。

## 出典

- [A High-Level View of TLA+](https://lamport.azurewebsites.net/tla/high-level-view.html)
- [Specifying and Verifying Systems With TLA+](https://lamport.azurewebsites.net/pubs/fm99.pdf)
