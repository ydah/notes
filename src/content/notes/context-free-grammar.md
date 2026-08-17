---
created: 2026-08-17
updated: 2026-08-17
---

# 文脈自由文法

#formal-language #grammar #parser #compiler

生成規則を適用する非終端記号の周囲に、どの記号があるかを考慮しない形式文法。英語ではContext-Free Grammar（CFG）。

文脈自由文法は、次の4つ組で表せる。

```text
G = (N, Σ, P, S)
```

- `N` — [[nonterminal-symbol|非終端記号]]の集合
- `Σ` — [[terminal-symbol|終端記号]]の集合
- `P` — 生成規則の集合
- `S` — 開始記号。`S ∈ N`

生成規則は、1つの非終端記号を左辺に持つ。

```text
A -> α
```

現在の記号列が`u A v`なら、`u`と`v`の内容に関係なく、`A`を`α`へ置き換えられる。

```text
u A v ⇒ u α v
```

例えば、

```text
E -> E "+" T | T
T -> NUMBER
```

では`E`と`T`が非終端記号、`"+"`と`NUMBER`が終端記号。開始記号を`E`とすると、`NUMBER + NUMBER`などを生成できる。開始記号から終端記号列までの導出については[[derivation|導出]]を参照。

構文の大枠を記述する文法であり、型の整合性や名前の宣言・参照のような文脈依存の条件まで、通常はこの文法だけで表さない。

## 出典

- [Language and Grammar](https://www.gnu.org/software/bison/manual/html_node/Language-and-Grammar.html)
- [Context-Free Grammars](https://pages.cs.wisc.edu/~fischer/cs536.s08/course.hold/html/NOTES/3.CFG.html)
