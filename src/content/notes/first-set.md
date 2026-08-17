---
created: 2026-08-17
updated: 2026-08-17
---

# FIRST集合

#formal-language #grammar #parser #ll

記号列を文法から導出したとき、先頭に現れうる[[terminal-symbol|終端記号]]を集めた集合。記号列が[[epsilon|ε]]へ導出できる場合は、`ε`もFIRST集合に含める。

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

`A`が`"a"`を生成する場合は`"a"`が先頭になる。`A`が空文字列になる場合は、その次の`"b"`が先頭になるので、`FIRST(A "b")`には`"b"`も入る。ここで`ε`は`FIRST(A "b")`には残らない。

## 計算の要点

- `FIRST(a) = { a }`（`a`が終端記号の場合）
- `FIRST(ε) = { ε }`
- 非終端記号では、右辺の先頭から順にFIRST集合を加える。ある記号が`ε`を含むときだけ、次の記号も調べる。
- 右辺のすべての記号が`ε`へ導出できるとき、右辺全体のFIRST集合に`ε`を加える。

LL(1)パーサーは、入力のlookaheadと生成規則の右辺のFIRST集合を使って規則を選ぶ。右辺が空文字列になりうるときは[[follow-set|FOLLOW集合]]も必要になり、その結果が[[director-set|Director集合]]になる。

## 出典

- [4.2 LL(1) Parser Driver](https://web.cs.wpi.edu/~cs544/PLT4.2.html)
- [FIRST and FOLLOW Sets](https://www.cs.rochester.edu/~brown/173/lectures/flat/formal_lang/NewParse4lec.html)
