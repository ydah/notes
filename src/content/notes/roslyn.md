---
created: 2026-08-17 21:20
updated: 2026-08-17
---
# Roslyn

#dotnet #compiler #csharp #visual-basic

Microsoftが開発するC#とVisual Basicのオープンソースコンパイラ実装、およびコード分析API。単にソースコードをアセンブリへ変換するコンパイラではなく、[[syntax-tree|構文木]]・シンボル・意味モデル・診断など、コンパイラが持つ情報をAPIとして公開する「コンパイラプラットフォーム」。

## コンパイラのパイプライン

Roslynはコンパイル処理を複数の機能領域に分けている。

- **parse**: ソースをトークン化し、文法に従った[[syntax-tree|syntax tree]]を作る
- **declaration**: ソースや参照メタデータから名前付きsymbolを作る
- **bind**: 識別子をsymbolへ対応付ける
- **emit**: コンパイル結果をILとして出力する

各段階に対応するオブジェクトモデルへアクセスできる。[[syntax-analysis-and-parser-generators|パーサージェネレータ]]が構文解析だけを担当するのに対して、Roslynは[[semantic-analysis|意味解析]]やコード生成まで含むコンパイラ全体を扱う。

## Syntax tree

Roslynの[[syntax-tree|syntax tree]]はソースコードをfull fidelityで保持する。文法上の構造だけでなく、すべてのtoken、空白、コメント、プリプロセッサディレクティブを含む。[[syntax-error|構文エラー]]がある場合も、欠落tokenやスキップされたtokenとして木に表現する。

そのため[[syntax-tree|syntax tree]]から元のソーステキストへround-tripできる。formatter・refactoring・code fixのような、ソースの形を保ちながら編集するツールを作りやすい。

## APIの層

- **Compiler APIs**: SyntaxTree、Compilation、Symbol、SemanticModel、Diagnosticなど。Visual Studioに依存せず利用できる。
- **Workspaces APIs**: solution・project・documentをまとめて扱い、コード分析・refactoring・Find All Referencesなどを実装するためのAPI。

## 出典

- [Roslyn - GitHub](https://github.com/dotnet/roslyn)
- [Roslyn Overview](https://github.com/dotnet/roslyn/blob/main/docs/wiki/Roslyn-Overview.md)
