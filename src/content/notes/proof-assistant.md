# Proof assistant

#formal-methods #proof-assistant #theorem-proving

定義、theorem、proofを記述し、機械検査済みの証明を構築するsoftware。[[interactive-theorem-proving|対話的定理証明]]の言語、elaborator、tactic、library、proof checkerなどをまとめて提供する。

RocqやLeanでは、tacticがproof termを生成し、小さなkernelが型検査する。複雑なautomationにbugがあっても、kernelが不正なproof termを拒否できる。この構成により、trusted computing baseを絞る。

[[rocq|Rocq]]はこの分類に属する具体的なtool。

## [[formal-methods|形式手法]]の中での位置づけ

対話的定理証明を実行するためのtool群。

## 出典

- [Rocq core language](https://docs.rocq-prover.org/master/refman/language/core/index.html)
- [Lean Language Reference](https://lean-lang.org/doc/reference/latest/)
