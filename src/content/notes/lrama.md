---
created: 2026-08-17
updated: 2026-08-17
---

# Lrama

#ruby #parser #compiler #lr #lalr

Lramaは、Rubyで書かれたLALR(1) parser generator。READMEでは、CRubyのparse.yを大きく変更せずにerror tolerant parserを提供することを最初の目的としている。

Bison形式の文法ファイルを扱える。文法からCのparser sourceやheaderを生成でき、例えば次のように使う。

~~~sh
lrama -d sample/parse.y
~~~

LALRの状態と表の生成に加え、次の機能を持つ。

- 構文エラーから回復するerror tolerant parser
- 非終端記号の定義をparameterizeするparameterized rule
- %inlineによる規則のinline化
- 文法からsyntax diagramを生成する機能

error tolerant parserは、構文エラーのあとも解析を続け、後続の入力から情報を得る。通常の[[syntax-error|構文エラー]]で直ちに解析を終了するparserとは用途が異なる。

Lramaは[[yacc|Yacc]]や[[gnu-bison|GNU Bison]]と同じ文脈で扱えるparser generatorだが、BisonそのもののRuby実装ではない。Bison形式の文法との互換性を保ちつつ、CRuby向けのerror toleranceなどを追加している。

文法から[[lalr-parser|LALR]]の状態機械と[[parsing-table|構文解析表]]を作り、生成したparserで[[semantic-action|semantic action]]を実行する。文法にconflictがある場合は、LALRの状態やlookaheadを調べる。

Lramaの将来のparser生成方式として[[pslr|PSLR]]がある。PSLRはparser stateを字句解析器のtoken認識にも使うため、LALRより細かい状態の区別を必要とする。IELRはその基盤になる。

## 出典

- [Lrama README](https://github.com/ruby/lrama)
- [Lrama documentation](https://ruby.github.io/lrama/)
- [CRuby parse.y](https://github.com/ruby/ruby/blob/master/parse.y)
