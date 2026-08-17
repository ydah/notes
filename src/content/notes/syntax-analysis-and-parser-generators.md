---
created: 2026-08-17 21:20
updated: 2026-08-17
---
# パーサージェネレータ

#parser #compiler #lr #ll

文法ファイルから[[parser|構文解析器]]を生成するツール。[[lexical-analyzer|字句解析機]]が作ったトークン列を文法に従って解析し、ASTや意味値を返すプログラムを生成する。文法から[[parsing-table|構文解析表]]やランタイムを組み立てる方式が多く、yacc系の[[lr-parser|LRパーサー]]や[[ll-parser|LLパーサー]]のほか、PEG、GLRなど異なる方式のものがある。

## 主な機能

- **文法の記述**: [[terminal-symbol|終端記号]]・[[nonterminal-symbol|非終端記号]]・生成規則を記述する。
- **パーサーの生成**: 文法から状態機械やパーサーテーブルを作り、入力を`shift` / `reduce`しながら解析するコードを生成する。
- **conflictの検出**: [[shift-reduce-parsing|shift/reduce構文解析]]で起きるshift/reduce conflictやreduce/reduce conflictを報告する。
- **優先順位の指定**: 演算子の結合方向・優先順位を文法に指定してconflictを解決する。
- **意味作用の実行**: 生成規則に対応する処理をreduce時に実行し、ASTや評価結果などを組み立てる。

## パーサー方式

- [[lr-parser|LRパーサー]] — 入力を左から右に読み、右端導出を逆向きに実行する。[[shift-reduce-parsing|shift/reduce構文解析]]を使う。
- [[ll-parser|LLパーサー]] — 入力を左から右に読み、左端導出を行う。再帰下降パーサーにしやすい。

## 実装例

- [[yacc|Yacc]] / [[gnu-bison|GNU Bison]] — yacc系のLRパーサージェネレータ
- [[menhir|Menhir]] — OCaml向けのLR(1)パーサージェネレータ
- [[roslyn|Roslyn]] — パーサーを含むコンパイラをAPIとして公開する.NET Compiler Platform

## 構成要素との関係

[[lexical-analyzer|字句解析機]]がソースコードをトークン列に変換し、[[parser|構文解析器]]がそれを[[context-free-grammar|文脈自由文法]]に従って構造化する。構文木から意味に必要な部分だけを残したものがAST。空白・コメント・括弧なども保持するCSTは、formatterやLSPのように入力の形を保つ必要がある処理で使われる。

## 出典

- [The Bison Parser Algorithm](https://www.gnu.org/software/bison/manual/html_node/Algorithm.html)
- [Shift/Reduce Conflicts](https://www.gnu.org/software/bison/manual/html_node/Shift_002fReduce.html)
- [racc documentation](https://ruby.github.io/racc/)
