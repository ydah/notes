# LACとPSLRの関係

#parser #compiler #lr #pslr #lac #syntax-error #lrama

[[lookahead-correction|LAC]]は[[pslr|PSLR]]のコア機構ではない。PSLRはLACなしでも成立し、正しい入力に対する言語認識能力や[[pseudo-scanner]]のtoken選択は変わらない。LACがPSLRにもたらすのは、主に**不正な入力に対するエラー検出・診断・回復の品質**である。

PSLRの原論文も、LACが扱う問題と修正はtraditional scanner-based LR(1) parserにも当てはまり、PSLR研究とは「orthogonal to our PSLR(1) work」だと明記している。同じ研究から生まれたが、解いている問題は直交している。

## LACがもたらさないもの

PSLRのtoken選択は、parser stateごとに生成される静的な受理可能token集合 $acc(s_p)$、lexical precedence、lexical tieによって決まる。実行時のLACを使って $acc(s_p)$ を求めるわけではない。

また、構文的に正しい入力で[[canonical-lr-parser|Canonical LR(1)]]と同じparser actionを実行するという保証は、[[ielr|IELR(1)]]とPSLR向けIELR拡張が担う。LACを加えても、PSLRが認識できる正しい入力やpseudo-scannerが選ぶtokenが増えるわけではない。

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

[[default-reduction|default reduction]]、LR state merging、[[nonassoc|%nonassoc]]による明示的なerror actionがあると、現在のstateだけを見て受理できるように見えるtokenが、実際のparser stackでは受理できない場合がある。parserはエラーを確定する前にReduceを進め、expected token listを誤る可能性がある。

LACはlookaheadを受け取ると通常の解析を一時停止し、一時stack上で[[exploratory-parse|exploratory parse]]を行う。探索中はscanner、I/O、[[semantic-action|semantic action]]を実行しない。Shiftへ到達すれば通常の解析へ戻り、Errorへ到達すれば構文エラーを報告する。

これによって、PSLRには次の四つがもたらされる。

1. **不要なReduceの抑制と早期エラー検出** — 不正なlookaheadに基づくReduceとsemantic actionを、エラー確定前に実行しにくくする。
2. **正確なexpected token list** — 各tokenについてexploratory parseを行い、受理不能tokenの混入と受理可能tokenの欠落を防ぐ。
3. **error recoveryの起点の健全化** — parser stackが別の構文文脈へ進む前にエラーを確定し、[[error-recovery|error recovery]]を適切なcontextから開始する。
4. **不正入力まで含めたCanonical LRとの同等性** — default reductionの方針を固定したとき、LAC付きIELRは正しい入力と不正な入力の両方で、LAC付きCanonical LRとほぼ同じparser actionを実行する。

三点目はPSLRでは特に重要になる。error recovery後もpseudo-scannerは現在のparser stateと $acc(s_p)$ を使ってtokenを選ぶため、回復の起点がずれると、その後の字句解析にも影響が波及する。

| 観点 | LACなし | LACあり |
| --- | --- | --- |
| 正しい入力の解析 | Canonical LRと同じ | 変化しない |
| エラー検出 | 不要なReduce後まで遅れることがある | lookahead取得時に先行検査する |
| semantic action | エラー確定前に実行されることがある | exploratory parse中は実行しない |
| expected token list | tokenの混入・欠落があり得る | parser stackに対して検証する |
| Canonical LRとの比較 | 保証の中心は正しい入力 | 不正な入力までほぼ同じ振る舞い |

ただし「即時検出」には限界がある。consistent stateでdefault reductionが有効な間は、parserがlookaheadを要求しないためLACも開始されない。LACが補正するのは、lookaheadを取得した時点から後の解析である。

実行時にはparser actionの一部を二度行うためコストが増える。一方、exploratory parseではscanner、I/O、semantic actionを実行せず、通常stackも物理的に複製しない。GNU Bisonは、実用的な文法での性能ペナルティは経験上小さいと報告している。

## LACとPSLRの歴史

LACの前史とLACそのものの歴史は分けて考える必要がある。1989年のScannerless NSLR(1)、1997年のScannerless GLR、2007年のcontext-aware scanningは、scannerとparserの境界を見直す系譜であり、LACそのものではない。

| 年 | 出来事 | LACとの関係 |
| --- | --- | --- |
| 1989 | SalomonらがScannerless NSLR(1)を発表 | scannerless parsingの前史 |
| 1991 | Jerzy NawrockiがLCとELCによるlexical conflictの解消を提案 | LCはleft contextの略で、Lookahead Correctionとは別物 |
| 1997 | Eelco VisserがScannerless GLRを発表 | 非決定的なscannerless parsingの系譜 |
| 2007 | Van WykとSchwerdfegerがcontext-aware scanningを発表 | parser stateからscannerへvalid lookahead setを渡す発想を発展させた |
| 2008 | DennyとMalloyがIELR(1)を発表 | 後のPSLRで使うMinimal LR(1)の基盤 |
| 2010 | Dennyの博士論文がPSLR(1)を提案し、構文エラー処理の補正としてLACを導入 | **LACがPSLR研究の中で誕生** |
| 2011 | GNU Bison 2.5がIELR、Canonical LR、LACを導入 | LACが汎用LR parserの独立機能として切り出された |
| 2025 | Lrama 0.7.0がIELR parser生成を実験的に導入 | PSLRへ向かうtable生成側の基盤が入った |
| 2025–2026 | Lrama 0.7.1でIELRを実用向けに高速化。0.8系でもREADMEは `b4_lac_if` を常にfalseとしている | IELRとLACが独立に実装できる現在の例 |

したがって、「LACが先に存在し、PSLRが利用した」という理解は逆である。LACはPSLR研究の副産物として考案され、その汎用性からBisonへ単体で輸出された。Denny自身が直交性を明言し、BisonがPSLRなしでLACを運用してきた事実は、逆方向の「LACなしでPSLRのコアを実装する」構成も成立することの傍証になる。

## Lramaへの含意

第一段階のPSLR実装からLACを外すのは合理的である。まずpseudo-scanner、scanner accepts table、PSLR向けIELR拡張を実装すれば、構文文脈による字句解析の切り替えは成立する。

生成側では、$acc(s_p)$ をdefault reduction最適化でlookahead情報を削除する前のaction情報から構成する必要がある。runtime側のLACを省くことと、scanner accepts tableを不正確にしてよいことは別問題である。

一方、LACを省く判断は「不要」ではなく「不正入力時の品質を後回しにする」という意味になる。CRubyの `parse.y` は複数の `%nonassoc` を使い、Lrama自身もerror toleranceを主要目標に掲げている。LACはBisonの `%define parse.lac full` と同じような、後付け可能な独立runtime optionとして位置づけるのがよい。

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
