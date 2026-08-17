---
created: 2026-08-17
updated: 2026-08-17
---

# shift-reduce構文解析

#parser #compiler #lr

入力を左から右へ読みながら、入力の一部をスタックに積み、認識済みの記号列を[[production-rule|生成規則]]の左辺へ畳み込んでいくbottom-up方式の構文解析。次のtokenをスタックへ積む操作が[[shift|Shift]]、スタック上の右辺を左辺へ置き換える操作が[[reduce|Reduce]]。

[[lr-parser|LRパーサー]]は、[[parsing-table|構文解析表]]を使い、ShiftとReduceを状態とlookaheadから決める代表的なshift-reduce構文解析器。LRという名前のとおり、入力をLeftからRightへ読み、[[rightmost-derivation|右端導出]]を逆向きに実行する。

## 例

```text
E -> E "+" n
E -> n
```

入力`n + n`に対する操作は概念的には次のようになる。

```text
スタック       入力       操作
$              n+n$       Shift n
$ n            +n$        Reduce E -> n
$ E            +n$        Shift "+"
$ E +          n$         Shift n
$ E + n        $          Reduce E -> E + n
$ E            $          accept
```

Shiftは入力を1 token消費する。Reduceはlookaheadを消費せず、スタック上の記号列を左辺の非終端記号にまとめる。

現在の状態とlookaheadに対してShiftとReduceの両方が候補になると、shift/reduce conflictになる。演算子の優先順位や結合方向を指定して解決することが多い。

## 出典

- [The Bison Parser Algorithm](https://www.gnu.org/software/bison/manual/html_node/Algorithm.html)
- [Parser States](https://www.gnu.org/software/bison/manual/html_node/Parser-States.html)
- [Shift/Reduce Conflicts](https://www.gnu.org/software/bison/manual/html_node/Shift_002fReduce.html)
