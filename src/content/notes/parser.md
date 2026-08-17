---
created: 2026-08-17
updated: 2026-08-17
---

# 構文解析器

#parser #compiler #grammar

[[lexical-analyzer|字句解析機]]から受け取ったtoken列が、文法に従っているかを認識するプログラムまたは関数。実装によって、[[syntax-tree|構文木]]・[[ast|AST]]・意味値なども生成する。

```text
expr -> expr "+" term | term
term -> NUMBER
```

入力が、

```text
NUMBER "+" NUMBER
```

なら、[[production-rule|生成規則]]に従っているため受理できる。`NUMBER "+" "+"`のように規則に合わないtoken列を受け取ると、[[syntax-error|構文エラー]]になる。

構文解析器は通常、文字列を直接処理せず、[[terminal-symbol|終端記号]]に対応するtoken列を処理する。token列を作るのは字句解析機の役割で、構文解析器はtokenの並びを[[context-free-grammar|文脈自由文法]]と照合する。

Rubyの構文解析器には[[prism|Prism]]がある。Prismはparser generatorではなく、Rubyのソースコードを解析してASTとdiagnosticを返すparserの実装。

[[ll-parser|LLパーサー]]や[[lr-parser|LRパーサー]]のように、文法をどの方向から処理するかによって構文解析の方式が分かれる。[[syntax-analysis-and-parser-generators|パーサージェネレータ]]を使う場合は、文法から構文解析器の実装や[[parsing-table|構文解析表]]を生成する。

## 出典

- [Language and Grammar](https://www.gnu.org/software/bison/manual/html_node/Language-and-Grammar.html)
- [The Bison Parser Algorithm](https://www.gnu.org/software/bison/manual/html_node/Algorithm.html)
- [The Parser Function `yyparse`](https://www.gnu.org/software/bison/manual/html_node/Parser-Function.html)
