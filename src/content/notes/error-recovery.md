---
created: 2026-08-18
updated: 2026-08-18
---

# error recovery

#parser #compiler #bison #syntax-error

error recoveryは、parserが[[syntax-error|構文エラー]]を検出した後も、解析を終了せず後続の入力を読むための処理。

## Bisonのerror token

Bisonは構文エラーが起きると、特別なterminal symbolであるerror tokenを生成する。文法にerrorを含む生成規則があれば、その規則を使える文脈までstackを戻して解析を続けられる。

~~~text
stmt:
    expr ";"
  | error ";"
;
~~~

この例ではstmtの途中でエラーになると、stack上のsymbolをpopしてerrorをShiftできるstateまで戻る。次のセミコロンを同期点にしてstatement単位で回復する。

## tokenの読み飛ばし

errorをShiftした後も、現在のlookahead tokenをShiftできないことがある。その場合、parserは字句解析機からtokenを読み、受理できるtokenが見つかるまで入力を破棄する。

~~~text
syntax error
   ↓
stackをpopして error をShift
   ↓
受理できるtokenまで入力を破棄
   ↓
通常の解析を再開
~~~

直前の[[lookahead-token|lookahead token]]は、error ruleの後でそのまま再解析される。アプリケーション側で入力を進めた場合は、error ruleのactionでyyclearinを使い、古いlookaheadを捨てる。yyerrokは、次のエラーを報告するまでの抑制状態を解除する。

## 回復は推測

どのtokenまで読み飛ばすかは、文法作者が回復戦略として決める。セミコロン、改行、閉じ括弧などを同期点にすることが多い。誤ったerror ruleを選ぶと、一つの入力ミスから複数のエラーが発生する。

error recoveryは入力を正しい文へ変換しない。後続の入力をできるだけ解析し、追加の診断や構文木を得るparserの動作。

[[lookahead-correction|Lookahead Correction（LAC）]]は、error recoveryそのものを選ぶ機能ではない。実際のstackで回復を始める前に現在のlookaheadが受理可能かを確認し、余分なReduceやsemantic actionによる文脈のずれを抑える。

## 出典

- [Error Recovery](https://www.gnu.org/software/bison/manual/html_node/Error-Recovery.html)
- [Lookahead Tokens](https://www.gnu.org/software/bison/manual/html_node/Lookahead.html)
- [LAC](https://www.gnu.org/software/bison/manual/html_node/LAC.html)
