---
created: 2026-08-17
updated: 2026-08-17
---

# Director集合

#formal-language #grammar #parser #ll

Director集合は、LL(1)パーサーが1つのlookahead tokenから[[production-rule|生成規則]]を選ぶための集合。規則`A -> α`ごとに、右辺`α`の先頭に現れうるtokenをまとめる。`α`が空文字列になりうる場合は、`A`の後ろに現れうるtokenも含める。

定義は次のとおり。

```text
Director(A -> α) = FIRST(α) - { ε }
                         （ε ∉ FIRST(α)）

Director(A -> α) = (FIRST(α) - { ε }) ∪ FOLLOW(A)
                         （ε ∈ FIRST(α)）
```

例えば、

```text
S -> A "b" | ε
A -> "a" | ε
```

入力末尾を`$`とすると、`FIRST(A "b") = { "a", "b" }`、`FOLLOW(S) = { "$" }`なので、

```text
Director(S -> A "b") = { "a", "b" }
Director(S -> ε)      = { "$" }
```

同じ非終端記号から出る各[[production-rule|生成規則]]のDirector集合が互いに素なら、1 tokenのlookaheadだけで規則を選べる。集合が重なると、LL(1)の予測テーブルの同じセルに複数の規則が入り、conflictになる。

Director集合は、規則を選ぶために[[first-set|FIRST集合]]と[[follow-set|FOLLOW集合]]を組み合わせた入力tokenの集合。[[epsilon|ε]]を生成できる規則ではFOLLOW集合を加える。

## 出典

- [CISC/CMPE-223, Parsing](https://research.cs.queensu.ca/home/cisc223/2011w/moni/m5.pdf)
- [Parsing theory of compilers of programming languages](https://www.jstage.jst.go.jp/article/jislr/1/2/1_5/_html/-char/en)
