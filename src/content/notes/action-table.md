---
created: 2026-09-07
updated: 2026-09-07
---

# ACTION表

#parser #compiler #lr

ACTION表は、LRパーサーが現在の[[parser-state|parser state]]と[[lookahead-token|lookahead token]]から次の操作を決める表。行をparser state、列を終端記号とし、次の形で参照する。

```text
ACTION[state, lookahead] -> shift / reduce / accept / error
```

各セルには次のいずれかが入る。

- `shift j` — lookahead tokenを読み、状態`j`へ進む
- `reduce A -> α` — [[production-rule|生成規則]]`A -> α`で[[reduce|Reduce]]する
- `accept` — 入力全体を[[accept|Accept]]する
- `error` — その状態ではlookahead tokenを処理できない

[[goto-table|GOTO表]]は、Reduceによって作った非終端記号から次の状態を求める。ACTION表が終端記号に対する操作を返すのに対し、GOTO表は非終端記号に対する状態番号を返す。両方を合わせたものが[[lr-table|LR table]]になる。

表の構築中に一つのセルへ複数の操作が入ろうとすると、[[conflict|shift/reduce conflictまたはreduce/reduce conflict]]になる。優先順位などで解決すれば一つの操作に決まる。未解決のconflictはパーサージェネレータが報告し、生成を続ける実装では既定規則で一つの操作を選ぶ。

## 出典

- [The Bison Parser Algorithm](https://www.gnu.org/software/bison/manual/html_node/Algorithm.html)
- [Parser States](https://www.gnu.org/software/bison/manual/html_node/Parser-States.html)
- [LR Table Construction](https://www.gnu.org/software/bison/manual/html_node/LR-Table-Construction.html)
- [Shift/Reduce Conflicts](https://www.gnu.org/software/bison/manual/html_node/Shift_002fReduce.html)
- [Reduce/Reduce Conflicts](https://www.gnu.org/software/bison/manual/html_node/Reduce_002fReduce.html)
