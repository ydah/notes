---
created: 2026-08-17
updated: 2026-08-17
---

# 導出

#formal-language #grammar #parser

文法の開始記号から、[[production-rule|生成規則]]を繰り返し適用して記号列を作る過程。

[[production-rule|生成規則]]が`A -> β`で、現在の記号列が`α A γ`なら、1ステップの導出は次のように書く。

```text
α A γ ⇒ α β γ
```

`⇒*`は0回以上の導出を表す。

```text
E -> E "+" T | T
T -> NUMBER
```

`NUMBER + NUMBER`は、例えば次のように導出できる。

```text
E
⇒ E "+" T
⇒ T "+" T
⇒ NUMBER "+" T
⇒ NUMBER "+" NUMBER
```

導出途中の、終端記号と非終端記号が混在する記号列をsentential formと呼ぶ。終端記号だけになったものが、文法の言語に含まれるsentenceになる。

毎回一番左の非終端記号を展開するものが左端導出、一番右の非終端記号を展開するものが[[rightmost-derivation|右端導出]]。[[ll-parser|LLパーサー]]は左端導出、[[lr-parser|LRパーサー]]は右端導出を逆向きに扱う。

## 出典

- [Grammars and Derivations](https://www.cs.cornell.edu/courses/cs4120/2023sp/notes/grammars/)
- [Context-Free Grammars](https://pages.cs.wisc.edu/~fischer/cs536.s08/course.hold/html/NOTES/3.CFG.html)
