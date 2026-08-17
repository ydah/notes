---
created: 2026-08-17 21:20
updated: 2026-08-17
---
# FOLLOW集合

#parser #compiler #ll #lr

文法中の[[nonterminal-symbol|非終端記号]]の直後に現れうる[[terminal-symbol|終端記号]]を集めた集合。文法全体からパーサー生成時に計算するもので、実際の入力を読んだときの次のtokenそのものではない。[[lookahead|lookahead]]の候補を文法からまとめたもの、と考えると分かりやすい。

## 計算方法

開始記号のFOLLOW集合には入力末尾を表す`$`を入れる。

生成規則が、

```text
X -> α A β
```

の形なら、`β`の[[first-set|FIRST集合]]に含まれる終端記号をFOLLOW(A)へ追加する。`β`が空文字（[[epsilon|ε]]）になりうる場合は、FOLLOW(X)もFOLLOW(A)へ追加する。

例えば、

```text
S -> A B
A -> "a" | ε
B -> "b" | ε
```

では、

```text
FOLLOW(S) = { "$" }
FOLLOW(A) = { "b", "$" }
FOLLOW(B) = { "$" }
```

`A`の後ろには通常`B`が来る。`B`は`"b"`にも空文字にもなれるため、`"b"`と`FOLLOW(S)`の`"$"`がFOLLOW(A)に入る。

## SLRとの関係

SLRでは、生成規則を読み終えた状態、

```text
A -> α .
```

で、lookaheadがFOLLOW(A)に含まれていればreduceする。FOLLOW集合は文法全体に対して1つしかなく、現在のパーサー状態の文脈を細かく区別しない。そのため、Canonical LRなら起きないconflictがSLRでは起きることがある。

LL(1)の予測パーサーでも、空文字を生成できる規則を選ぶときにFOLLOW集合を使う。

## 出典

- [FIRST and FOLLOW Sets](https://www.cs.rochester.edu/~brown/173/lectures/flat/formal_lang/NewParse4lec.html)
- [Constructing Predictive Parsers](https://suif.stanford.edu/dragonbook/lecture-notes/Columbia-COMS-W4115/08-02-25.html)
- [LR Table Construction](https://www.gnu.org/software/bison/manual/html_node/LR-Table-Construction.html)
