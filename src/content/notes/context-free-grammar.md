---
created: 2026-08-17
updated: 2026-08-17
---

# 文脈自由文法

#formal-language #grammar #parser #compiler

文脈自由文法（Context-Free Grammar、CFG）は、[[production-rule|生成規則]]を適用する非終端記号の周囲を考慮しない形式文法。

文脈自由文法は、次の4つ組で表せる。

```text
G = (N, Σ, P, S)
```

- `N` — [[nonterminal-symbol|非終端記号]]の集合
- `Σ` — [[terminal-symbol|終端記号]]の集合
- `P` — [[production-rule|生成規則]]の集合
- `S` — 開始記号。`S ∈ N`

[[production-rule|生成規則]]は、1つの非終端記号を左辺に持つ。

```text
A -> α
```

現在の記号列が`u A v`なら、`u`と`v`の内容に関係なく、`A`を`α`へ置き換えられる。

```text
u A v ⇒ u α v
```

例として、次の文法を考える。

```text
E -> E "+" T | T
T -> NUMBER
```

`E`と`T`は非終端記号、`"+"`と`NUMBER`は終端記号。開始記号を`E`とすると、`NUMBER + NUMBER`などを生成できる。開始記号から終端記号列を作る過程については[[derivation|導出]]を参照。

文脈自由文法は構文の大枠を記述する。型の整合性や名前の宣言・参照のような文脈依存の条件は、通常この文法だけでは表さない。

## 出典

- [Language and Grammar](https://www.gnu.org/software/bison/manual/html_node/Language-and-Grammar.html)
- [Context-Free Grammars](https://pages.cs.wisc.edu/~fischer/cs536.s08/course.hold/html/NOTES/3.CFG.html)
