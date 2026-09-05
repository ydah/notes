# 形式検証

#formal-methods #formal-verification

[[formal-specification|形式仕様]]で表した対象が、定義した性質を満たすことを数学的・機械的に確認すること。

$$
S \models P
$$

仕様 $S$ が性質 $P$ を含意するかを、[[model-checking|モデル検査]]、[[automated-theorem-proving|自動定理証明]]、[[interactive-theorem-proving|対話的定理証明]]などで調べる。

検証で成立するのは、形式化した対象と仮定についての主張。仕様と現実の要件の対応、実装と仕様の対応、compilerやhardwareを含むtrusted computing baseは別に検討する。形式検証はテストの代替ではなく、テストでは網羅しにくいケースを扱う補完手段。

## [[formal-methods|形式手法]]の中での位置づけ

形式仕様に対して性質が成立するかを調べる段階。

## 出典

- [Formal Methods Specification and Verification Guidebook — NASA](https://ntrs.nasa.gov/archive/nasa/casi.ntrs.nasa.gov/19980228002.pdf)
- [Theorem Proving in Lean 4 — Introduction](https://lean-lang.org/theorem_proving_in_lean4/introduction.html)
