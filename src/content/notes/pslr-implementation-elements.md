# PSLR実装の全体像

#parser #compiler #lr #pslr #lexer #lrama

[[pslr|PSLR(1)]]の実装は、単に[[pseudo-scanner]]を追加するだけでは完結しない。論文準拠のシステムには、字句規則を記述する仕様言語、scanner tableを作る生成系、parser stateを受け取るruntime、state mergingを制約する[[ielr|IELR]]拡張、エラー処理、検証が必要になる。

実装上もっとも重要なのは、次の依存関係である。

> tiesとlayoutを反映した $acc(s_p)$ をdefault reductionより前に作り、その情報をscanner conflictの解決とIELR state compatibilityの両方へ渡す。

この順序を崩すと、後段の `scanner_accepts` とstate splittingが不正確になる。

## 全要素

| # | 要素 | 層 | 位置づけ | 必要な理由 |
| --- | --- | --- | --- | --- |
| 1 | `%token-re`、literal token、`{NAME}`参照 | 仕様 | コア | parserとscannerを同じ仕様から生成する入力になる |
| 2 | `%lex-prec`と7種類の演算子、既定のlongest match | 仕様 | コア | parser contextだけでは消えないidentity・length conflictを宣言的に解決する |
| 3 | `%lex-tie`、`%lex-no-tie`、tie候補レポート | 仕様・生成 | Rubyではコア | keywordをidentifierとして誤認識する問題を防ぐ |
| 4 | `YYLAYOUT` token | 仕様・実行 | 完全実装 | 空白やコメントを全productionへ書かずに認識・破棄する |
| 5 | `%token-action` | 仕様・実行 | 完全実装 | semantic valueと直前のlayout textを構築する |
| 6 | scanner FSA $\Sigma_s$ | 生成 | コア | 全tokenの正規表現を一つのDFAとして走査する |
| 7 | $acc(s_p)$ | 生成 | コア | parser stateを字句的な左文脈として表す |
| 8 | `scanner_accepts`と`state_to_accepting_state` | 生成 | コア | 受理可能性とidentity conflictの解決を表引きへ静的化する |
| 9 | `length_precedences` | 生成 | コア | longest、shortest、token優先をruntimeの真偽表へ落とす |
| 10 | scanner conflict resolverとレポート | 生成 | コア | conflictを有限に分類し、未解決・無効な宣言を黙って握りつぶさない |
| 11 | IELR(1)本体 | 生成 | コア | Canonical LRの認識能力を実用的なstate数で得る |
| 12 | IELR state compatibilityのPSLR拡張 | 生成 | **最重要の追加部分** | parser actionが同じでもscanner結果を変えるstate mergeを禁止する |
| 13 | fallback行とcharacter token | 生成・実行 | エラー処理 | 現在のstateでmatchがなくても決定的にtokenを返す |
| 14 | `pseudo_scan` runtime | 実行 | コア | parser stateとscanner FSAを使って最終tokenを選ぶ |
| 15 | [[lookahead-correction|LAC]] | 実行 | 独立した推奨機能 | 不正入力時の検出・診断・回復を補正する |
| 16 | Canonical LR(1) mode | 生成 | 任意 | IELR・PSLRの比較とdebugに使う |
| 17 | 挙動等価性テスト | 検証 | 強く推奨 | scanner由来の間接的な退行を既存parserとの差分で検出する |
| 18 | lexical nonterminalとscoped declaration | 仕様・生成・実行 | 将来構想 | 非正規な字句構造とsub-languageごとの規則を扱う |

## 依存関係

~~~mermaid
flowchart TD
    A[統合仕様<br/>token regex・lex-prec・lex-tie・layout] --> B[scanner FSA]
    A --> C[parser states]
    C --> D[acc]
    A --> D
    B --> E[conflict profileとresolver]
    D --> E
    E --> F[PSLR向けIELR compatibility]
    C --> F
    F --> G[最終parser states]
    G --> H[scanner_accepts]
    E --> H
    E --> I[length_precedences]
    B --> J[pseudo_scan runtime]
    H --> J
    I --> J
    J --> K[token]
    J -. matchなし .-> L[fallback行・character token]
    K -. 不正入力 .-> M[LAC]
~~~

## A. 仕様言語

### tokenの正規表現

論文の `%token-re NAME (regex)` は、parser grammarとscanner specificationを一つのファイルへ統合する入口である。literal tokenと名前付き正規表現参照もここに含まれる。これがない場合、pseudo-scannerを自動生成するための字句仕様が存在しない。

### lexical precedence

`%lex-prec`は[[scanner-conflict|scanner conflict]]を宣言的に解決する。論文はidentity precedence、longest・shortest match、長さに関係しないtoken precedenceを組み合わせた7種類の演算子を定義する。同じtoken内のautolength conflictは、未指定ならlongest matchになる。

これはkeywordとidentifier、`0`とoctal literal、`>`と`>>`、複数行commentの終端などを、Lexの「規則順とlongest match」だけに依存せず表現するために必要になる。

### lexical tie

pseudo-scannerは通常、現在のstateで受理可能なtokenだけを候補にする。しかしreserved keywordが不可能でidentifierが可能な文脈では、`int`をidentifierとして返してしまう。`%lex-tie`は、このようなtoken群を同時に認識させ、正しいtokenを選んだうえでparserにsyntax errorを報告させる。

tieは $acc(s_p)$ を変え、新しいconflictも作り得る。そのためresolverより前に適用する。どの組をtieすべきかは言語設計に依存するので、generatorは片方だけが受理される競合対を候補として報告する必要がある。keywordと`tIDENTIFIER`が多数存在するRubyでは、初期段階から必要になる。

### layoutとtoken action

`YYLAYOUT`で始まるtokenは全stateの $acc(s_p)$ に加え、match後はparserへ返さず再scanする。空白とcommentをgrammarの全箇所へ挿入せずに扱える。layoutを加えると新しいconflictが生じるため、string literal内などではlexical precedenceによる抑制も必要になる。

`%token-action`は非layout tokenのsemantic valueを構築する。連続したlayout lexemeを蓄積し、次のtoken actionから参照できるようにすれば、commentやmagic commentを保存する処理系にも対応できる。

## B. 生成系

### scanner FSAと二つの表

scanner FSA $\Sigma_s$ は全token regexを合併したDFAであり、parser state別の判断は焼き込まない。FSAの受理状態に到達した後、次の表でtokenを決める。

- `scanner_accepts[parser_state][scanner_accepting_state]` — その組み合わせで返すtoken
- `state_to_accepting_state[scanner_state]` — FSA stateを圧縮した受理state indexへ変換
- `length_precedences[token][token]` — 新しいmatchで現在のbest matchを置き換えるか

identity conflictと受理可能性は `scanner_accepts`、match長の比較は `length_precedences` に分ける。これにより、複雑なprecedence関数をruntimeで再評価せず、表引きとして実行できる。

### $acc(s_p)$

$acc(s_p)$ の基礎は、そのparser stateでShiftできるtokenとReduce actionのlookahead集合である。そこへlexical tieとlayout tokenを反映する。

default reductionはlookahead集合をparser tableから削除する最適化なので、$acc(s_p)$ はその適用前に計算する。適用後のtableだけを見ると、どのtokenでReduceすべきだったかを復元できず、pseudo-scannerの文脈制約が失われる。

### resolver

同じ入力位置から生じるmatchは無限にあり得るため、resolverはscanner conflict profileとして有限のカテゴリへまとめる。scanner FSAをたどって各profileを見つけ、lexical precedenceで解決し、結果を表へ書き込む。

未解決conflict、tie候補、どのstateにも作用しないuseless declarationは生成時に報告する。暗黙の規則順で握りつぶすと、grammarの変更やlanguage compositionによってtokenizationが静かに変わるためである。

### IELRのPSLR拡張

通常のIELR compatibilityは、stateをmergeしてもparser actionがCanonical LR相当になるかを調べる。PSLRではさらに、merge後もpseudo-scannerが同じmatchを選ぶかを調べなければならない。

概念的にはstate $s_p$と$s'_p$について、任意の入力prefixで片方にmatchがないか、lexical precedence適用後の選択結果が同じ場合だけmergeできる。実装では無限の文字列を比較せず、scanner FSAから要約したpairwise conflictを用いる。

ここがPSLRで最も本質的な新規部分になる。通常のIELRだけではparser actionを守れても、$acc(s_p)$ のunionによってpseudo-scannerのtoken選択が変わる可能性が残る。

論文はさらに次の最適化を示す。

- merge-stabilityにより、merge後の全候補を毎回再評価しない
- complete conflictではなくpairwise conflictでcompatibilityを調べる
- unresolved conflictだけを理由に過剰なstate splitをしない
- 全stateに存在するlayout tokenをsplit-stableとしてannotation対象から外す

### エラー用fallback

現在stateの $acc(s_p)$ でmatchがない場合は、全token集合を対象にしたfallback行からtokenを選ぶ。それでもmatchしなければ、入力の先頭一文字をcharacter tokenとして返す。

~~~text
現在stateのscanner_accepts
    ↓ matchなし
fallback行
    ↓ matchなし
character token
~~~

何らかのtokenを決定的にparserへ渡すことで、字句エラーを別系統にせず、parserのsyntax error処理を開始できる。

## C. runtime

`pseudo_scan`はparserから現在stateを受け取り、入力を一文字ずつscanner FSAへ流す。受理stateへ着くたびに `scanner_accepts` を引き、`length_precedences`に従ってbest matchを更新する。遷移不能または入力末尾で停止し、best matchの終端まで入力を消費してtokenを返す。

matchを確定するまで入力位置を確定できないため、先読みした文字のbufferingまたは巻き戻しが必要になる。layout tokenならlexemeを蓄積してscanを再開し、通常tokenなら必要なtoken actionを実行する。エラー時はcurrent row、fallback row、character tokenの順に選ぶ。

LACはこのコアとは独立している。state merging、default reduction、`%nonassoc`が起こす不正入力時の余分なReduce、semantic action、expected token listの誤りを補正するが、正しい入力に対するPSLRの成立条件ではない。詳細は[[lac-and-pslr|LACとPSLRの関係]]で扱う。

## D. 検証

最も有効なのは、従来scanner版とPSLR版へ同じ入力を与えるdifferential testである。次を分けて比較する。

- 正しい入力で選ばれるtoken列とparser action
- 最初のsyntax error位置
- error recovery後のtoken選択
- expected token list
- LALR、IELR、Canonical LR間の差

PSLRの不具合は、state mergeの問題がscannerの別tokenとして現れるため原因が遠い。Lramaでは既存の`parse.y`とRuby test suiteを比較対象として再利用できる。

## E. 論文でも将来構想のもの

lexical nonterminalは、regular expressionだけでは扱いにくいnestedな字句構造を副parserで処理する構想である。scoped declarationは、sub-languageごとに異なるlexical precedenceやfallbackを局所化する構想である。いずれも論文時点では未実装であり、単一言語を対象にした最初のLrama実装から外せる。

## 実装順序

1. `%token-re`、lexical precedence、tie、layoutを表現できる内部modelを決める。
2. scanner FSA、$acc(s_p)$、conflict profile、resolverを作る。
3. `scanner_accepts`、`state_to_accepting_state`、`length_precedences`を生成する。
4. `pseudo_scan`とparser stateの受け渡しを実装する。
5. IELR compatibilityへpseudo-scannerの同等性判定を加える。
6. fallback行とcharacter tokenでエラー経路を統合する。
7. LACとCanonical LR modeを独立optionとして加える。

各段階で従来parserとの差分テストを残す。とくにtieとlayoutは $acc(s_p)$、resolver、IELR compatibilityの入力になるため、意味モデルを後付けしない。

## 出典

- [PSLR(1): Pseudo-Scannerless Minimal LR(1) for the Deterministic Parsing of Composite Languages](https://open.clemson.edu/all_dissertations/519/)
- [PSLR博士論文本文](https://malloy.people.clemson.edu/publications/papers/jdenny/jdenny.pdf)
- [The IELR(1) Algorithm for Generating Minimal LR(1) Parser Tables](https://malloy.people.clemson.edu/publications/papers/scp09/scp09.pdf)
- [GNU Bison Manual: LAC](https://www.gnu.org/software/bison/manual/html_node/LAC.html)
- [Lrama README](https://github.com/ruby/lrama)
- [Lrama NEWS](https://github.com/ruby/lrama/blob/master/NEWS.md)
- [Liberating Ruby's Parser from Lexer Hacks](https://speakerdeck.com/ydah/liberating-rubys-parser-from-lexer-hacks)
