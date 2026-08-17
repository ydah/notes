---
created: 2026-08-17
updated: 2026-08-17
---

# ε（空文字列）

#formal-language #grammar #parser

`ε`は長さ0の文字列。入力中の文字やtokenを1つも消費しない、という意味で文法に現れる。

例えば、

```text
list -> item list | ε
```

は、`list`が`item list`として続くか、何も生成せずに終わることを表す。後者の生成規則を空規則と呼ぶ。GNU Bisonでは、空規則を明示するために`%empty`も使える。

`ε`は[[empty-set|空集合]]ではない。空集合は要素を持たない集合で、`ε`は空の文字列という要素。[[first-set|FIRST集合]]が`ε`を含むとき、その記号列は空文字列へ導出できる。

空文字列へ導出できるかどうかは、[[follow-set|FOLLOW集合]]や[[director-set|Director集合]]の計算に影響する。例えば`A -> ε`を選ぶと、入力の次のtokenは`FOLLOW(A)`から選ばれる。

## 出典

- [Empty Rules](https://www.gnu.org/software/bison/manual/html_node/Empty-Rules.html)
- [Language and Grammar](https://www.gnu.org/software/bison/manual/html_node/Language-and-Grammar.html)
