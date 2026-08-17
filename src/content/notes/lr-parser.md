---
created: 2026-08-17 21:20
updated: 2026-08-17 21:20
---
# LRパーサー

#parser #compiler #lr

入力を左（Left）から右（Right）へ読みながら、右端導出を逆向きに実行する構文解析方式。状態スタックとパーサーテーブルを持ち、lookahead tokenと現在の状態からshift・reduceなどの次の操作を決める。[[ll-parser|LLパーサー]]が開始記号から入力へ向かって展開するのに対し、LRパーサーは入力を読みながら部分的な構造を開始記号へ畳み込んでいく。

## 動作

例えば次の文法で`2 + 3`を読む。

```text
expr -> expr "+" term | term
term -> NUMBER
```

概念的には次のような操作になる。

```text
shift NUMBER
reduce NUMBER -> term
reduce term -> expr
shift "+"
shift NUMBER
reduce NUMBER -> term
reduce expr "+" term -> expr
```

shiftは入力トークンをスタックへ積む操作、reduceはスタック上の記号列を生成規則の左辺へ置き換える操作。最後に開始記号までreduceできればacceptになる。

## LR系の方式

- **SLR**: FOLLOW集合を使ってreduceする。単純だが、状態の文脈を粗く扱う。
- **LALR**: 同じLR(0)コアを持つ状態をまとめる。状態数を抑えやすいが、状態のマージによってconflictが増えることがある。
- **Canonical LR(1)**: lookaheadを状態ごとに持つ。精密だが、状態数が増えやすい。
- **IELR**: LALRに近い状態数でCanonical LR(1)に近い言語認識能力を得ようとする。

## shift/reduce conflict

ある状態でshiftとreduceの両方が可能になるとshift/reduce conflictになる。`2 + 3 * 4`のような式では、`+`を先にreduceするか、`*`をshiftして後でreduceするかを決める必要がある。演算子の優先順位・結合方向を文法に指定して解決することが多い。

LRパーサーは左再帰を自然に扱えるため、左結合する演算子の文法をそのまま書きやすい。パーサーテーブルの状態とconflictを確認しながら文法を調整することになる。

## 出典

- [The Bison Parser Algorithm](https://www.gnu.org/software/bison/manual/html_node/Algorithm.html)
- [Parser States](https://www.gnu.org/software/bison/manual/html_node/Parser-States.html)
- [Shift/Reduce Conflicts](https://www.gnu.org/software/bison/manual/html_node/Shift_002fReduce.html)
- [LR Table Construction](https://www.gnu.org/software/bison/manual/html_node/LR-Table-Construction.html)
