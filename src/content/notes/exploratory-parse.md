---
created: 2026-08-18
updated: 2026-08-18
---

# exploratory parse

#parser #compiler #lr #bison

exploratory parseは、[[lookahead-correction|Lookahead Correction（LAC）]]がlookahead tokenの受理可能性を調べるために行う一時的なparser操作。

## 通常のstackを変更しない解析

parserが字句解析機から[[lookahead-token|lookahead token]]を取得したとき、通常のstackでそのままReduceを実行する前に、一時的なstackでparser actionを試す。

~~~text
lookahead tokenを取得
        ↓
一時的なstackでReduceなどを試す
        ↓
tokenをShiftできる ──→ 通常の解析を再開
        ↓
Errorに到達 ────────→ 構文エラーとして扱う
~~~

ここで調べたいのは「今すぐShiftできるか」だけではなく、必要なReduceを続けた先でそのtokenをShiftできるかどうか。現在のparser stackでtokenが受理できないなら、通常のstackで余分なReduceを実行する前にエラーと判断できる。

## 実行しないもの

exploratory parseは入力をもう一度字句解析する処理ではない。既に取得したlookahead tokenを使うため、字句解析機の呼び出しは行わない。また、一時的な試行で[[semantic-action|semantic action]]を実行してはならない。

したがって、exploratory parseで行われるのはparser tableに基づく構文上の試行だけ。Shiftに到達した後、通常のstackで本来のReduceやsemantic actionを実行する。

## expected token list

詳細なsyntax error messageでexpected token listを作る場合、候補tokenごとにexploratory parseを行い、現在のparser contextで受理できるtokenを集められる。

default reductionやparser stateのmergeによって、通常のparserはlookaheadの確認前にReduceを進めることがある。exploratory parseはこのReduceを一時的なstackへ閉じ込めるため、error recoveryやsemantic actionが不正なtokenの影響を受けにくくなる。

## 出典

- [LAC](https://www.gnu.org/software/bison/manual/html_node/LAC.html)
- [Lookahead Tokens](https://www.gnu.org/software/bison/manual/html_node/Lookahead.html)
- [Default Reductions](https://www.gnu.org/software/bison/manual/html_node/Default-Reductions.html)
