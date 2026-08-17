---
created: 2026-08-17
updated: 2026-08-17
---

# 順位構文解析

#parser #compiler #lr

演算子の間の優先順位と結合方向を使って、式をbottom-upに解析するshift-reduce方式。英語ではoperator-precedence parsing。一般に、演算子順位文法を対象にする。

例えば、

```text
E -> E "+" E | E "*" E | NUMBER
```

のような式では、`+`と`*`の優先順位を別に指定する。スタックの末尾が`E + E`でlookaheadが`*`なら、`*`の方が強いのでReduceせずに`*`を[[shift|Shift]]する。`E * E`の後ろに`+`や入力末尾が来たら、`*`を先に[[reduce|Reduce]]する。

```text
入力: NUMBER + NUMBER * NUMBER

`+`の後ろで`*`を見つけたら Shift
`*`側の式を読み終えたら Reduce
```

順位構文解析は、演算子間の関係を表にして、スタック中の最上位の終端記号とlookaheadの終端記号の関係からShiftとReduceを決める。関係は通常、`a < b`、`a = b`、`a > b`の3種類で表す。括弧は優先順位の境界として扱う。

演算子順位文法には、一般に空規則を持たない、右辺に非終端記号が隣接して現れない、という制約がある。任意の文脈自由文法をそのまま順位構文解析できるわけではない。

[[shift-reduce-parsing|shift-reduce構文解析]]の一種だが、一般のLRパーサーが文法全体から構文解析表を作るのに対し、順位構文解析は演算子間の関係を直接使って式を処理する。GNU Bisonの`%left`や`%right`は、一般のLR表で発生したshift/reduce conflictを演算子の優先順位・結合方向で解決する仕組みであり、同じ考え方を利用するが、順位構文解析そのものとは別の仕組み。

## 出典

- [演算子順位構文解析法](https://www.hpcs.cs.tsukuba.ac.jp/~msato/lecture-note/comp-lecture/note4.html)
- [Operator Precedence Parsing](https://www.cs.utexas.edu/~novak/opprec.html)
- [Operator Precedence](https://www.gnu.org/software/bison/manual/html_node/Precedence.html)
