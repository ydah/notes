---
created: 2026-08-19
updated: 2026-08-19
---

# lexeme

#lexer #parser #compiler #formal-language

lexemeは、入力文字列中のtokenに対応する、実際の連続した文字列。tokenが分類や構文上の種類を表すのに対して、lexemeは入力に現れた文字そのものを表す。

たとえば、次の入力では 123 がNUMBER tokenのlexeme、name がIDENTIFIER tokenのlexemeになる。

~~~text
入力:  123 + name
       └──┘   └──┘
       NUMBER IDENTIFIER
~~~

字句解析器はlexemeを認識し、token kindと意味値へ変換する。NUMBERのlexeme 123から整数値123を作る場合、123がlexemeで、整数123が意味値。ソース位置や元の文字列を後から必要とするparserでは、lexemeの範囲をsource spanとして保持することもある。

形式言語の記法では、入力文字の集合を Ξ とすると、lexeme λ は通常 Ξ+ の要素、つまり空でない文字列。あるtoken tの正規表現が λ 全体に一致するとき、λはtのlexemeになる。入力のprefixごとに一致する (lexeme, token) の集合を調べると、scannerの候補が得られる。

同じ文字列が複数のtoken kindに一致することもある。intがkeywordとidentifierの両方の規則に一致する場合はidentity [[scanner-conflict|scanner conflict]]になる。>と>>のように長さの異なるlexemeが同じ位置から始まる場合はlength conflictになる。

通常のscannerは最長のlexemeを選ぶが、[[pseudo-scanner|pseudo-scanner]]は先にparser stateでtoken候補を制限する。したがって、lexemeの長さだけではなく、現在の構文上の文脈がtokenizationに影響する場合がある。

## 出典

- [PSLR(1): Pseudo-Scannerless Minimal LR(1) for the Deterministic Parsing of Composite Languages](https://open.clemson.edu/all_dissertations/519/)
- [PSLR(1) dissertation PDF](https://malloy.people.clemson.edu/publications/papers/jdenny/jdenny.pdf)
