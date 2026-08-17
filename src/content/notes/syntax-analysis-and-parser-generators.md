---
created: 2026-08-17 21:20
updated: 2026-08-17 21:20
---
# パーサージェネレータ

#parser #compiler #lr

文法ファイルからパーサーを生成するツール。字句解析器が作ったトークン列を文法に従って解析し、ASTや意味値を返すプログラムを生成する。文法からパーサーテーブルやランタイムを組み立てる方式が多く、yacc系のLRパーサージェネレータのほか、LL、PEG、GLRなど異なる方式のものがある。

## 主な機能

- **文法の記述**: 終端記号・非終端記号・生成規則を記述する。
- **パーサーの生成**: 文法から状態機械やパーサーテーブルを作り、入力を`shift` / `reduce`しながら解析するコードを生成する。
- **conflictの検出**: shift/reduce conflictやreduce/reduce conflictを報告する。
- **優先順位の指定**: 演算子の結合方向・優先順位を文法に指定してconflictを解決する。
- **意味作用の実行**: 生成規則に対応する処理をreduce時に実行し、ASTや評価結果などを組み立てる。

## LRパーサー

LRパーサーは入力を左から右に読みながら、右端導出を逆向きに実行する。状態スタックとパーサーテーブルを持ち、lookahead tokenと現在の状態からshift・reduceなどの次の操作を決める。

SLRはFOLLOW集合を使ってreduceする。LALRは同じLR(0)コアを持つ状態をまとめる。Canonical LR(1)はlookaheadを状態ごとに持つため精密だが、状態数が増えやすい。IELRはLALRに近い状態数でCanonical LR(1)に近い言語認識能力を得ようとする方式。

## 構成要素との関係

字句解析器がソースコードをトークン列に変換し、パーサーがそれを文法に従って構造化する。構文木から意味に必要な部分だけを残したものがAST。空白・コメント・括弧なども保持するCSTは、formatterやLSPのように入力の形を保つ必要がある処理で使われる。

## 出典

- [The Bison Parser Algorithm](https://www.gnu.org/software/bison/manual/html_node/Algorithm.html)
- [Shift/Reduce Conflicts](https://www.gnu.org/software/bison/manual/html_node/Shift_002fReduce.html)
- [racc documentation](https://ruby.github.io/racc/)
