---
created: 2026-08-17
updated: 2026-08-17
---

# 相互再帰

#parser #compiler #ocaml #grammar

複数の定義が互いを参照する再帰。`A`が`B`を呼び出し、`B`が`A`を呼び出すような依存関係。

関数の場合は、OCamlの`let rec ... and ...`で定義できる。

```ocaml
let rec even n =
  if n = 0 then true
  else odd (n - 1)
and odd n =
  if n = 0 then false
  else even (n - 1)
```

文法でも、ある非終端記号の[[production-rule|生成規則]]が別の非終端記号を参照し、その非終端記号が元の記号を参照する形がある。

```text
A -> "a" B | "a"
B -> "b" A | "b"
```

`A`と`B`が互いに依存しているため、これは文法上の相互再帰になる。相互再帰はパーサーのアルゴリズムそのものではなく、定義間の依存関係を表す構造。

Menhirのcodeバックエンドでは、LRオートマトンを相互再帰するOCaml関数の集まりへコンパイルする。この場合の相互再帰は、文法が相互再帰しているという意味とは別に、生成コードの構造も表す。

## 出典

- [Mutually Recursive Functions](https://ocaml.org/docs/loops-recursion)
- [Recursive definitions of names](https://ocaml.org/manual/5.5/expr.html)
- [Menhir Reference Manual](https://gallium.inria.fr/~fpottier/menhir/manual.html)
