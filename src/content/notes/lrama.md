---
created: 2026-08-17
updated: 2026-08-17
---

# Lrama

#ruby #parser #compiler #lr #lalr

Rubyで書かれたLALR(1) parser generator。Lrama自身のREADMEでは、CRubyのparse.yを大きく変更せずにerror tolerant parserを提供することを最初の目的としている。

Bison形式の文法ファイルを扱える。文法からCのparser sourceやheaderを生成でき、例えば次のように使う。

~~~sh
lrama -d sample/parse.y
~~~

Lramaには、単にLALRの状態と表を生成するだけでなく、次のような機能がある。

- 構文エラーから回復するerror tolerant parser
- 非終端記号の定義をparameterizeするparameterized rule
- %inlineによる規則のinline化
- 文法からsyntax diagramを生成する機能

error tolerant parserでは、構文エラーのあとも解析を続けて、後続の入力から情報を得られるようにする。これは通常の[[syntax-error|構文エラー]]で直ちに解析を終了するparserとは用途が異なる。

Lramaは[[yacc|Yacc]]や[[gnu-bison|GNU Bison]]と同じ文脈で扱えるparser generatorだが、BisonそのもののRuby実装というわけではない。Bison形式の文法との互換性を保ちつつ、CRuby向けのerror toleranceなどを追加している。

parser generatorとしては、文法から[[lalr-parser|LALR]]の状態機械と[[parsing-table|構文解析表]]を作り、生成されたparserの[[semantic-action|semantic action]]を実行する構成になる。文法にconflictがある場合は、LALRの状態やlookaheadを調べる必要がある。

## 出典

- [Lrama README](https://github.com/ruby/lrama)
- [Lrama documentation](https://ruby.github.io/lrama/)
- [CRuby parse.y](https://github.com/ruby/ruby/blob/master/parse.y)
