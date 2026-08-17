---
created: 2026-08-17
updated: 2026-08-17
---

# 空集合

#formal-language #grammar #parser

要素を1つも持たない集合。`∅`で表す。

`∅`と[[epsilon|ε]]は別物。`∅`は集合そのものに要素がないことを表し、`ε`は長さ0の文字列という1つの要素。したがって、`{ ε }`は空集合ではない。

文法の集合計算では、例えばある記号列から導出できる先頭の終端記号がないときに`FIRST(α) = ∅`のように書く。`FIRST(α)`が`ε`を含むこととは意味が違う。

[[first-set|FIRST集合]]や[[director-set|Director集合]]の重なりを調べるときにも、`∅`との共通部分が空であることを使う。

## 出典

- [FIRST and FOLLOW Sets](https://www.cs.rochester.edu/~brown/173/lectures/flat/formal_lang/NewParse4lec.html)
