---
created: 2026-08-17
updated: 2026-08-17
---

# ocamlyacc

#ocaml #parser #compiler #lalr

OCamlに付属するYacc系のパーサージェネレータ。文脈自由文法と[[semantic-action|semantic action]]を含む`.mly`ファイルから、OCamlの[[parser|構文解析器]]を生成する。

```sh
ocamlyacc parser.mly
```

`parser.ml`と`parser.mli`が生成される。生成されたparser関数は、[[lexical-analyzer|字句解析機]]と`Lexing.lexbuf`を受け取り、開始記号に対応するsemantic valueを返す。token型も`parser.mli`に生成される。

```ocaml
%token <int> INT
%token PLUS EOF

%start main
%type <int> main expr

%%

main:
    expr EOF { $1 }
;

expr:
    INT              { $1 }
  | expr PLUS INT    { $1 + $3 }
;
```

`{ $1 }`や`{ $1 + $3 }`の部分が[[semantic-action|semantic action]]。規則を認識したときに実行され、右辺のsemantic valueから左辺の値を作る。

ocamlyaccは[[lalr-parser|LALR(1)]]のparserを生成する。状態マージによって状態数を小さくできる一方、[[canonical-lr-parser|Canonical LR(1)]]なら発生しない[[conflict|conflict]]が起きることがある。`ocamlyacc -v`を実行すると、構文解析表とconflictのレポートを`parser.output`に出力できる。

[[menhir|Menhir]]はOCaml向けの後発のパーサージェネレータ。ocamlyaccの文法を高い互換性で受け付けつつ、LR(1)文法、conflictの説明、エラー処理などを拡張している。

## 出典

- [OCaml Manual: Lexer and parser generators](https://ocaml.org/manual/5.2/lexyacc.html)
- [Menhir公式サイト](https://gallium.inria.fr/~fpottier/menhir/)
- [Menhir Reference Manual](https://gallium.inria.fr/~fpottier/menhir/manual.html)
