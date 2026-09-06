---
created: 2026-08-19
updated: 2026-09-07
---

# composite language

#parser #compiler #lexer #grammar

composite languageは、複数のsub-languageや文法を組み合わせて一つの入力を構成する言語。ホスト言語へのDSLの埋め込みや、文法記述・semantic action・字句規則を一つの入力で扱うYaccが例になる。C/C++のように、同じ文字列を文脈によって別のtokenとして解釈する言語も、scannerの観点では同じ問題を持つ。

難しいのは各sub-languageの個別の解析ではなく、境界付近のtokenizationが文法の文脈に依存すること。たとえば `>` と `>>` がどちらもtoken候補になる場合、テンプレートの閉じ括弧として `>>` を二つの `>` に分ける文脈がある。別の文脈では、シフト演算子 `>>` として扱う。

通常の[[scanner]]は、最長一致や規則の記述順で候補を一つに決める。この規則だけでは文脈依存の選択を表しにくく、scannerの[[start-condition|start condition]]を手作業で切り替える設計になりやすい。[[pseudo-scanner|pseudo-scanner]]は、現在のparser stateで受理候補になるtokenだけを残す。これにより、parserとscannerの境界を保ったまま文脈依存の選択を扱う。

複数の候補が残る状態は[[scanner-conflict|scanner conflict]]になる。PSLRは通常のLR table生成に加え、状態マージ後もpseudo-scannerのtoken候補を保つ[[minimal-lr-parser|Minimal LR(1)]]の仕組みを使う。

## 出典

- [PSLR(1): Pseudo-Scannerless Minimal LR(1) for the Deterministic Parsing of Composite Languages](https://open.clemson.edu/all_dissertations/519/)
- [PSLR(1) dissertation PDF](https://malloy.people.clemson.edu/publications/papers/jdenny/jdenny.pdf)
