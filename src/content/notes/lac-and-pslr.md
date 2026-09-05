# LACとPSLRの関係

#parser #compiler #lr #pslr #lac #syntax-error #lrama

[[lookahead-correction|LAC]]は[[pslr|PSLR]]のコア機構ではない。PSLRはLACなしでも成立し、正しい入力に対する言語認識能力や[[pseudo-scanner]]のtoken選択は変わらない。LACは、不正な入力に対するエラー検出・診断・回復の品質を高める。

PSLRの原論文も、LACが扱う問題と修正はtraditional scanner-based LR(1) parserにも当てはまると述べている。PSLR研究とは「orthogonal to our PSLR(1) work」であり、同じ研究から生まれたものの、解く問題は直交する。

## LACがもたらさないもの

PSLRのtoken選択は、parser stateごとに生成される静的な受理可能token集合 $acc(s_p)$、lexical precedence、lexical tieによって決まる。実行時のLACを使って $acc(s_p)$ を求めるわけではない。

構文的に正しい入力で[[canonical-lr-parser|Canonical LR(1)]]と同じparser actionを実行する保証は、[[ielr|IELR(1)]]とPSLR向けIELR拡張が担う。LACを加えても、PSLRが認識できる正しい入力やpseudo-scannerが選ぶtokenは増えない。

| 機構 | 主な責務 | 動作する時点 |
| --- | --- | --- |
| [[pseudo-scanner]] | parser stateから受理可能なtokenを絞り、字句的な曖昧さを解く | tokenを選ぶとき |
| PSLR向け[[ielr]]拡張 | state mergingによってpseudo-scannerの受理集合が壊れることを防ぐ | parser table生成時 |
| [[lookahead-correction]] | lookahead tokenを本当に受理できるか探索する | parser実行時、とくにエラー判定時 |

~~~mermaid
flowchart LR
    I[入力文字列] --> P[PSLRのpseudo-scanner]
    S[parser stateとacc] --> P
    P --> T[token]
    T --> R[LR parser]
    R -. 不正入力時の先行検査 .-> L[LAC]
~~~

## LACがもたらすもの

現在のstateでは受理できるように見えるtokenを、実際のparser stackでは受理できない場合がある。原因は[[default-reduction|default reduction]]、LR state merging、[[nonassoc|%nonassoc]]による明示的なerror actionである。parserはエラーを確定する前にReduceを進め、expected token listを誤る可能性がある。

LACはlookaheadを受け取ると通常の解析を一時停止し、一時stack上で[[exploratory-parse|exploratory parse]]を行う。探索中はscanner、I/O、[[semantic-action|semantic action]]を実行しない。Shiftへ到達すれば通常の解析へ戻る。Errorへ到達すれば構文エラーを報告する。

PSLRに対する効果は次の四つ。

1. 不要なReduceの抑制と早期エラー検出 — 不正なlookaheadに基づくReduceを、エラー確定前に実行しにくくする。これに伴うsemantic actionも実行しにくくする。
2. 正確なexpected token list — 各tokenについてexploratory parseを行う。これにより、受理不能tokenの混入と受理可能tokenの欠落を防ぐ。
3. error recoveryの起点の健全化 — parser stackが別の構文文脈へ進む前にエラーを確定する。[[error-recovery|error recovery]]を適切なcontextから開始できる。
4. 不正入力まで含めたCanonical LRとの同等性 — default reductionの方針を固定する。この条件下では、LAC付きIELRとLAC付きCanonical LRが正しい入力と不正な入力の両方でほぼ同じparser actionを実行する。

三点目はPSLRで特に重要である。error recovery後もpseudo-scannerは現在のparser stateと $acc(s_p)$ を使ってtokenを選ぶ。回復の起点がずれると、その後の字句解析にも影響する。

| 観点 | LACなし | LACあり |
| --- | --- | --- |
| 正しい入力の解析 | Canonical LRと同じ | 変化しない |
| エラー検出 | 不要なReduce後まで遅れることがある | lookahead取得時に先行検査する |
| semantic action | エラー確定前に実行されることがある | exploratory parse中は実行しない |
| expected token list | tokenの混入・欠落があり得る | parser stackに対して検証する |
| Canonical LRとの比較 | 保証の中心は正しい入力 | 不正な入力までほぼ同じ振る舞い |

「即時検出」には限界がある。consistent stateでdefault reductionが有効な間は、parserがlookaheadを要求せず、LACも開始されない。LACが補正するのは、lookaheadを取得した時点以降の解析である。

実行時にはparser actionの一部を二度行うためコストが増える。ただしexploratory parseではscanner、I/O、semantic actionを実行せず、通常stackも物理的に複製しない。GNU Bisonは、実用的な文法での性能ペナルティは経験上小さいと報告している。

## LACとPSLRの歴史

LACは2010年のPSLR研究で生まれ、2011年にGNU Bisonの独立機能になった。Scannerless NSLR(1)（1989年）、Scannerless GLR（1997年）、context-aware scanning（2007年）は前史にあたる。いずれもscannerとparserの境界を見直す研究であり、LACそのものではない。

| 年 | 出来事 | LACとの関係 |
| --- | --- | --- |
| 1989 | SalomonらがScannerless NSLR(1)を発表 | scannerless parsingの前史 |
| 1991 | Jerzy NawrockiがLCとELCによるlexical conflictの解消を提案 | LCはleft contextの略で、Lookahead Correctionとは別物 |
| 1997 | Eelco VisserがScannerless GLRを発表 | 非決定的なscannerless parsingの系譜 |
| 2007 | Van WykとSchwerdfegerがcontext-aware scanningを発表 | parser stateからscannerへvalid lookahead setを渡す発想を発展させた |
| 2008 | DennyとMalloyがIELR(1)を発表 | 後のPSLRで使うMinimal LR(1)の基盤 |
| 2010 | Dennyの博士論文がPSLR(1)を提案し、構文エラー処理の補正としてLACを導入 | LACがPSLR研究の中で誕生 |
| 2011 | GNU Bison 2.5がIELR、Canonical LR、LACを導入 | LACが汎用LR parserの独立機能として切り出された |
| 2025 | Lrama 0.7.0がIELR parser生成を実験的に導入 | PSLRへ向かうtable生成側の基盤が入った |
| 2025–2026 | Lrama 0.7.1でIELRを実用向けに高速化。0.8系でもREADMEは `b4_lac_if` を常にfalseとしている | IELRとLACが独立に実装できる現在の例 |

「LACが先に存在し、PSLRが利用した」という理解は逆である。LACはPSLR研究の副産物として考案され、その汎用性からBisonへ単体で移植された。Denny自身が直交性を明言している。BisonがPSLRなしでLACを運用してきた事実は、逆方向の「LACなしでPSLRのコアを実装する」構成が成立する傍証にもなる。

## Lramaへの含意

第一段階のPSLR実装はLACなしでも成立する。pseudo-scanner、scanner accepts table、PSLR向けIELR拡張を実装すれば、構文文脈による字句解析を切り替えられる。

生成側では、$acc(s_p)$ をdefault reduction最適化でlookahead情報を削除する前のaction情報から構成する必要がある。runtime側のLACを省くことと、scanner accepts tableを不正確にしてよいことは別問題である。

LACを省く判断は「不要」ではなく、「不正入力時の品質を後回しにする」ことを意味する。CRubyの `parse.y` は複数の `%nonassoc` を使い、Lrama自身もerror toleranceを主要目標に掲げている。LACはBisonの `%define parse.lac full` と同じく、後付け可能な独立runtime optionとして位置づけるのがよい。

## 出典

- [PSLR(1): Pseudo-Scannerless Minimal LR(1) for the Deterministic Parsing of Composite Languages](https://open.clemson.edu/all_dissertations/519/)
- [PSLR博士論文本文](https://malloy.people.clemson.edu/publications/papers/jdenny/jdenny.pdf)
- [GNU Bison Manual: LAC](https://www.gnu.org/software/bison/manual/html_node/LAC.html)
- [GNU Bison 2.5 released](https://lists.gnu.org/archive/html/help-bison/2011-05/msg00007.html)
- [Scannerless NSLR(1) Parsing of Programming Languages](https://doi.org/10.1145/73141.74833)
- [Jerzy R. Nawrocki: Conflict Detection and Resolution in a Lexical Analyzer Generator](https://dblp.org/rec/journals/ipl/Nawrocki91)
- [Scannerless Generalized-LR Parsing](https://eelcovisser.org/publications/1997/Visser97-SGLR.pdf)
- [Context-Aware Scanning for Parsing Extensible Languages](https://www-users.cse.umn.edu/~evw/pubs/vanwyk07gpce/vanwyk07gpce.pdf)
- [IELR(1) parser tables](https://malloy.people.clemson.edu/publications/papers/sac08/paper.pdf)
- [Lrama README](https://github.com/ruby/lrama/blob/master/README.md)
- [Lrama NEWS](https://github.com/ruby/lrama/blob/master/NEWS.md)
- [CRuby parse.y](https://github.com/ruby/ruby/blob/master/parse.y#L2874-L2887)
