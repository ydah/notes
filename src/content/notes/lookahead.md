---
created: 2026-08-17 21:20
updated: 2026-08-17
---
# lookahead

#parser #compiler #lr #ll

パーサーが現在処理している位置の、まだ消費していない次の[[lookahead-token|lookahead token]]。パーサーはスタックや現在の文法規則だけでなく、lookaheadを見てshift・reduceや、次に使う[[production-rule|生成規則]]を決める。[[follow-set|FOLLOW集合]]が文法から計算した候補の集合なのに対し、lookaheadは実際の入力から得られたtoken。

## LRパーサーでのlookahead

LRパーサーが次の状態を決めるとき、現在の状態とlookahead tokenをパーサーテーブルで調べる。

```text
スタック: expr "+" term
入力:     "*" ...
lookahead: "*"
```

この場合は`*`をshiftして、後続の乗算を先に処理する。一方、lookaheadが`")"`なら、これ以上式を伸ばせないのでreduceする。

Canonical LR(1)では、LRアイテムごとにreduceを許可するlookaheadを持つ。

```text
[A -> α ., ")" ]
```

これは、現在の状態でlookaheadが`")"`のときにだけ`A -> α`をreduceする、という意味。SLRはこの情報の代わりに[[follow-set|FOLLOW集合]]を使うため、文脈を粗く扱う。

[[lookahead-correction|Lookahead Correction（LAC）]]は、lookahead tokenを別のtokenへ変換する仕組みではない。現在のparser stackでそのtokenが受理できるかをexploratory parseで先に確認し、構文エラーの検出遅延やexpected token listの誤りを抑える。

## LLパーサーでのlookahead

LL(1)の`1`は、1つのlookahead tokenを見て[[production-rule|生成規則]]を選ぶという意味。LL(k)なら最大でk個のtokenを先読みする。

```text
statement -> assignment | function-call
```

2つの規則の先頭が同じ場合、1つ先のtokenだけでは選べないことがある。先読みを増やす、左因子分解する、LL(*)のようにさらに先を調べる、といった方法で分岐を決める。

## FOLLOW集合との違い

- FOLLOW集合 — ある非終端記号の後ろに文法上現れうるtokenの集合
- lookahead — パース中に実際に次に来ているtoken

例えば`FOLLOW(A) = { "+", ")", "$" }`でも、現在の入力のlookaheadが必ずその全てになるわけではない。その時点では`+`かもしれないし、`)`かもしれない。SLRはこの集合をreduce条件に使い、Canonical LRは状態ごとにより限定されたlookaheadを持つ。

## 出典

- [Lookahead Tokens](https://www.gnu.org/software/bison/manual/html_node/Lookahead.html)
- [Parser States](https://www.gnu.org/software/bison/manual/html_node/Parser-States.html)
- [The Bison Parser Algorithm](https://www.gnu.org/software/bison/manual/html_node/Algorithm.html)
- [LL(*) parsing](https://www.antlr.org/papers/LL-star-PLDI11.pdf)
