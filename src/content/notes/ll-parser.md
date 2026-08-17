---
created: 2026-08-17 21:20
updated: 2026-08-17
---
# LLパーサー

#parser #compiler #ll

入力を左（Left）から右（Right）へ読みながら、左端導出を行う構文解析方式。開始記号から出発し、lookahead tokenを見て次に使う生成規則を選び、入力を上から下へ展開していく。[[lr-parser|LRパーサー]]が[[shift|Shift]]・[[reduce|Reduce]]で入力を畳み込むのに対し、LLパーサーはこれから読む構造を予測しながら進む。

## 再帰下降パーサー

LLパーサーは文法の[[nonterminal-symbol|非終端記号]]ごとに関数を作る再帰下降パーサーにしやすい。

```text
expr   -> term (("+" | "-") term)*
term   -> factor (("*" | "/") factor)*
factor -> NUMBER | "(" expr ")"
```

`parseExpr`が`parseTerm`を呼び、`parseTerm`が`parseFactor`を呼ぶ。各関数が対応する文法規則を処理するので、生成されたコードや手書きのコードを追いやすい。

## 左再帰と左因子分解

次のような左再帰文法は、単純な再帰下降パーサーでは扱えない。

```text
expr -> expr "+" term | term
```

`parseExpr`が入力を消費する前に自分自身を呼び続けるため。LL用には、通常は次のように書き換える。

```text
expr  -> term expr'
expr' -> "+" term expr' | ε
```

複数の生成規則が同じ接頭辞を持つ場合は、左因子分解して先読みだけで選べる形にする。

LL(1)の生成規則選択では、[[first-set|FIRST集合]]と[[follow-set|FOLLOW集合]]を使う。空文字列を生成できる規則では、両者を組み合わせた[[director-set|Director集合]]でlookaheadとの対応を見る。

## LL(k)とLL(*)

LL(1)は1トークン先読みして生成規則を選ぶ。LL(k)の`k`は必要な先読みトークン数。固定長の先読みでは決められない文法に対して、LL(*)はより長く先を調べて分岐を決める。ANTLR 4のAdaptive LL(*)は、入力に応じて予測を適応させる方式。

## LRとの違い

LLは文法から処理の流れを想像しやすく、再帰下降パーサーのデバッグもしやすい。一方で左再帰の除去や左因子分解が必要になることがある。LRは左再帰をそのまま扱いやすく、より広い文法を扱えるが、状態・パーサーテーブル・conflictの理解が必要になる。

## 出典

- [LL(*): The Foundation of the ANTLR Parser Generator](https://www.antlr.org/papers/LL-star-PLDI11.pdf)
- [Adaptive LL(*) Parsing: The Power of Dynamic Analysis](https://www.antlr.org/papers/allstar-techreport.pdf)
- [ANTLR4](https://github.com/antlr/antlr4)
