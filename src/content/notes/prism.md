---
created: 2026-08-17
updated: 2026-08-17
---

# Prism

#ruby #parser #compiler #ast #syntax-tree

Rubyの構文解析器。portable、error-tolerant、maintainableなRuby parserを目指しており、C99で実装され、外部依存なしでビルドできる。parser generatorではなく、Rubyの文法を解析するparserの実装そのもの。

PrismはCのlibprismとして利用でき、CRuby向けのextensionも提供する。CRuby 3.3以降には組み込まれており、それより前のRubyではprism gemをインストールして使う。

解析結果は[[ast|AST]]と診断情報を持つ。ノードにはソース上の位置が関連づけられ、構文エラーによってソースに存在しないノードが必要になる場合は、MissingNodeのようなerror recovery nodeで表現される。

~~~ruby
require "prism"

result = Prism.parse("1 + 2")
result.value
~~~

Prismはコメントやtoken、diagnosticを扱うAPIも持つ。syntax treeをJSONやシリアライズ形式へ出力する機能もあり、parserの結果をformatter、静的解析、IDE tooling、compilerへ渡すための基盤になる。

whitequark/parser gem向けのtranslation layerも提供している。PrismのASTをparser gemのsyntax treeへ変換できるため、parser gem向けに作られた既存のツールをPrismで解析した結果に接続できる。

CRubyではPrismのASTからinstruction sequenceを生成するcompile処理が実装されている。parserがASTを作り、そのASTをcompilerが走査してコード生成するという、[[parser|構文解析器]]とcompilerの分担が見やすい例。

## 出典

- [Prism Ruby Parser](https://ruby.github.io/prism/)
- [Prism repository](https://github.com/ruby/prism)
- [Prism C API: AST](https://ruby.github.io/prism/c/files.html)
- [Parser translation](https://ruby.github.io/prism/rb/docs/parser_translation_md.html)
- [Compiling Prism’s AST](https://ruby.github.io/prism/rb/docs/cruby_compilation_md.html)
