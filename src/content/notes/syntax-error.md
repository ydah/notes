---
created: 2026-08-17
updated: 2026-09-07
---

# 構文エラー

#parser #compiler #diagnostic

入力token列を、[[context-free-grammar|文脈自由文法]]に従う構造として続けられないときに発生するエラー。[[lexical-analyzer|字句解析機]]による字句解析のエラーや、型が合わないといった[[semantic-analysis|意味解析]]のエラーとは異なる。

LRパーサーでは、現在の状態と[[lookahead|lookahead token]]から[[action-table|ACTION表]]を調べる。

```text
ACTION[state, lookahead]
```

その組み合わせにShift、Reduce、Acceptなどの操作がなければ、入力を続けられず構文エラーになる。入力途中で必要なtokenが欠けた場合、欠落箇所そのものではなく、次に読んだtokenやEOFでエラーを検出することもある。

```text
expr -> "(" expr ")"
入力:  "(" NUMBER EOF
```

この場合、parserは`)`を期待した状態でEOFを読む。報告されたtokenが、入力ミスの原因とは限らない。

構文エラーと[[conflict|conflict]]は別物。conflictはparser tableの構築時に複数の操作候補があることを指す。構文エラーはparserの実行時に、入力に対する操作がないことを指す。conflictのないLRパーサーでも、文法に属さない入力を受け取れば構文エラーになる。

LALRやIELRでdefault reductionを先に実行すると、不正なlookaheadを確認する前にReduceが進み、構文エラーの検出が遅れることがある。[[lookahead-correction|Lookahead Correction（LAC）]]は、一時的なstackで先にparser actionを試す。余分なReduceやsemantic actionを通常の解析に反映させず、エラーを検出する。

構文エラーを検出した後も解析を続ける処理がerror recovery。Bisonでは、文法に特別な`error` tokenを含む規則を書ける。

```text
stmt:
    expr ";"
  | error ";"
;
```

エラー時にstackをpopして`error` tokenをShiftし、次の`;`まで入力を読み飛ばす、といった回復を行う。error recoveryは入力を正しいものに変換する処理ではない。後続の入力から追加のエラーや構文木をできるだけ得るための戦略。

IDE向けのparserには、構文エラーがあっても[[syntax-tree|構文木]]を捨てず、missing tokenやerror nodeを残して解析を続ける設計がある。[[cst|CST]]や[[rust-analyzer-rowan|rust-analyzer/rowan]]が扱う[[lossless-syntax-tree|lossless]]な木と、parserが報告するerror一覧は別の情報として持てる。

## 出典

- [Language and Grammar](https://www.gnu.org/software/bison/manual/html_node/Language-and-Grammar.html)
- [Error Reporting](https://www.gnu.org/software/bison/manual/html_node/Error-Reporting.html)
- [Error Recovery](https://www.gnu.org/software/bison/manual/html_node/Error-Recovery.html)
- [Syntax in rust-analyzer](https://rust-analyzer.github.io/book/contributing/syntax.html)
