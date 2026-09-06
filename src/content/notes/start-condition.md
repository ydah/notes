---
created: 2026-09-07
updated: 2026-09-07
---

# start condition

#lexer #compiler #parser

start conditionは、[[lex|POSIX Lex]]や[[flex]]の[[scanner]]で有効な字句規則を切り替えるmode。文字列、comment、埋め込み言語など、通常と異なる字句規則を同じscannerで扱うために使う。

definitions sectionで`%s`はinclusive、`%x`はexclusiveなstart conditionを宣言する。

- inclusive (`%s`) — `<SC>`付きの規則に加え、condition指定のない規則も有効になる
- exclusive (`%x`) — condition指定のない規則は無効になり、prefixに現在のconditionを含む規則が有効になる

ruleのpatternへ`<SC>`を付けると、そのconditionでだけ有効になる。POSIX Lexではactionに`BEGIN SC;`と書いてmodeを切り替える。flexでは`BEGIN(SC);`という括弧付きの形も使える。

初期start conditionは`INITIAL`であり、値は`0`。POSIX Lexでは`BEGIN INITIAL;`、flexでは`BEGIN(INITIAL);`や`BEGIN(0);`で初期状態へ戻せる。

~~~text
%x STRING
%%
\"              BEGIN(STRING);
<STRING>[^\"]+  consume_string(yytext);
<STRING>\"      BEGIN(INITIAL);
~~~

exclusive conditionは、それ自体を小さな独立scannerとして書ける。commentやstring literalのように規則群が大きく異なる部分に向く。

mode遷移はaction内の`BEGIN`で明示する。scannerがdelimiterを認識して切り替えるだけなら、parserの文脈を複製する必要はない。

[[composite-language|composite language]]でparserの文脈に応じてsub-languageを切り替える場合は、scanner側でもその文脈を追跡する。grammarの状態と遷移条件が重複し、境界を追加するたびに手動の同期が増える。

[[pseudo-scanner]]は、手動のmodeではなく現在のparser stateからtoken候補を得る。この用途では、start conditionによってparser文脈をscanner側へ複製するのに対し、pseudo-scannerはparserの文脈を直接使う。

## 出典

- [The Flex Manual: Start Conditions](https://westes.github.io/flex/manual/Start-Conditions.html)
- [The Open Group Base Specifications: lex](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/lex.html)
