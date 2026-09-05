---
created: 2026-08-18
updated: 2026-08-18
---

# Lookahead Correction

#parser #compiler #lr #bison #syntax-error

Lookahead Correction（LAC）は、LRパーサーで構文エラーの検出が遅れる問題を抑える。既存のCanonical LR・IELR・LALRのparser runtimeに追加するエラー処理機構であり、新しいparser方式ではない。

LACは[[pslr|PSLR]]の博士論文で提案されたが、PSLRのコア機構ではない。両者の責務と実装上の分離は[[lac-and-pslr|LACとPSLRの関係]]で整理した。

## 何を補正するのか

LRパーサーは、現在の状態と[[lookahead-token|lookahead token]]から[[shift|Shift]]や[[reduce|Reduce]]を決める。しかし、すぐにlookaheadを取得せず、状態に登録された[[default-reduction|default reduction]]を先に実行することがある。

LALRやIELRは、異なる文脈のparser stateをマージする。さらに[[nonassoc|%nonassoc]]や[[default-reduction|default reduction]]があると、入力tokenが不正でも、確認前にstack上のReduceを何回か実行する場合がある。

この遅延によって、次の問題が起きる。

- 不正なtokenを前提に、意図しない[[semantic-action|semantic action]]が実行される
- [[syntax-error|構文エラー]]からのerror recoveryが、実際にtokenを読んだ位置とは異なるparser contextで始まる
- 詳細なエラーメッセージのexpected token listに、不正なtokenが含まれたり、正しいtokenが欠けたりする

LACは、lookahead tokenを現在のparser stackで受理できるか、通常のstackを変更せずに先行検査する。

## [[exploratory-parse|exploratory parse]]

LACを有効にすると、parserはscannerから新しいtokenを取得した時点で通常の解析を一時停止する。一時的なstackを使い、exploratory parseで次の操作を調べる。

~~~text
lookahead tokenを取得
        ↓
一時的なstackでparser actionを先に試す
        ↓
Shiftに到達 ──→ 通常の解析を再開
        ↓
Errorに到達 ──→ 構文エラーを報告
~~~

exploratory parseは、[[semantic-action|semantic action]]や字句解析器を呼び出さない。Shiftに到達した場合だけ、通常のstackを使った解析を続ける。Errorに到達した場合は、余分なReduceを実行する前に構文エラーとして扱う。

詳細なexpected token listを作る場合は、文法中の各tokenを候補にexploratory parseし、現在のcontextで受理できるtokenを調べる。

## Bisonでの指定

GNU Bisonでは、文法ファイルに次の指定を書くとLACを有効にできる。

~~~text
%define parse.lac full
~~~

デフォルトはnone。LACはparserの認識能力を変えない。LALR tableを使えばLALRが認識できる範囲のエラー処理を改善し、IELR tableを使えばIELRが認識できる範囲のエラー処理を改善する。

Canonical LRとIELRは、default reductionの設定を固定すれば、受理可能な入力と不正な入力の両方でほぼ同じ振る舞いになる。LACを有効にしても、LALRがCanonical LRやIELRより少ない言語しか認識できない性質は変わらない。

## コストと注意点

exploratory parseは通常のparser actionの一部を二度実行するため、処理コストが増える。通常のstack全体をコピーせず、一時stackの基底を通常のstackへ向ける実装にできる。semantic actionはexploratory parseでは実行しない。

LACを有効にしても、構文エラーの検出までに無限ループするparserを必ず停止できるわけではない。期待tokenの一覧が大きすぎる場合は、Bisonが一覧をメッセージから省略することもある。

[[lookahead-token|lookahead token]]は入力から得た次のtokenそのものを指す。LACはtokenを変換せず、現在のparser contextで受理できるかを先行検査する。

## 出典

- [LAC](https://www.gnu.org/software/bison/manual/html_node/LAC.html)
- [%define Summary](https://www.gnu.org/software/bison/manual/html_node/_0025define-Summary.html)
- [Lookahead Tokens](https://www.gnu.org/software/bison/manual/html_node/Lookahead.html)
- [Default Reductions](https://www.gnu.org/software/bison/manual/html_node/Default-Reductions.html)
