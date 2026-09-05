---
created: 2026-08-18
updated: 2026-08-18
---

# exploratory parse

#parser #compiler #lr #bison

exploratory parseは、[[lookahead-correction|Lookahead Correction（LAC）]]がlookahead tokenの受理可能性を調べる一時的なparser操作。

## 通常のstackを変更しない解析

parserは字句解析機から[[lookahead-token|lookahead token]]を取得すると、通常のstackでReduceする前に、一時的なstackでparser actionを試す。

~~~text
lookahead tokenを取得
        ↓
一時的なstackでReduceなどを試す
        ↓
tokenをShiftできる ──→ 通常の解析を再開
        ↓
Errorに到達 ────────→ 構文エラーとして扱う
~~~

調べるのは「今すぐShiftできるか」だけではなく、必要なReduceを続けた先でそのtokenをShiftできるかどうか。現在のparser stackで受理できなければ、通常のstackで余分なReduceを実行する前にエラーと判断できる。

## 実行しないもの

exploratory parseは入力をもう一度字句解析しない。既に取得したlookahead tokenを使うため、字句解析機を呼び出さない。一時的な試行では[[semantic-action|semantic action]]も実行しない。

exploratory parseが行うのは、parser tableに基づく構文上の試行だけ。Shiftに到達した後、通常のstackで本来のReduceやsemantic actionを実行する。

## expected token list

詳細なsyntax error messageのexpected token listは、候補tokenごとのexploratory parseから作れる。現在のparser contextで受理できるtokenだけを集める。

default reductionやparser stateのmergeにより、通常のparserはlookaheadの確認前にReduceを進めることがある。exploratory parseはこのReduceを一時的なstackへ閉じ込める。その結果、error recoveryやsemantic actionが不正なtokenの影響を受けにくくなる。

## 出典

- [LAC](https://www.gnu.org/software/bison/manual/html_node/LAC.html)
- [Lookahead Tokens](https://www.gnu.org/software/bison/manual/html_node/Lookahead.html)
- [Default Reductions](https://www.gnu.org/software/bison/manual/html_node/Default-Reductions.html)
