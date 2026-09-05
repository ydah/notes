# 対話的定理証明

#formal-methods #theorem-proving #proof-assistant

人が証明方針や中間lemmaを与え、computerが各stepの正当性を検査しながら証明を組み立てる方法。

定義やtheoremをlogic上に記述し、tacticによる自動化を交えながらproof objectを作る。自動探索だけでは難しい大きな証明を扱える一方、形式化と証明scriptの作成・保守に手間がかかる。

実際の作業環境を提供するsoftwareが[[proof-assistant|proof assistant]]で、[[rocq|Rocq]]やLeanが該当する。

## [[formal-methods|形式手法]]の中での位置づけ

人の判断と機械検査を組み合わせる証明アプローチ。

## 出典

- [Theorem Proving in Lean 4 — Introduction](https://lean-lang.org/theorem_proving_in_lean4/introduction.html)
- [Lean Language Reference](https://lean-lang.org/doc/reference/latest/)
