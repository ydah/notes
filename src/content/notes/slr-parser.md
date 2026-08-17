---
created: 2026-08-17 21:20
updated: 2026-08-17
---
# SLRパーサー

#parser #compiler #slr #lr

Simple LR。LR(0)の状態機械を作り、reduceしてよいlookaheadを[[follow-set|FOLLOW集合]]から決めるLRパーサーの構築方式。[[lalr-parser|LALR]]や[[canonical-lr-parser|Canonical LR]]より単純だが、FOLLOW集合が文法全体の情報なので、現在の状態の文脈を細かく区別できない。

## reduceの条件

[[production-rule|生成規則]]を最後まで読み終えたLR(0)アイテムが、

```text
A -> α .
```

の形になっているとき、SLRはlookaheadがFOLLOW(A)に含まれていれば`A -> α`をreduceする。

例えば、

```text
FOLLOW(A) = { "+", ")", "$" }
```

なら、lookaheadが`+`、`)`、入力末尾の`$`のときにreduceする。

## 問題点

FOLLOW(A)は、Aが文法のどの文脈に現れているかを区別しない。実際にはある状態で`)`のときだけreduceすべきでも、文法全体のFOLLOW(A)に`+`が含まれていれば、`+`でもreduceを試みる。その結果、shift/reduce conflictやreduce/reduce conflictが発生することがある。

## 位置づけ

SLRはアルゴリズムを理解するためには分かりやすいが、複雑な文法ではconflictが増えやすい。`FOLLOW`集合を使う代わりに状態ごとのlookaheadを使うのがLALRやCanonical LR。

## 出典

- [LR Table Construction](https://www.gnu.org/software/bison/manual/html_node/LR-Table-Construction.html)
- [FIRST and FOLLOW Sets](https://www.cs.rochester.edu/~brown/173/lectures/flat/formal_lang/NewParse4lec.html)
- [The Bison Parser Algorithm](https://www.gnu.org/software/bison/manual/html_node/Algorithm.html)
