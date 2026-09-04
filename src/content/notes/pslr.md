---
created: 2026-08-18
updated: 2026-08-18
---

# PSLR

#parser #compiler #lr #lexer #ruby

PSLR(1)はPseudo-Scannerless Minimal LR(1)の略。scannerとparserの仕様を一つにまとめ、決定的なLR(1) parserと[[pseudo-scanner]]を生成する方式である。

方式全体を貫く考え方は二つある。

> parser stateを字句解釈の文脈として使う。

> scanner conflictを暗黙に解決せず、検出・報告し、宣言によって解決する。

## 何を解決するのか

通常のLexとYaccの構成では、scannerが文字列をtoken列へ変換し、その後にparserがtoken列を処理する。

~~~text
ソースコード
    ↓
scanner
    ↓ token
LR parser
~~~

この分離は単純だが、同じ文字列が構文上の位置によって別tokenになる言語では、scannerだけでtokenを決められない。複数のsub-languageを含む[[composite-language|composite language]]、埋め込みDSL、C++のような複雑な字句規則では、scannerのstart conditionやad-hocなコードへparser contextを複製することになる。CRubyの`lex_state`も、この種の情報をlexerへ伝える仕組みである。

scannerless GLRはscannerをなくし、文字レベルの文法をGLRで処理する別の解決策を取る。PSLRはscanner自体を残しながら、**token候補の選択だけを現在のparser stateへ従属させる**。これにより、決定的LR parsingを保ったまま、手動で管理する字句状態を減らす。

## pseudo-scanner

PSLRの中心は[[pseudo-scanner]]である。parserはtokenを要求するとき、現在のparser state $s_p$ をpseudo-scannerへ渡す。

入力の残りを $\xi$、token集合 $T$ に対するmatch候補を $M(\xi,T)$ とする。また、state $s_p$ で受理できるtoken集合を $acc(s_p)$ とする。pseudo-scannerが調べる候補は次になる。

$$M(\xi, acc(s_p))$$

つまり、正規表現に一致するだけでは不十分で、現在の構文文脈でparserが受け取れるtokenだけが候補に残る。残った候補が複数なら、後述するlexical precedenceで一つを選ぶ。

$acc(s_p)$ はruntimeで探索して求めるものではない。parser生成時に、次の和集合としてstateごとに静的計算する。

- そのstateからShiftできるtoken
- そのstateのReduce actionのlookaheadに現れるtoken

LR stateはstack上の構文的左文脈を要約している。そのため、$acc(s_p)$ によるfilterは「この文脈で現れ得るtokenだけをscannerへ見せる」ことになる。別々のsub-languageに属するtokenが同じ文字列へ一致しても、同じstateで受理されなければscanner conflictは自動的に消える。

なお、$acc(s_p)$ は[[default-reduction|default reduction]]を適用する前のlookahead情報から計算する。default reduction後のtableでは、どのlookaheadに対するReduceだったかが消えるため、正確な受理可能token集合を作れない。

## pseudo-scanner conflictとlexical precedence

parser contextで候補を絞っても、同じstateで複数のmatchが残る場合がある。これが[[scanner-conflict|pseudo-scanner conflict]]である。

| 種類 | 内容 | 例 |
| --- | --- | --- |
| identity conflict | 同じlexemeが異なるtokenに一致する | `int`がkeywordと`ID`に一致する |
| length conflict | 異なる長さのlexemeが候補になる | `intx`に対する`int`と`ID` |
| autolength conflict | 同じtokenが異なる長さで一致する | `ID`が`in`と`intx`に一致する |

Lexは通常、規則の宣言順とlongest matchによってこれらを暗黙に解決する。この方式ではgrammarやsub-languageを追加したとき、tokenizationが警告なく変わり得る。PSLRはautolength conflictだけを既定のlongest matchで解決し、それ以外の未解決conflictをparser conflictと同じように報告する。

解決規則は`%lex-prec`で宣言する。二文字の演算子は、第一成分がidentity conflict、第二成分がlength conflictの扱いを表す。

| 演算子 | identity | length |
| --- | --- | --- |
| `<∼` | 右tokenを優先 | longest match |
| `<-` | 右tokenを優先 | 指定しない |
| `-∼` | 指定しない | longest match |
| `-<` | 指定しない | 長さに関係なく右tokenを優先 |
| `<<` | 右tokenを優先 | 長さに関係なく右tokenを優先 |
| `-s` | 指定しない | shortest match |
| `<s` | 右tokenを優先 | shortest match |

traditionalな三演算子はkeywordとidentifier、`0`とoctal literalなどを表現する。`-s`は複数行commentの終端を簡潔な正規表現で表すために使える。`-<`や`<<`は、特定の文法contextで長いtokenを無効化したい場合に使える。

生成系のresolverはscanner FSAを走査し、無限に存在し得る具体的な入力を有限個のscanner conflict profileへまとめる。各profileをlexical precedenceで解決し、未解決conflictと、どのstateにも作用しないuseless ruleを報告する。

## scanner FSAと生成table

生成時には、全tokenの正規表現を合併したscanner FSA $\Sigma_s$ を作る。ただし、FSAの受理stateへ返却tokenを直接固定しない。同じFSA stateでもparser contextによって返すtokenが異なるため、判断を次のtableへ分離する。

- `scanner_accepts[parser_state][scanner_accepting_state]` — その組み合わせで返すtoken
- `state_to_accepting_state[scanner_state]` — FSA stateを圧縮した受理state indexへ変換
- `length_precedences[token][token]` — 新しいmatchで現在のbest matchを置き換えるか

`scanner_accepts`は$acc(s_p)$によるfilterとidentity conflictの解決結果をstateごとに焼き込む。`length_precedences`はlongest、shortest、token優先をtoken対の真偽値として表す。runtimeは複雑なprecedence関数を評価せず、table lookupだけで判断できる。

## pseudo_scan runtime

runtimeの本体である`pseudo_scan`は、parserから現在stateを受け取り、入力を一文字ずつscanner FSAへ流す。

~~~text
parser stateと入力
    ↓
scanner FSAを一文字ずつ遷移
    ↓ 受理stateごと
scanner_acceptsでtoken候補を取得
    ↓
length_precedencesでbest matchを更新
    ↓
遷移不能または入力末尾でtokenを返す
~~~

受理stateへ到達するたびに`scanner_accepts`を引き、現在のbest matchが新しい候補に負ける場合だけ更新する。FSAが遷移できなくなるか入力が尽きたら、best matchの終端まで入力を消費してtokenを返す。入力が空ならend tokenを返す。

どの位置のmatchを採用するかは、最後まで候補を比較しなければ確定しない。そのため実装には入力のbufferingと、best matchより先まで読んだ文字の巻き戻しが必要になる。

## lexical tie

pseudo-scannerの素のfilterには、reserved keywordをidentifierとして返し得る問題がある。たとえばkeyword `int`が受理不能で`ID`だけが受理可能なstateでは、入力`int`を`ID`として選ぶ。しかしreserved keywordを持つ言語では、`int`は常にkeywordとして認識し、そのcontextで使えないならsyntax errorにすべきである。

lexical tieは、似たlexemeへ一致するtokenを同時に認識させる規則である。

~~~text
%lex-tie ID keywords
~~~

この宣言により、`ID`が認識されるcontextでは、tieされたkeywordも$acc(s_p)$へ加わる。`int`はkeywordとして選ばれ、そのkeywordをparserが受理できなければsyntax errorになる。

tie関係は反射的・対称的・推移的に扱われる。symbol setへ指定した場合は、その中で実際にconflictするtoken対だけをtieする。どのtokenをtieすべきかは言語の意図に依存するため、generatorは片方だけが受理されるstateを持つ競合対をtie候補として報告する。ユーザーは`%lex-tie`で採用するか、`%lex-no-tie`で意図的に採用しないことを示す。

tieは$acc(s_p)$を広げ、新しいpseudo-scanner conflictを作り得る。そのため、tieの評価はconflictの発見と解決より前に行う。

## IELRとPSLR向けstate compatibility

PSLRでは、parser stateがscannerの左文脈でもある。このためstate mergingの影響はparser actionだけに留まらない。二つのstateをmergeすると$acc(s_p)$もunionされ、parser actionが正しくてもpseudo-scannerの選択tokenが変わる場合がある。

[[lalr-parser|LALR(1)]]は同じLR(0) coreを持つstateを広くmergeする。一方、[[canonical-lr-parser|Canonical LR(1)]]は文脈を細かく保つが、実用grammarではtableが大きくなる。DennyとMalloyの実験では、C++ grammarのstate数はLALRが822、Canonical LRが9849、[[ielr|IELR]]が836だった。

PSLRはIELRを土台にし、必要な文脈だけをstate splitする。さらに通常のIELR state compatibilityへ、pseudo-scannerの選択結果がmergeで変わらないという条件を追加する。

二つのstate $s_p$と$s'_p$は、任意の入力prefix $\xi$について次のどちらかを満たす場合だけcompatibleとする。

1. どちらかのstateで$M(\xi,acc(s_p))$が空である。
2. 両stateでlexical precedence関数$\Delta$が選ぶmatchが同じである。

両stateの選択結果が同じなら、unionしたstateでも同じmatchが選ばれることがmerge-stabilityとして示されている。そのためmerge後の候補を毎回再評価する必要はない。

実装では無限個の文字列を比較せず、scanner FSAから事前に要約したpairwise conflictを使う。未解決conflictだけを理由にstate splitすると、作成途中のgrammarでtableがCanonical LR並みに膨らむため、未解決conflictはmergeを妨げない。全stateに存在するlayout tokenもsplitで除去できないため、split-stableとしてannotation対象から外せる。

このPSLR向けcompatibility testが、state mergingによって正しい入力のtokenizationまで変わる問題を防ぐ、実装上もっとも重要な追加部分である。

## syntax error処理

PSLRのsyntax error処理はscanner側とparser側に分かれる。

### scanner側のfallback

$M(\xi,acc(s_p))$が空でも、parserにerror recoveryを開始させるにはtokenを返す必要がある。このため`scanner_accepts`には、全token集合を対象に解決したfallback行を用意する。

runtimeは次の順にmatchを探す。

~~~text
現在stateのscanner_accepts
    ↓ matchなし
fallback行
    ↓ matchなし
先頭一文字のcharacter token
~~~

これにより、壊れた入力でもscannerは決定的にtokenを返し、parserの[[syntax-error|syntax error]]処理へ制御を渡せる。tieによって候補へ入ったtokenなら言語仕様に基づく選択であり、state mergingによる候補なら近い構文contextに基づく推測になる。

### parser側のLAC

state merging、default reduction、[[nonassoc|%nonassoc]]によるerror actionがあると、LR parserは不正なlookaheadを検出する前に余分なReduceと[[semantic-action|semantic action]]を実行する場合がある。expected token listや[[error-recovery|error recovery]]の開始contextも不正確になり得る。

[[lookahead-correction|LAC]]は、一時stack上でsemantic actionを実行しない[[exploratory-parse|exploratory parse]]を行い、lookaheadを現在のparser stackで受理できるか確かめる。LACを加えると、不正な入力についてもIELRとCanonical LRの振る舞いをほぼ揃えられる。

ただしLACはPSLRのコアではない。正しい入力のtoken選択とparser actionは、pseudo-scannerとPSLR向けIELR拡張が担保する。LACが改善する範囲と歴史は[[lac-and-pslr|LACとPSLRの関係]]で整理した。

## layout tokenとtoken action

空白やcommentをgrammarへ直接書くと、ほぼ全token間にlayout用のsymbolを挿入することになる。PSLRは`YYLAYOUT`で始まるtokenをlayout tokenとして扱い、全stateの$acc(s_p)$へ加える。

`pseudo_scan`がlayout tokenを認識すると、parserへ返さず破棄してscanを再開する。複数のlayout tokenを宣言できるため、line commentにはlongest match、multiline commentにはshortest matchという異なる規則を指定できる。

layout tokenを全stateへ加えると新しいconflictも生まれる。たとえばstring literalの内部では、文字列内容を表すtokenがlayout tokenに勝つようlexical precedenceを宣言する必要がある。

統合仕様には独立したlexer action欄がないため、semantic valueの構築には`%token-action`を使う。連続したlayout lexemeを蓄積し、次の非layout tokenのactionから参照できるようにする。入力末尾のlayoutはend tokenのactionから参照できる。これによりcommentを保持するcode transformationにも対応する。

## 論文の将来構想

論文には構想のみが示され、当時の実装には含まれない機能もある。

- lexical nonterminal (`%lex`) — regular expressionで扱いにくいnestedな字句構造を、start/end tokenで区切った副parserへ委ねる
- scoped declaration — sub-languageごとに異なるlexical precedenceやfallback行を局所化する

これらはPSLRの基本的なtoken選択を成立させる条件ではない。論文準拠の実装要素と優先度は[[pslr-implementation-elements|PSLR実装の全体像]]で分けている。

## 全体の流れ

生成時には、scanner specificationとparser grammarから次の順でtableを作る。

~~~mermaid
flowchart TD
    A[統合仕様] --> B[scanner FSA]
    A --> C[LR statesとlookahead]
    C --> D[default reduction前のacc]
    A --> D
    B --> E[conflict profileとlexical precedenceの要約]
    D --> E
    E --> F[PSLR拡張付きIELR state splitting]
    C --> F
    F --> G[最終scanner_accepts]
    E --> G
    E --> H[length_precedences]
    G --> I[pseudo_scan]
    H --> I
    I --> J[LR parser]
    J -. error .-> K[fallbackとLAC]
~~~

runtimeでは、parserが現在stateを渡して`pseudo_scan`を呼ぶ。pseudo-scannerはFSAで文字列を読み、$acc(s_p)$相当の`scanner_accepts`で構文contextに合う候補へ絞り、`length_precedences`で一つを選ぶ。matchがなければfallbackとcharacter tokenがparserのerror処理へ接続し、LACを有効にすれば不正入力時の診断と回復を補正する。

PSLRはscannerless parserではない。scannerを残したまま、その判断をparser stateで駆動することで、字句解析と構文解析の境界を宣言的に接続する方式である。

## Lramaとの関係

[[lrama|Lrama]]でPSLRを実現する場合、既存のIELR実装がstate splittingの土台になる。一方、scanner FSA、lexical precedenceとtie、`scanner_accepts`、`pseudo_scan`、PSLR向けstate compatibilityは別途必要になる。

Lramaへの段階的な導入順序と全要素は[[pslr-implementation-elements|PSLR実装の全体像]]を参照。LACは独立optionとして後から追加できる。

## 出典

- [PSLR(1): Pseudo-Scannerless Minimal LR(1) for the Deterministic Parsing of Composite Languages](https://open.clemson.edu/all_dissertations/519/)
- [PSLR博士論文本文](https://malloy.people.clemson.edu/publications/papers/jdenny/jdenny.pdf)
- [The IELR(1) Algorithm for Generating Minimal LR(1) Parser Tables](https://malloy.people.clemson.edu/publications/papers/scp09/scp09.pdf)
- [Scannerless Generalized-LR Parsing](https://eelcovisser.org/publications/1997/Visser97-SGLR.pdf)
- [GNU Bison Manual: LAC](https://www.gnu.org/software/bison/manual/html_node/LAC.html)
- [Lrama](https://github.com/ruby/lrama)
- [Liberating Ruby's Parser from Lexer Hacks](https://speakerdeck.com/ydah/liberating-rubys-parser-from-lexer-hacks)
