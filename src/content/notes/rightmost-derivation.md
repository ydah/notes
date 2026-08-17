---
created: 2026-08-17
updated: 2026-08-17
---

# 右端導出

#formal-language #grammar #parser #lr

生成途中の記号列に非終端記号があるとき、常に一番右側の非終端記号を展開する導出方法。

```text
E    -> E "+" T | T
T    -> NUMBER
```

`NUMBER + NUMBER`の右端導出は次のようになる。

```text
E
⇒ E "+" T
⇒ E "+" NUMBER
⇒ T "+" NUMBER
⇒ NUMBER "+" NUMBER
```

`E "+" T`の次では、右端にある`T`を先に`NUMBER`へ展開する。

[[lr-parser|LRパーサー]]は入力を左から右へ読みながら、右端導出を逆向きに構築する。入力側の終端記号列から、生成規則の右辺を見つけて左辺へ[[reduce|Reduce]]するため、右端導出を最初から生成するのではなく、逆向きにたどっている。

## 出典

- [Grammars and Derivations](https://www.cs.cornell.edu/courses/cs4120/2023sp/notes/grammars/)
- [Bottom-up Parsing](https://www.cs.cornell.edu/courses/cs4120/2021sp/notes/bottomup/)
- [Language and Grammar](https://www.gnu.org/software/bison/manual/html_node/Language-and-Grammar.html)
