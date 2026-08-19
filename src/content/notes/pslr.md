---
created: 2026-08-18
updated: 2026-08-18
---

# PSLR

#parser #compiler #lr #lexer #ruby

PSLR(1)はPseudo-Scannerless Minimal LR(1)の略。字句解析器がparserの状態を考慮してtokenを認識する、LR(1) parser generation system。単独の構文解析アルゴリズムというより、LR parserと[[pseudo-scanner|pseudo-scanner]]を組み合わせた方式。

## 字句解析器と構文解析器の境界

通常は、字句解析器と構文解析器を次のように分離する。

~~~text
ソースコード
    ↓
字句解析器
    ↓ token
LRパーサー
~~~

字句解析器は文字列をtoken列へ変換し、構文解析器はtoken列を文法に従って処理する。しかし、同じ文字列が構文上の位置によって別のtokenになり得る言語では、字句解析器だけでtokenの種類を決められない。

Rubyの「<」「<<」「<<-」や、範囲構文の後に続く「||」のような構文では、これまでに読んだ文字だけでなく、parserが現在どの状態にいるかがtokenizeの判断に影響する。CRubyではこの情報をlex_stateなどでlexerへ伝えてきた。

## [[pseudo-scanner|pseudo-scanner]]

PSLRでは、字句解析器を完全に独立させず、現在のparser stateで受理候補になるtoken集合を字句解析器の判断に使う。

~~~text
parser state
    ↓
現在受理できるtoken集合
    ↓
pseudo-scanner
    ↓
token
~~~

lexerがtokenを返す前に、概念的には次のような問い合わせを行う。

~~~text
「このtokenを返した場合、現在のparser stateで受理できるか？」
~~~

parserが受理できるtokenだけをpseudo-scannerが認識するため、lexer側にparserの状態を手動で反映する分岐を減らせる。scannerless parserではlexerを文法へ統合するが、PSLRではscanner自体は残る。そのためpseudo-scannerlessと呼ばれる。

## scanner conflict

複数の言語や文法を組み合わせた[[composite-language|composite language]]では、文字列をtokenへ分割する方法が複数あり、lexerだけではどの分割が正しいか決められないことがある。これが[[scanner-conflict|scanner conflict]]になる。

PSLRでは、現在のLR stateで受理できるtokenをparser tableから求め、その情報でscannerの候補を絞る。parserの文脈を利用できるため、言語を構成する各部分のscanner規則を手作業で調整する必要を減らせる。

## LALR・IELRとの関係

PSLRの[[minimal-lr-parser|Minimal LR(1)]]は、Canonical LR(1)の認識能力を保ちながら、parser tableを小さくすることを目指す。

- Canonical LR(1) — 状態を細かく区別できるが、状態数と表が大きい
- LALR(1) — 同じLR(0) coreを持つ状態をマージして表を小さくするが、parser stateの文脈を失うことがある
- IELR(1) — 必要な状態だけを分割し、LALRに近いサイズでCanonical LR(1)の認識能力を保つ
- PSLR(1) — IELR系のLR parser tableとpseudo-scannerを組み合わせる

PSLRでは、LR parser tableの状態をマージした結果、pseudo-scannerが誤ったtokenを受理したり、新しい[[scanner-conflict|scanner conflict]]が発生したりする問題がある。PSLRの原論文では、この問題を解くために[[ielr|IELR]](1)を拡張して[[minimal-lr-parser|Minimal LR(1)]] tableを生成する。

## LramaとRuby parser

LramaのREADMEは、LramaをRubyで書かれたLALR(1) parser generatorと説明している。RubyKaigi 2024の発表では、IELRの実装をPSLR parser生成の前提とし、その先にPSLR対応とlex_stateの整理を置いていた。

PSLRはLramaのLALRを単純に置き換える名前ではない。LALRより細かいparser stateの区別が必要で、そこにparser stateを使うpseudo-scannerを組み合わせるため、IELRが橋渡しになる。

[[lrama|Lrama]]、[[ielr|IELR]]、[[lexical-analyzer|字句解析機]]はそれぞれ別のノートで扱っている。IELRの内部計算で使う[[goto-follow-closures|goto-follow closures]]と[[lane-annotations|lane annotations]]も別に整理した。

## 出典

- [PSLR(1): Pseudo-Scannerless Minimal LR(1) for the Deterministic Parsing of Composite Languages](https://open.clemson.edu/all_dissertations/519/)
- [From LALR to IELR: A Lrama's Next Step](https://speakerdeck.com/junk0612/from-lalr-to-ielr-a-lramas-next-step)
- [Lrama](https://github.com/ruby/lrama)
