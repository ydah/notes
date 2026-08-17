---
created: 2026-08-17
updated: 2026-08-17
---

# Director集合

#formal-language #grammar #parser #ll

LL(1)パーサーが、1つのlookahead tokenを見て生成規則を選ぶための集合。生成規則`A -> α`ごとに、右辺`α`の先頭に現れうるtokenと、`α`が空文字列になった場合に`A`の後ろへ現れうるtokenをまとめる。

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

同じ非終端記号から出る異なる生成規則のDirector集合が互いに素なら、1 tokenのlookaheadだけで規則を選べる。集合が重なると、LL(1)の予測テーブルの同じセルに複数の規則が入り、conflictになる。

Director集合は[[first-set|FIRST集合]]と[[follow-set|FOLLOW集合]]を、生成規則を選ぶための入力tokenの集合として組み合わせたもの。[[epsilon|ε]]を生成できる規則ではFOLLOW集合を加える点が要所。

## 出典

- [CISC/CMPE-223, Parsing](https://research.cs.queensu.ca/home/cisc223/2011w/moni/m5.pdf)
- [Parsing theory of compilers of programming languages](https://www.jstage.jst.go.jp/article/jislr/1/2/1_5/_html/-char/en)
