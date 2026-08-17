---
created: 2026-08-17 21:20
updated: 2026-08-17
---
# GNU Bison

#gnu #parser #compiler #lr

GNUプロジェクトのパーサージェネレータ。注釈付きの[[context-free-grammar|文脈自由文法]]から、決定的なLRパーサーまたは[[glr|GLR]]パーサーを生成する。yacc互換の文法とインターフェースを持つため、既存のyacc用文法を移行しやすい。[[yacc|Yacc]]の後継として使われることが多い。

## 生成するパーサー

通常のLRパーサーでは、文法から[[parsing-table|構文解析表]]を作り、入力tokenを[[shift|Shift]]・[[reduce|Reduce]]して解析する。Bisonは[[lalr-parser|LALR(1)]]・[[ielr|IELR]](1)・[[canonical-lr-parser|Canonical LR(1)]]のテーブル構築方式を切り替えられる。

構文エラーの検出を改善するために[[lookahead-correction|Lookahead Correction（LAC）]]も使える。%define parse.lac fullを指定すると、lookaheadを使ったexploratory parseでエラーを先に検証する。

文法が決定的LRで扱いにくい場合は、[[glr|GLR]]を使って未解決の[[conflict|shift/reduce conflict]]や[[conflict|reduce/reduce conflict]]に対する複数の解析候補を並行して追跡できる。

## 文法と出力

文法ファイルにはtoken、[[production-rule|生成規則]]、[[semantic-action|semantic action]]を書く。[[lexical-analyzer|字句解析機]]は別に用意し、生成された[[parser|構文解析器]]がtokenを取得するための関数を呼び出す構成が基本。

演算子の優先順位・結合方向を宣言でき、[[conflict|conflict]]の検出結果はverbose reportで状態ごとに確認できる。パーサーの状態・lookahead・reduce条件を調べながら文法を調整できる。

## Yaccとの関係

BisonはYaccとの互換性を重視して開発されてきた。Yaccの文法をそのまま利用できる場合が多いが、Bison独自の[[glr|GLR]]・[[ielr|IELR]]・[[canonical-lr-parser|Canonical LR]]・詳細なdiagnosticなども追加されている。

## 出典

- [GNU Bison](https://www.gnu.org/software/bison/)
- [Bison Reference Manual](https://www.gnu.org/software/bison/manual/)
- [Bison Parser Algorithm](https://www.gnu.org/software/bison/manual/html_node/Algorithm.html)
