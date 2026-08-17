---
created: 2026-08-18
updated: 2026-08-18
---

# Lookahead Correction

#parser #compiler #lr #bison #syntax-error

Lookahead Correctionは、LRパーサーで構文エラーの検出が遅れる問題を抑える仕組み。LACと略す。新しいparser方式というより、既存のCanonical LR・IELR・LALRのparser runtimeに追加するエラー処理の機構。

## 何を補正するのか

LRパーサーは、現在の状態とlookahead tokenから[[shift|Shift]]や[[reduce|Reduce]]を決める。しかし、すぐにlookaheadを取得せず、状態に登録されたdefault reductionを先に実行することがある。

LALRやIELRでは、異なる文脈のparser stateをマージする。さらに、%nonassocやdefault reductionがあると、入力tokenが実際には不正なのに、parserがそのtokenを確認する前にstack上のReduceを何回か実行することがある。

この遅延によって、次の問題が起きる。

- 不正なtokenを前提に、意図しない[[semantic-action|semantic action]]が実行される
- [[syntax-error|構文エラー]]からのerror recoveryが、実際にtokenを読んだ位置とは異なるparser contextで始まる
- 詳細なエラーメッセージのexpected token listに、不正なtokenが含まれたり、正しいtokenが欠けたりする

LACは、lookahead tokenが現在のparser stackで本当に受理できるかを、通常のparser stackを変更せずに先に確認する。

## exploratory parse

LACを有効にすると、parserがscannerから新しいtokenを取得して次の操作を決める必要が生じたとき、通常の解析を一時停止する。そして一時的なstackを使ってexploratory parseを行う。

~~~text
lookahead tokenを取得
        ↓
一時的なstackでparser actionを先に試す
        ↓
Shiftに到達 ──→ 通常の解析を再開
        ↓
Errorに到達 ──→ 構文エラーを報告
~~~

exploratory parseでは、[[semantic-action|semantic action]]や字句解析器の呼び出しは行わない。Shiftに到達した場合だけ、通常のstackを使った解析を続ける。Errorに到達した場合は、stack上の余分なReduceを実行する前に構文エラーとして扱える。

詳細なexpected token listを作る場合は、文法中のtokenを候補としてそれぞれexploratory parseし、現在のcontextで受理できるtokenを調べる。

## Bisonでの指定

GNU Bisonでは、文法ファイルに次の指定を書くとLACを有効にできる。

~~~text
%define parse.lac full
~~~

デフォルトはnone。LACはparserの認識能力を変えない。LALR tableを使えばLALRが認識できる範囲のエラー処理を改善し、IELR tableを使えばIELRが認識できる範囲のエラー処理を改善する。

Canonical LRとIELRは、default reductionの設定を固定すれば、受理可能な入力と不正な入力の両方でほぼ同じ振る舞いになる。LALRがCanonical LRやIELRより少ない言語しか認識できないという性質は、LACを有効にしても変わらない。

## コストと注意点

exploratory parseでは、通常のparser actionの一部を二度実行するため、処理コストが増える。通常のstack全体をコピーするのではなく、一時stackの基底を通常のstackへ向ける実装にできる。また、semantic actionはexploratory parseでは実行しない。

LACを有効にしても、構文エラーの検出までに無限ループするparserを必ず停止できるわけではない。期待tokenの一覧が大きすぎる場合は、Bisonが一覧をメッセージから省略することもある。

[[lookahead|lookahead]]は入力から得た次のtokenそのものを指す。LACはそのtokenを別のtokenへ変換する仕組みではなく、現在のparser contextで受理できるかを先行して検証する仕組み。

## 出典

- [LAC](https://www.gnu.org/software/bison/manual/html_node/LAC.html)
- [%define Summary](https://www.gnu.org/software/bison/manual/html_node/_0025define-Summary.html)
- [Lookahead Tokens](https://www.gnu.org/software/bison/manual/html_node/Lookahead.html)
- [Default Reductions](https://www.gnu.org/software/bison/manual/html_node/Default-Reductions.html)
