---
created: 2026-08-19
updated: 2026-09-07
---

# lexeme

#lexer #parser #compiler #formal-language

lexemeは、入力文字列中のtokenに対応する連続した文字列。tokenが分類や構文上の種類を表すのに対し、lexemeは入力に現れた文字そのものを表す。

たとえば、次の入力では 123 がNUMBER tokenのlexeme、name がIDENTIFIER tokenのlexemeになる。

~~~text
入力:  123 + name
       └──┘   └──┘
       NUMBER IDENTIFIER
~~~

字句解析器はlexemeを認識し、token kindと意味値へ変換する。NUMBERのlexeme 123から整数値123を作る場合、文字列123がlexemeで、整数123が意味値である。ソース位置や元の文字列を後から使うparserは、lexemeの範囲をsource spanとして保持する場合もある。

形式言語の記法では、入力文字の集合を Ξ とすると、lexeme λ は通常 Ξ+ の要素、つまり空でない文字列である。token tの正規表現が λ 全体に一致するとき、λはtのlexemeになる。入力のprefixごとに一致する (lexeme, token) の集合がscannerの候補になる。

同じ文字列が複数のtoken kindに一致することもある。intがkeywordとidentifierの両方の規則に一致する場合はidentity [[scanner-conflict|scanner conflict]]になる。>と>>のように長さの異なるlexemeが同じ位置から始まる場合はlength conflictになる。

通常の[[scanner]]は最長のlexemeを選ぶ。[[pseudo-scanner|pseudo-scanner]]は、その前にparser stateでtoken候補を制限する。そのため、現在の構文上の文脈もtokenizationに影響する。

## 出典

- [PSLR(1): Pseudo-Scannerless Minimal LR(1) for the Deterministic Parsing of Composite Languages](https://open.clemson.edu/all_dissertations/519/)
- [PSLR(1) dissertation PDF](https://malloy.people.clemson.edu/publications/papers/jdenny/jdenny.pdf)
