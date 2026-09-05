# 形式仕様

#formal-methods #formal-specification

形式仕様は、システムの状態、操作、制約、期待する性質を、構文と意味が明確な数学的記法で表したもの。自然言語では曖昧になりやすい「いつ操作できるか」「操作後に何が変わるか」を、論理式や[[state-transition-system|状態遷移系]]として記述できる。

形式仕様を書くだけでは、対象の正しさは証明されない。仕様同士の整合性や、仕様が性質を満たすかを[[formal-verification|形式検証]]で調べるための入力になる。

実装の全詳細を再現する必要もない。調べたい性質に関係する要素を残した抽象モデルにできる。ただし、現実の要件を正しく表しているかは別に確認が必要。

## [[formal-methods|形式手法]]の中での位置づけ

形式手法の出発点。検証対象と検証したい主張を、機械的に扱える形へ変える。

## 出典

- [Formal Methods Specification and Verification Guidebook — NASA](https://ntrs.nasa.gov/archive/nasa/casi.ntrs.nasa.gov/19980228002.pdf)
- [A High-Level View of TLA+](https://lamport.azurewebsites.net/tla/high-level-view.html)
