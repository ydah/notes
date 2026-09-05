# 明示的状態モデル検査

#formal-methods #model-checking

個々の状態を具体的に生成し、[[state-space|状態空間]]をgraph traversalによって探索する[[model-checking|モデル検査]]。

到達した状態を保存して重複探索を避ける。遷移を一つずつ適用して性質を評価し、違反を見つければ探索stackなどから[[counterexample|反例]]を復元できる。

探索の構造が直接的で反例を追いやすい。一方、状態を列挙・保存するため[[state-explosion|状態爆発]]の影響を受ける。TLA+のTLCは明示的状態model checker。

## [[model-checking|モデル検査]]の中での位置づけ

状態を一つずつ扱う探索方式。

## 出典

- [TLA+ Tools](https://lamport.azurewebsites.net/tla/tools.html)
- [Formal Assurance Certifiable Tooling Strategy Final Report — NASA](https://ntrs.nasa.gov/citations/20170002595)
