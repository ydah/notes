---
created: 2026-08-17 21:20
updated: 2026-08-17 21:20
---
# Canonical LRパーサー

#parser #compiler #canonical-lr #lr

Canonical LR(1)は、LRアイテムごとに正確な1 tokenのlookaheadを持つLRパーサーの構築方式。[[slr-parser|SLR]]のFOLLOW集合のような文法全体の近似を使わず、[[lalr-parser|LALR]]のように状態をcoreだけでマージもしないため、3方式の中で最も精密に文脈を区別できる。

## LR(1)アイテム

Canonical LRでは、生成規則と入力位置にlookaheadを付ける。

```text
[A -> α ., ")" ]
```

これは、`A -> α`をreduceできる状態だが、lookaheadが`)`のときだけreduceするという意味。`+`や`*`がlookaheadなら、別の操作になるかエラーになる。

SLRの、

```text
A -> α .
```

とFOLLOW(A)の組み合わせより、現在の状態に依存した判断ができる。

## コスト

状態をマージしないため、LALRより状態数とパーサーテーブルが大きくなりやすい。生成されたテーブルのサイズや構築時間が問題になることがある。

一方、LALRの状態マージによるmysterious conflictを避けやすく、文法がどのlookaheadでreduce可能なのかを調べる用途にも向いている。

## 位置づけ

Canonical LRはLR(1)の認識能力をそのまま使いたいときの基準になる。実用上は、Canonical LRに近い認識能力を保ちながら状態数を抑えるIELRが選択肢になる。

## 出典

- [LR Table Construction](https://www.gnu.org/software/bison/manual/html_node/LR-Table-Construction.html)
- [Parser States](https://www.gnu.org/software/bison/manual/html_node/Parser-States.html)
- [Lookahead Tokens](https://www.gnu.org/software/bison/manual/html_node/Lookahead.html)
