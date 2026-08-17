---
created: 2026-08-17
updated: 2026-08-17
---

# Shift

#parser #lr

LRパーサーが、lookahead tokenを入力から読み取り、パーサースタックへ積む操作。Shiftでは入力tokenを消費し、対応する状態へ遷移する。生成規則の右辺を左辺へまとめる処理はまだ行わない。

現在の状態とlookahead tokenを[[parsing-table|構文解析表]]で調べると、Shiftと遷移先の状態が得られる。

```text
状態       スタック       lookahead   操作
...        $ E            "+"         Shift "+"
...        $ E +          n           Shift n
```

Shiftの後は、tokenの意味値と遷移先の状態がスタックに追加される。次の操作は、新しい状態と次のlookaheadを使って決める。

[[reduce|Reduce]]との違いは、Shiftが入力を消費するのに対して、Reduceはlookaheadを消費せず、スタック上の右辺を左辺へまとめる点。

## 出典

- [The Bison Parser Algorithm](https://www.gnu.org/software/bison/manual/html_node/Algorithm.html)
- [Parser States](https://www.gnu.org/software/bison/manual/html_node/Parser-States.html)
