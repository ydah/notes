---
created: 2026-08-17 21:20
updated: 2026-08-17
---
# パーサージェネレータ

#parser #compiler #lr #ll

文法ファイルから[[parser|構文解析器]]を生成するツール。[[lexical-analyzer|字句解析機]]が作ったトークン列を文法に従って解析し、[[ast|AST]]や意味値を返すプログラムを生成する。文法から[[parsing-table|構文解析表]]やランタイムを組み立てる方式が多く、yacc系の[[lr-parser|LRパーサー]]や[[ll-parser|LLパーサー]]のほか、PEG、[[glr|GLR]]など異なる方式のものがある。

## 主な機能

- **文法の記述**: [[terminal-symbol|終端記号]]・[[nonterminal-symbol|非終端記号]]・[[production-rule|生成規則]]を記述する。
- **パーサーの生成**: 文法から状態機械やパーサーテーブルを作り、入力を`shift` / `reduce`しながら解析するコードを生成する。
- **conflictの検出**: [[conflict|conflict]]や[[shift-reduce-parsing|shift/reduce構文解析]]で起きる[[conflict|shift/reduce conflict]]、[[conflict|reduce/reduce conflict]]を報告する。
- **優先順位の指定**: 演算子の結合方向・優先順位を文法に指定してconflictを解決する。
- **意味作用の実行**: [[semantic-action|semantic action]]をreduce時に実行し、ASTや評価結果などを組み立てる。

## パーサー方式

- [[lr-parser|LRパーサー]] — 入力を左から右に読み、右端導出を逆向きに実行する。[[shift-reduce-parsing|shift/reduce構文解析]]を使う。
- [[ll-parser|LLパーサー]] — 入力を左から右に読み、左端導出を行う。再帰下降パーサーにしやすい。

## 実装例

- [[yacc|Yacc]] / [[gnu-bison|GNU Bison]] — yacc系のLRパーサージェネレータ
- [[menhir|Menhir]] — OCaml向けのLR(1)パーサージェネレータ
- [[roslyn|Roslyn]] — パーサーを含むコンパイラをAPIとして公開する.NET Compiler Platform
- [[lrama|Lrama]] — Rubyで書かれたLALR(1) parser generator

## 構成要素との関係

[[lexical-analyzer|字句解析機]]がソースコードをトークン列に変換し、[[parser|構文解析器]]がそれを[[context-free-grammar|文脈自由文法]]に従って[[syntax-tree|構文木]]へ構造化する。[[ast|AST]]は意味に関係する構造へ抽象化した木で、[[cst|CST]]は空白・コメント・括弧などの具体的な表記を保持する木。formatterやLSPのように入力の形を保つ必要がある処理ではCST寄りの構文木が使われる。

## 出典

- [The Bison Parser Algorithm](https://www.gnu.org/software/bison/manual/html_node/Algorithm.html)
- [Shift/Reduce Conflicts](https://www.gnu.org/software/bison/manual/html_node/Shift_002fReduce.html)
- [racc documentation](https://ruby.github.io/racc/)
