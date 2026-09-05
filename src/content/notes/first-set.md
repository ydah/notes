---
created: 2026-08-17
updated: 2026-08-17
---

# FIRST集合

#formal-language #grammar #parser #ll

FIRST集合は、記号列を文法から導出したとき、先頭に現れうる[[terminal-symbol|終端記号]]を集めたもの。記号列が[[epsilon|ε]]へ導出できる場合は、`ε`も含める。

例えば、

```text
S -> A "b"
A -> "a" | ε
```

では、

```text
FIRST(A)     = { "a", ε }
FIRST(A "b") = { "a", "b" }
```

`A`が`"a"`を生成すれば、`"a"`が先頭になる。`A`が空文字列になれば、次の`"b"`が先頭になる。このため、`FIRST(A "b")`には`"b"`も入り、`ε`は残らない。

## 計算の要点

- `FIRST(a) = { a }`（`a`が終端記号の場合）
- `FIRST(ε) = { ε }`
- 非終端記号では、右辺の先頭から順にFIRST集合を加える。ある記号が`ε`を含むときだけ、次の記号も調べる。
- 右辺のすべての記号が`ε`へ導出できるとき、右辺全体のFIRST集合に`ε`を加える。

LL(1)パーサーは、入力のlookaheadと[[production-rule|生成規則]]の右辺のFIRST集合から規則を選ぶ。右辺が空文字列になりうる場合は[[follow-set|FOLLOW集合]]も使う。両者を組み合わせたものが[[director-set|Director集合]]になる。

## 出典

- [4.2 LL(1) Parser Driver](https://web.cs.wpi.edu/~cs544/PLT4.2.html)
- [FIRST and FOLLOW Sets](https://www.cs.rochester.edu/~brown/173/lectures/flat/formal_lang/NewParse4lec.html)
