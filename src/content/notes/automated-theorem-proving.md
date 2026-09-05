# 自動定理証明

#formal-methods #theorem-proving

論理式で表した主張の証明をcomputerが自動で探索する方法。探索方法と完全性は、命題論理、first-order logic、特定domainのdecision procedureなど、対象とするlogicによって異なる。

[[smt-solver|SMT solver]]やSAT solverも自動推論に使われる。問題のfragmentによっては決定的に答えを返せる。一般のfirst-order logicやquantifierを含む問題では、時間切れや`unknown`になり得る。

[[interactive-theorem-proving|対話的定理証明]]にも自動化tacticは入るため、両者の境界はtoolごとに連続的。

## [[formal-methods|形式手法]]の中での位置づけ

検証条件から証明を探索するアプローチ。

## 出典

- [Theorem Proving in Lean 4 — Introduction](https://lean-lang.org/theorem_proving_in_lean4/introduction.html)
- [Z3 Guide — Quantifiers](https://microsoft.github.io/z3guide/docs/logic/Quantifiers/)
