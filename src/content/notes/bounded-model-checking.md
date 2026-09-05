# 有界モデル検査

#formal-methods #model-checking #bounded-model-checking

初期状態から長さ $k$ までの実行に範囲を限定し、性質を破る経路が存在するかを調べる[[model-checking|モデル検査]]。

遷移関係を $k$ step分展開してSATや[[smt-solver|SMT solver]]へ渡す。解が得られれば、変数割り当てから[[counterexample|反例]]を構成できる。見つからない場合、原則として分かるのはそのbound内に反例がないことまで。

短い反例を効率よく探せる一方、無界の正しさを示すには別の帰納的手法や完全性boundが必要になる。

## [[model-checking|モデル検査]]の中での位置づけ

探索する実行長を制限したbug finding寄りの方式。

## 出典

- [Formal Assurance Certifiable Tooling Strategy Final Report — NASA](https://ntrs.nasa.gov/citations/20170002595)
