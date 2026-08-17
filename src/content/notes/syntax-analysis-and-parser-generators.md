---
title: 構文解析とパーサージェネレータ
created: 2026-08-17
updated: 2026-08-17
aliases: [syntax analysis, parser generator]
---

# 構文解析とパーサージェネレータ

文字列をプログラムとして解釈する処理は、いくつかの段階に分けて考えると見通しがよい。

```text
ソースコード
  ↓ 字句解析
トークン列
  ↓ 構文解析
構文木・意味値
  ↓ 意味解析 / 評価 / コード生成
プログラムの意味
```

パーサーは「トークン列が文法に従っているか」を判定し、必要ならASTや意味値を作る。パーサージェネレータは、パーサーを手書きする代わりに、文法ファイルからパーサーの実装を生成する道具である。

このノートでは、Ruby製のLRパーサージェネレータ [Ibex](https://github.com/ydah/ibex) を参照しながら、特定の実装に依存しない要素を整理する。Ibex専用の使い方や実装詳細は別ノートに切り出す。関連: [[moc|MOC]]

## 字句解析と構文解析

字句解析（lexer）は、文字の並びをトークンへ変換する。

```text
2 + 3 * 4
↓
NUM(2) '+' NUM(3) '*' NUM(4) EOF
```

字句解析が担当するのは、例えば次のような処理である。

- 数字の列を `NUM` とその値に変換する
- 識別子を `IDENTIFIER` に変換する
- 文字列リテラルやコメントを認識する
- 空白やコメントを読み飛ばす
- 現在の入力位置、行番号、列番号を記録する

構文解析（parser）は、通常は文字ではなく、このトークン列を入力にする。つまり、字句解析は「どの単語か」を決め、構文解析は「単語がどのように組み合わさっているか」を決める。

## 文法の基本要素

文法は、終端記号・非終端記号・生成規則からなる。

```text
expression : expression '+' term
           | term

term       : NUM
```

- `NUM` や `'+'` は終端記号（terminal）。入力トークンに対応する。
- `expression` や `term` は非終端記号（nonterminal）。文法上のまとまりを表す。
- `expression : expression '+' term` は生成規則（production）。
- `|` は複数の選択肢を表す。
- 規則の左辺を右辺へ展開する操作を導出という。

文法を読むときは、まず「どの記号が入力に直接現れるか」と「どの記号が構造を表すか」を分けるとよい。

## 意味作用とAST

構文を認識するだけなら、受理できたかどうかだけを返せばよい。実用的なパーサーは、reduceのタイミングで意味作用（semantic action）を実行し、値やASTを組み立てる。

```text
expression : expression '+' term {
  result = val[0] + val[2]
}
```

`val[0]`と`val[2]`は、右辺の`expression`と`term`が持っていた意味値である。reduce後の`result`が、左辺の`expression`の意味値になる。

例えば`2 + 3`を評価するなら、最終的な意味値は`5`になる。コンパイラなら、値そのものではなく次のようなASTを作る。

```text
Add
├── Number(2)
└── Number(3)
```

## LRパーサーの動作

LRは、入力を左から右（Left-to-Right）に読み、右端導出を逆向きに構築する（Rightmost derivation in reverse）方式である。

LRパーサーは、状態スタックと意味値スタックを持ち、パーサーテーブルを参照して次の操作を選ぶ。

- **shift** — 次のトークンをスタックに積み、次の状態へ進む
- **reduce** — 生成規則の右辺をスタックから取り除き、左辺の非終端記号へまとめる
- **goto** — reduce後の非終端記号に対応する状態へ遷移する
- **accept** —入力全体を正しく読み終えた
- **error** —その状態でそのトークンを処理できない

例えば、入力が`NUM + NUM`で、`term : NUM`という規則がある場合、最初の`NUM`をshiftした後、`term : NUM`へreduceする。その後、`expression : term`のような規則を使って、より大きな構造へreduceしていく。

## LRアイテムとオートマトン

パーサージェネレータは、文法から状態機械（LRオートマトン）を構築する。LRアイテムは、生成規則をどこまで読んだかを表す。

```text
expression → expression · '+' term
```

`·`は現在の読み取り位置である。

- `·`の後ろが終端記号なら、そのトークンをshiftできる
- `·`の後ろが非終端記号なら、その非終端記号の規則をclosureで追加する
- `·`が右端に到達したら、その規則をreduceできる

`closure`は、現在の状態から必要になる規則を展開する操作。`goto`は、ある記号を読み取った後の次の状態を作る操作である。この`closure`と`goto`を繰り返して、状態集合と状態間の遷移を作る。

## shift/reduce conflict

ある状態で、同じ先読みトークンに対してshiftとreduceの両方が可能になることがある。これがshift/reduce conflictである。

典型例は演算子の優先順位である。

```text
2 + 3 * 4
```

`+`を先にreduceすると`(2 + 3) * 4`になり、`*`を先にshiftすると`2 + (3 * 4)`になる。文法だけでは判断できない場合、次のような優先順位宣言を使う。

```text
preclow
  left '+'
  left '*'
prechigh
```

多くのパーサージェネレータでは、宣言された優先順位と結合規則を使ってconflictを解決する。conflictを黙って解消するのではなく、どの規則が競合し、どの宣言で解決されたかを診断できることが重要である。

## SLR・LALR・LR(1)

LR系の方式は、reduceする条件としてどれだけ正確な先読み文脈を持つかで違いが出る。

| 方式 | 考え方 | 傾向 |
| --- | --- | --- |
| SLR | 非終端記号のFOLLOW集合をreduce条件に使う | 実装しやすいが、文脈を粗く扱う |
| LALR | 同じLR(0)コアを持つLR(1)状態をマージする | 状態数を抑えやすいが、マージでconflictが増えることがある |
| Canonical LR(1) | 状態ごとに個別のlookaheadを保持する | 精度は高いが、状態数が増えやすい |
| IELR | LALRに近い共有を保ちつつ、必要な文脈を失わないよう状態を分割する | 構築が複雑。実装ごとに採用範囲や保証を確認する必要がある |

「LR(1)のほうが常に優れている」という話ではない。状態数、生成時間、診断の安定性、解決できる文法の範囲のトレードオフで方式を選ぶ。

## パーサージェネレータの処理パイプライン

実装上は、文法を直接パーサーコードへ変換するのではなく、途中表現を持つことが多い。

```text
grammar.y
  ↓ frontend lexer / parser
文法AST
  ↓ resolver / normalizer
Grammar IR
  ↓ SLR / LALR / LR(1) / IELR builder
Automaton IR
  ↓ table generator
action / goto table
  ↓ code generator
generated parser + runtime
```

途中表現を分けると、次の利点がある。

- 文法ファイルの構文と、文法の意味を分離できる
- EBNFやinline ruleを通常の生成規則へ変換できる
- 複数のLRアルゴリズムで共通の下流処理を使える
- オートマトンやテーブルを検査・可視化・シリアライズできる
- 生成コードを実行せずに、文法やconflictを静的に診断できる

IbexはGrammar IRとAutomaton IRを分け、各段階を独立して検証・再利用できる構成を採っている。[アーキテクチャの説明](https://github.com/ydah/ibex/blob/main/docs/concepts/architecture.md)

## ASTとCST

AST（抽象構文木）は、意味に必要な構造を残して、括弧・空白・コメントなどの表現上の情報を落とす。

```text
2 + 3
↓
Add(Number(2), Number(3))
```

CST（具象構文木）は、入力に現れた構文をより忠実に残す。

- 空白やコメントを保持できる
- 括弧や区切り文字を保持できる
- 不完全な入力や構文エラー部分を表現できる
- formatter、LSP、IDE編集に使いやすい

ASTは評価・最適化・コード生成向き、CSTは編集・再フォーマット・診断向きである。パーサーがASTだけを作るのか、CSTも提供するのかは、後段のツール設計に大きく影響する。

## エラー診断と実行境界

実用的なパーサージェネレータは、単に「syntax error」と出すだけでは足りない。

- エラー位置のbyte offset、行、列
- 現在の状態で期待されるトークン
- 実際に見つかったトークン
- エラーになった生成規則や入力範囲
- 回復を試みた場合の修復内容

を、機械可読な形式でも保持できると、CLI・LSP・エディタで同じ診断を再利用できる。

また、`syntax-only`という名前でも、必ずしも一切のRubyコードが実行されないとは限らない。パーサーの意味作用を抑止していても、生成lexerのアクションや生成ファイルのロード時にユーザーコードが実行される設計はあり得る。静的解析と、生成パーサーを実行するruntimeの信頼境界を分けて考える必要がある。

## 次に掘る候補

- LR(0)アイテムのclosureとgotoを、実際の小さな文法で計算する
- `NUM + NUM`をshift/reduceしながらスタックを追跡する
- LALRが状態をマージする理由と、マージでconflictが増える例を見る
- EBNFの`*`や`+`を通常の生成規則へloweringする方法を調べる
- ASTとCSTを同じ入力から作った場合の違いを比較する
- parser tableを実際に読むruntimeの実装を見る

まずはLR(0)アイテムの`closure`と`goto`を手で計算すると、パーサージェネレータの内部がかなり見通しやすくなる。

## 出典

- [Ibex README](https://github.com/ydah/ibex/blob/main/README.md)
- [IbexのアーキテクチャとIR](https://github.com/ydah/ibex/blob/main/docs/concepts/architecture.md)
- [Ibexの文法リファレンス](https://github.com/ydah/ibex/blob/main/docs/grammar-reference.md)
- [IbexのIELR構築](https://github.com/ydah/ibex/blob/main/docs/concepts/ielr.md)

#compiler #parser #parser-generator #syntax-analysis #lr #zettelkasten #日本語
