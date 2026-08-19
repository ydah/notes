---
created: 2026-08-19
updated: 2026-08-19
---

# composite language

#parser #compiler #lexer #grammar

composite languageは、複数のsub-languageや文法を組み合わせて一つの入力を構成する言語。ホスト言語にDSLを埋め込む場合や、Yaccのように文法記述・semantic action・字句規則を一つの入力で扱う場合が例になる。C/C++のように、同じ文字列が文脈によって別のtokenとして解釈される言語も、scannerの観点では同じ問題を持つ。

難しさは、各sub-languageを個別に解析できるかではなく、境界付近でtokenizationの選択が文法の文脈に依存することにある。たとえば `>` と `>>` の両方がtoken候補になるとき、テンプレートの閉じ括弧としては `>>` を二つの `>` として扱いたい場合があり、別の文脈ではシフト演算子として `>>` にしたい。

通常のscannerは最長一致や規則の記述順で候補を一つに決める。その規則だけでは文脈依存の選択を表しにくく、scannerのstart conditionを手作業で切り替える設計になりやすい。[[pseudo-scanner|pseudo-scanner]]は、現在のparser stateで受理候補になるtokenだけをscannerの候補に残すことで、parserとscannerの境界を保ったままこの問題を扱う。

複数の候補が残る状態は[[scanner-conflict|scanner conflict]]になる。PSLRはcomposite languageのために、通常のLR table生成に加えて、状態マージ後もpseudo-scannerのtoken候補が壊れないようにする[[minimal-lr-parser|Minimal LR(1)]]の仕組みを使う。

## 出典

- [PSLR(1): Pseudo-Scannerless Minimal LR(1) for the Deterministic Parsing of Composite Languages](https://open.clemson.edu/all_dissertations/519/)
- [PSLR(1) dissertation PDF](https://malloy.people.clemson.edu/publications/papers/jdenny/jdenny.pdf)
