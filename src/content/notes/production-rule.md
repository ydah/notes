---
created: 2026-08-17
updated: 2026-08-17
---

# 生成規則

#grammar #formal-language #parser

非終端記号を、終端記号・非終端記号の列へ置き換える規則。文脈自由文法では、生成規則は次の形を持つ。

```text
A -> α
```

左辺`A`は1つの[[nonterminal-symbol|非終端記号]]。右辺`α`は終端記号と非終端記号からなる有限列で、空列になる場合は[[epsilon|ε]]で表す。

文脈自由というのは、`A`の周囲に何があるかを考えずに置換できるという意味。

```text
u A v ⇒ u α v
```

`A -> α`があれば、`u`と`v`の内容によらず`A`を`α`へ置き換えられる。

複数の選択肢は、意味上は別々の生成規則になる。

```text
expr -> expr "+" term
expr -> term
```

parser generatorの入力では、`|`でまとめて書くことが多い。

```text
expr:
    expr "+" term
  | term
;
```

ここで`:`や`;`は文法ファイルの記法で、`"+"`は入力言語の[[terminal-symbol|終端記号]]。生成規則に付ける`{ ... }`の[[semantic-action|semantic action]]は、CFGの置換規則そのものではなく、規則を認識したときの意味処理。

生成規則を繰り返し適用して記号列を作る過程が[[derivation|導出]]。逆に、構文解析器は入力token列がどの生成規則に従うかを認識する。

## 出典

- [Language and Grammar](https://www.gnu.org/software/bison/manual/html_node/Language-and-Grammar.html)
- [Syntax of Grammar Rules](https://www.gnu.org/software/bison/manual/html_node/Rules-Syntax.html)
- [Empty Rules](https://www.gnu.org/software/bison/manual/html_node/Empty-Rules.html)
- [Grammars and Derivations](https://www.cs.cornell.edu/courses/cs4120/2023sp/notes/grammars/)
