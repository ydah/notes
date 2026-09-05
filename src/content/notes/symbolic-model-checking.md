# 記号的モデル検査

#formal-methods #model-checking #symbolic

状態や遷移を一つずつ列挙せず、状態集合と遷移関係を論理式やdecision diagramでまとめて表す[[model-checking|モデル検査]]。

BDD、SAT solver、[[smt-solver|SMT solver]]などを使い、多数の状態を一つの記号表現で操作する。圧縮効果はmodelの構造に依存する。式や内部表現自体が大きくなる場合もある。

TLA+向けのApalacheはsymbolic model checker。実行長を制限して論理式を解く[[bounded-model-checking|有界モデル検査]]も記号的手法として実装されることが多い。

## [[model-checking|モデル検査]]の中での位置づけ

状態集合を記号表現で扱う探索方式。

## 出典

- [TLA+ Tools](https://lamport.azurewebsites.net/tla/tools.html)
- [Formal Assurance Certifiable Tooling Strategy Final Report — NASA](https://ntrs.nasa.gov/citations/20170002595)
