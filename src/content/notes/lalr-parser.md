---
created: 2026-08-17 21:20
updated: 2026-08-17
---
# LALRパーサー

#parser #compiler #lalr #lr

Look-Ahead LR。Canonical LR(1)の状態から、LR(0)アイテム部分（core）が同じ状態をマージして[[lalr-table|LALR table]]を小さくする。[[slr-parser|SLR]]より状態ごとのlookaheadを細かく扱い、[[canonical-lr-parser|Canonical LR]]より状態数を抑える。yacc系のパーサージェネレータで広く使われてきた。

## 状態のマージ

Canonical LRに次のような状態があるとする。

```text
[A -> α ., "x"]
[A -> α ., "y"]
```

LR(0)部分だけを見ると、どちらも`A -> α .`。LALRでは同じcoreを持つ状態としてまとめ、lookaheadを統合する。

```text
[A -> α ., { "x", "y" }]
```

Canonical LRよりコンパクトなテーブルを作りやすい。

## 状態マージによるconflict

マージ前は別々の文脈にあった状態が1つになるため、統合後のlookaheadが広がる。その結果、元はなかったreduce/reduce conflictが発生する場合がある。LALRでだけ発生する、原因の分かりにくいconflictは[[mysterious-conflict|mysterious conflict]]と呼ばれる。

## 位置づけ

LALRはSLRより強く、Canonical LRより小さい。Bisonは歴史的な理由からLALR(1)をデフォルトにしている。文法の正確な認識能力が必要な場合は[[ielr|IELR]]やCanonical LRを選べる。

## 出典

- [LR Table Construction](https://www.gnu.org/software/bison/manual/html_node/LR-Table-Construction.html)
- [Mysterious Conflicts](https://www.gnu.org/software/bison/manual/html_node/Mysterious-Conflicts.html)
- [Bison Introduction](https://www.gnu.org/software/bison/manual/html_node/Introduction.html)
