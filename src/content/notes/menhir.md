---
created: 2026-08-17 21:20
updated: 2026-08-17 21:20
---
# Menhir

#ocaml #parser #compiler #lr

OCaml向けのLR(1)パーサージェネレータ。高水準の文法定義とOCamlのsemantic actionからパーサーを生成する。[[yacc|yacc]]・ML-Yacc・ocamlyaccに影響を受けつつ、より現代的な文法記法・エラー処理・解析用APIを提供している。

## 入力と出力

文法ファイルは通常`.mly`に置く。デフォルトのcodeバックエンドでは、OCamlのコードとしてパーサーを生成し、`parser.ml`と`parser.mli`を出力する。

複数の`.mly`ファイルを渡して、部分文法を結合して1つの文法にすることもできる。文法には生成規則だけでなく、reduce時に実行するOCamlのsemantic actionも書く。

## バックエンド

- **code**: LRオートマトンを相互再帰するOCaml関数へコンパイルする。デフォルト。
- **table**: コンパクトなテーブルを生成し、MenhirLibのインタプリタで実行する。incremental APIとinspection APIはこのバックエンドで使える。
- **GLR**: 未解決のconflictを複数の解析候補として扱う。
- **Rocq**: 文法に対してparserがcorrect and completeであることの証明を含むRocqコードを生成する。

## ocamlyaccとの関係

ocamlyaccとの互換性を意識しつつ、文法の分析・conflictの説明・エラー処理などを拡張している。OCamlのコンパイラや言語ツールのparserを実装するための標準的な選択肢の一つ。

## 出典

- [Menhir Reference Manual](https://gallium.inria.fr/~fpottier/menhir/manual.html)
- [Menhir公式サイト](https://gallium.inria.fr/~fpottier/menhir/)
