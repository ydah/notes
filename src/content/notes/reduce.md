---
created: 2026-08-17
updated: 2026-08-17
---

# Reduce

#parser #lr

LRパーサーが、スタック上で[[production-rule|生成規則]]の右辺を認識したときに、その右辺を左辺の非終端記号へまとめる操作。Reduceではlookahead tokenを消費しない。

[[production-rule|生成規則]]`A -> β`をReduceする場合、概念的には次の処理を行う。

1. スタックから`β`に対応する記号と状態を取り除く
2. [[semantic-action|semantic action]]を実行する
3. 左辺の`A`と意味値をスタックへ積む
4. 現在の状態と`A`を[[goto-table|GOTO表]]で調べ、次の状態へ進む

例えば次の文法を考える。

```text
E -> E "+" n
E -> n
```

```text
スタック       入力       操作
$ n            +n$        Reduce E -> n
$ E            +n$        GOTO
$ E + n        $          Reduce E -> E + n
$ E            $          GOTO
```

`Reduce E -> n`では、入力の`+`はまだ消費しない。`n`を`E`にまとめた後、同じ`+`をlookaheadとして次の操作を決める。

Reduceのタイミングで[[semantic-action|semantic action]]を実行し、ASTノードや評価結果など、左辺の非終端記号に対応する意味値を作ることもある。

どのlookaheadでReduceできるかは、LRパーサーの構築方式によって異なる。[[slr-parser|SLR]]は[[follow-set|FOLLOW集合]]を使い、[[lalr-parser|LALR]]と[[canonical-lr-parser|Canonical LR]]は状態ごとのlookaheadを使う。

## 出典

- [The Bison Parser Algorithm](https://www.gnu.org/software/bison/manual/html_node/Algorithm.html)
- [Parser States](https://www.gnu.org/software/bison/manual/html_node/Parser-States.html)
- [Semantic Actions](https://www.gnu.org/software/bison/manual/html_node/Semantic-Actions.html)
