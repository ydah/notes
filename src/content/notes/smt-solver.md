# SMT solver

#formal-methods #smt #solver

Satisfiability Modulo Theoriesを解くsolver。論理式が、整数・実数・bit vector・arrayなどの背景theoryのもとで充足可能かを判定する。

式が充足可能なら`sat`とmodel、矛盾するなら`unsat`を返す。toolやlogicによっては判定できず`unknown`になる。主張 $P$ の妥当性は、否定 $\neg P$ が`unsat`かを調べる形へ変換できる。

[[automated-theorem-proving|自動定理証明]]、symbolic execution、[[symbolic-model-checking|記号的モデル検査]]などのbackendとして使われる。Z3は代表的な実装。

## [[formal-methods|形式手法]]の中での位置づけ

検証条件を背景theory込みで解く自動推論engine。

## 出典

- [SMT-LIB](https://smt-lib.org/)
- [Z3 Guide — Introduction](https://microsoft.github.io/z3guide/docs/logic/intro/)
- [Z3 Guide — Basic Commands](https://microsoft.github.io/z3guide/docs/logic/basiccommands/)
