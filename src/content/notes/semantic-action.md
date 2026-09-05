---
created: 2026-08-17
updated: 2026-08-17
---

# semantic action

#parser #compiler #grammar

文法の[[production-rule|生成規則]]に対応づけた実行コード。パーサーは生成規則の右辺を認識したときに、このコードを実行する。右辺のsemantic valueから、左辺の非終端記号のsemantic valueを作る。

LRパーサーでは、通常は[[reduce|Reduce]]のタイミングで実行する。ASTノードの構築、式の評価、型付きの中間表現の生成などに使う。

GNU Bisonでは`$$`が左辺の意味値、`$1`や`$3`が右辺の意味値を表す。

```text
%token <int> NUM
%type <int> expr

%%

expr:
    expr '+' expr { $$ = $1 + $3; }
  | NUM            { $$ = $1; }
  ;
```

`expr '+' expr`を認識すると、左右の`expr`の意味値を加算し、その結果を新しい`expr`の意味値に設定する。構文の認識と、認識した構文から値を作る処理を分けられる。

Menhirではsemantic actionをOCamlコードで書く。[[rocq|Rocq]]バックエンドでは、同じ役割のコードをRocqで書く。

## 出典

- [Semantic Actions](https://www.gnu.org/software/bison/manual/html_node/Semantic-Actions.html)
- [Actions](https://www.gnu.org/software/bison/manual/html_node/Actions.html)
- [Menhir Reference Manual](https://gallium.inria.fr/~fpottier/menhir/manual.html)
