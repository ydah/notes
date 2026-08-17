---
created: 2026-08-17 21:20
updated: 2026-08-17 21:20
---
# パーサージェネレータ

文法ファイルからパーサーのコードを生成するツール。文法を読み、入力を読んで、文法に合っているか調べるプログラムを生成する。 #parser #compiler #lr

## 字句解析と構文解析

構文解析の前に字句解析がある。例えば `2 + 3` は、まず `NUM(2)`、`'+'`、`NUM(3)` のようなトークン列になる。そのトークン列を文法に沿って組み立てるのが構文解析。

```text
ソースコード -> lexer -> token列 -> parser -> AST
```

字句解析と構文解析を別々にすることで、空白やコメントの扱いと、文法上の構造を扱う処理を分けられる。

## LRパーサー

LRパーサーは入力を左から右に読みながら、右端導出を逆向きに実行する。状態スタックとパーサーテーブルを持っていて、テーブルを見ながら `shift` / `reduce` / `goto` / `accept` を実行する。

```text
expression : expression '+' term
           | term

term       : NUM
```

`NUM` や `'+'` が終端記号、`expression` や `term` が非終端記号。`expression : ...` が生成規則。

`term : NUM` をreduceすると、スタック上の `NUM` が `term` になる。入力を少しずつ大きな構造へ畳み込んでいく。

## shift/reduce conflict

```text
2 + 3 * 4
```

`+`のところで先にreduceするのか、`*`をshiftして後でreduceするのか、という選択が必要になる。演算子の優先順位を文法に書いて解決する。

```text
%left '+'
%left '*'
```

パーサージェネレータごとに優先順位宣言の記法は違うが、考え方は同じ。文法を書いたのにconflictが出る、という話はだいたいこの周辺にある。

## SLR / LALR / LR(1)

LR系のパーサーテーブルを作るアルゴリズムがいくつかある。

- SLR: FOLLOW集合を使ってreduceする。単純だが文脈を粗く扱う
- LALR: 同じLR(0)コアを持つ状態をまとめる。状態数を抑えやすい
- Canonical LR(1): lookaheadを状態ごとに持つ。精密だが状態数が増えやすい
- IELR: LALRの状態数とLR(1)の精度を両立しようとするもの

このへんは名前を知っているだけで、実際にLR(0)アイテムの `closure` と `goto` を計算したことはない。手で小さい文法の状態を作ってみたい。

## パーサージェネレータの内部

文法をいきなり実行コードへ変換せず、中間表現を挟む構成が多い。

```text
grammar
  -> grammar IR
  -> automaton
  -> parser table
  -> generated parser
```

Grammar IRとAutomaton IRを分けておくと、文法の正規化・オートマトンの検査・テーブルの可視化・複数アルゴリズムの比較がやりやすそう。

## ASTとCST

ASTは意味に必要な構造だけを残した木。

```text
2 + 3 -> Add(Number(2), Number(3))
```

CSTは空白・コメント・括弧など、入力の構文をもっとそのまま残す木。評価やコード生成だけならASTで足りることが多い。formatterやLSP、エディタを作る場合はCSTを残す意味が大きい。

## 気になっていること

- `closure` / `goto`からLRオートマトンをどう作るか
- LALRで状態をマージすると、なぜconflictが増えるのか
- parser tableの実体はどんなデータ構造か
- EBNFの`*`や`+`を通常の生成規則へどう変換するか
- ASTとCSTの両方を生成するとき、意味作用はどこで実行するか

まずは `closure` と `goto` を手で計算するところからやる。

## 出典

- [The Bison Parser Algorithm](https://www.gnu.org/software/bison/manual/html_node/Algorithm.html)
- [Shift/Reduce Conflicts](https://www.gnu.org/software/bison/manual/html_node/Shift_002fReduce.html)
- [How Precedence Works](https://www.gnu.org/software/bison/manual/html_node/How-Precedence.html)
- [racc documentation](https://ruby.github.io/racc/)
