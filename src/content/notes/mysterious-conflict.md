---
created: 2026-08-17
updated: 2026-08-17
---

# mysterious conflict

#parser #lr #lalr #bison

[[lalr-parser|LALR]]の状態マージによって発生する、原因が分かりにくいreduce/reduce [[conflict|conflict]]。LALR(1)の制限によって起き、[[canonical-lr-parser|Canonical LR(1)]]なら不要だったconflictが現れることがある。

例えば、次のように`ID`から`type`と`name`を作る文法を考える。

```text
def:         param_spec return_spec ','
param_spec:  type | name_list ':' type
return_spec: type | name ':' type
type:        ID
name:        ID
name_list:   name | name ',' name_list
```

`param_spec`と`return_spec`では`ID`の後ろに来るlookaheadが異なる。Canonical LR(1)は状態ごとのlookaheadを保持するため、文脈を分けて扱える。

LALRは同じLR(0) coreを持つ状態をマージする。マージ前は異なっていたlookaheadが統合され、`name`へReduceするか`type`へReduceするかを決められないreduce/reduce conflictになる。

これは文法が単純に曖昧だからとは限らない。使用する構文解析表の構築方式が、異なる文脈を同じ状態として扱ったことが原因になりうる。

## 対処

Bisonでは、[[ielr|IELR]]またはCanonical LRへ切り替えることで、この種類のconflictを避けられる。

```text
%define lr.type ielr
```

文法を書き換えて、マージ前の状態を区別できるようにする方法もある。[[ocamlyacc|ocamlyacc]]はLALR(1)を使うためIELRへ切り替えられない。[[menhir|Menhir]]はLR(1)を扱うため、LALRの状態マージに由来するconflictを避けやすい。

## 出典

- [Mysterious Conflicts](https://www.gnu.org/software/bison/manual/html_node/Mysterious-Conflicts.html)
- [LR Table Construction](https://www.gnu.org/software/bison/manual/html_node/LR-Table-Construction.html)
