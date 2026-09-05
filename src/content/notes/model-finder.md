# Model finder

#formal-methods #model-finder #solver

論理式を真にするmodel、つまり変数やrelationへの具体的な割り当てを探すtool。性質 $P$ の検査では、$\neg P$を満たすmodelを探して[[counterexample|反例]]を得る。

Alloy Analyzerは厳密にはmodel checkerではなくmodel finder。userが指定した有限のscope内でinstanceを探す。`check`ではassertionを否定した式を解く。instanceが見つからない結果は、そのscopeまでについてのもの。

時系列の[[state-transition-system|状態遷移系]]を組み込みで前提とする[[model-checking|モデル検査]]とは入力の捉え方が違うが、有限範囲の反例探索という用途は重なる。

## [[model-checking|モデル検査]]の中での位置づけ

有限scopeで構造や反例を探す隣接手法。

## 出典

- [Alloy: What kind of analysis does the Alloy Analyzer do?](https://alloytools.org/faq/what_kind_of_analysis_does_the_alloy_analyzer_do.html)
- [Alloy language reference](https://alloytools.org/spec.html)
