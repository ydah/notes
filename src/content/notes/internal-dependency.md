---
created: 2026-08-18
updated: 2026-08-18
---

# internal dependency

#parser #compiler #lr #ielr

internal dependencyは、IELR(1)のgoto-follow計算で使うGOTO間の依存関係の1つ。DeRemerとPennelloのincludes dependencyを、依存が同じ状態の中で完結する場合と、先行状態までさかのぼる場合に分けたときの前者。

## GOTOのfollowへの依存

GOTOを次のように表す。

~~~text
g = GOTO(state_i, A) -> state_j
~~~

GOTO gのfollow setを計算するとき、gの先にあるitemのcoreを生成した別のGOTO g'のfollow setが必要になることがある。生成規則のgの非終端記号の後ろにある記号列がnullableなら、その記号列の後ろに来るtokenはg'の後ろにも来られるから。

この依存が、別の状態へ遷移する記号列を挟まずに同じstateの中で成立する場合がinternal dependency。

~~~text
同じ state
  ├─ g' : GOTO(state_i, B)
  └─ g  : GOTO(state_i, A)

g の follow ⊇ g' の follow
~~~

論文の定義では、goto-followのincludes関係に現れる経路の記号列をαとすると、αがεの場合をinternal dependencyとする。したがってg'のsource stateとgのsource stateは同じになる。

## 具体例

論文の例では、あるstateのG12のitem coreが、同じstateのG17から生成される。G12のitemで、G12が表す非終端記号の後ろの残りがεなので、G17のfollowに入るtokenはG12のfollowにも入る。

G12からG17までの依存経路が同じstateの中で完結しているため、この関係がinternal dependencyと呼ばれる。非終端記号が生成規則の先頭に現れる場合にこの形になり得る。

## predecessor dependencyとの違い

依存経路が別のstateを通って、gのsource stateのeventual predecessorまでさかのぼる場合は[[predecessor-dependency|predecessor dependency]]になる。

つまり、違いは「followが伝わるか」ではなく、includes dependencyをたどる経路が同じstate内で完結するか、先行stateを含むかにある。

internal dependencyとpredecessor dependencyは、successor dependencyをたどる前の依存関係としてまとめて扱う。[[goto-follow-closures|goto-follow closures]]では、まずこの2種類をたどってからsuccessor側のfollowを集める。successorの後にpredecessorをたどると、別のlaneのtokenを誤って混ぜる可能性がある。

## IELRでの位置づけ

internal dependencyは、あるstate内のGOTOとitem coreの関係を表す。IELRはこれを[[predecessor-dependency|predecessor dependency]]やsuccessor dependencyと区別して記録し、LALRのconflictに寄与したlookaheadの経路を正確に追跡する。

この追跡結果は[[lane-annotations|lane annotations]]に使われる。runtimeのparserが参照する依存関係ではなく、parser tableを生成するときの解析情報。

## 出典

- [The IELR(1) algorithm](https://malloy.people.clemson.edu/publications/papers/scp09/scp09.pdf)
- [IELR(1) parser tables](https://malloy.people.clemson.edu/publications/papers/sac08/paper.pdf)
