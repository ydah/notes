---
created: 2026-08-17
updated: 2026-08-17
---

# conflict

#parser #compiler #lr #grammar

パーサーのある状態で、同じlookaheadに対して複数の解析操作が候補になること。conflictは構文エラーそのものではなく、パーサー構築時に文法や解析方式の問題として報告される。

主な種類は2つ。

- **shift/reduce conflict** — tokenを[[shift|Shift]]するか、既存の生成規則を[[reduce|Reduce]]するか決められない。
- **reduce/reduce conflict** — 2つ以上の生成規則のどれをReduceするか決められない。

典型的なshift/reduce conflictは、dangling elseの文法で起きる。

```text
stmt:
    "if" expr "then" stmt
  | "if" expr "then" stmt "else" stmt
  ;
```

`if expr then stmt else stmt`を解析するとき、最初の規則でReduceすることも、`else`をShiftして2番目の規則へ進むこともできる。

GNU Bisonでは、特別な指定がなければshift/reduce conflictでShiftを選ぶ。演算子の優先順位や結合方向を指定して解決することもできる。reduce/reduce conflictは、同じ入力を複数の規則でReduceできる状態で、semantic actionの選択も変わるため、通常は文法を修正して解消する。

conflictがあるからといって、文法が必ず曖昧とは限らない。LALRの状態マージが文脈の情報を失うことでconflictが発生することもある。これが[[mysterious-conflict|mysterious conflict]]につながる。

## 出典

- [Shift/Reduce Conflicts](https://www.gnu.org/software/bison/manual/html_node/Shift_002fReduce.html)
- [Reduce/Reduce Conflicts](https://www.gnu.org/software/bison/manual/html_node/Reduce_002fReduce.html)
- [Mysterious Conflicts](https://www.gnu.org/software/bison/manual/html_node/Mysterious-Conflicts.html)
- [Menhir Reference Manual](https://gallium.inria.fr/~fpottier/menhir/manual.html)
