# モデル抽象化

#formal-methods #model-checking #abstraction

検査したい性質に関わる振る舞いを残し、値や状態の詳細をまとめて小さなmodelへ変換すること。

unboundedな整数を有限区分に分ける、不要な変数を落とす、環境入力を代表値へ絞るなどの方法がある。[[state-space|状態空間]]を減らし、無限状態のsystemを有限modelとして扱える場合がある。

抽象modelと元のsystemの対応が重要になる。抽象化が粗すぎると偽の[[counterexample|反例]]が出る。必要な振る舞いを落とすとbugを見逃す。

## [[model-checking|モデル検査]]の中での位置づけ

[[state-explosion|状態爆発]]を抑えるため、検査前にmodelの詳細度を調整する方法。

## 出典

- [Formal Assurance Certifiable Tooling Strategy Final Report — NASA](https://ntrs.nasa.gov/citations/20170002595)
- [Program Model Checking: A Practitioner's Guide — NASA](https://ntrs.nasa.gov/citations/20080015887)
