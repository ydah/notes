---
created: 2026-08-19
updated: 2026-08-19
---

# pseudo-scanner

#lexer #parser #compiler #pslr

pseudo-scannerは、現在のparser stateをscannerのtoken認識に使う字句解析器。scannerless parserのようにscannerを文法へ完全に統合するのではなく、scannerは残したまま、parserからtoken候補の制約だけを受け取る。

PSLRでは、文字列 ξ とtoken集合 T に対するscannerの候補を M(ξ, T) とする。parser stateを sp、そのstateで考慮してよいtoken集合を acc(sp) とすると、pseudo-scannerは概念的に M(ξ, acc(sp)) の候補を認識する。parserが現在の文脈で受け取れないtokenは、文字列の正規表現に一致していても候補から外れる。

処理の流れは次のようになる。

~~~text
入力文字列
    ↓
parser stackから現在のstateを得る
    ↓
そのstateのtoken候補を求める
    ↓
scannerの一致候補を絞る
    ↓
tokenをparserへ返す
~~~

「>」と「>>」が同じ位置から始まる場合、あるstateでは「>」だけを候補にし、別のstateでは「>>」を候補にできる。従来のscannerの最長一致だけではなく、構文上の文脈を使ってtokenizationを選べる。

この方式はscannerのstart conditionを全て手動で管理する設計とは違う。文法からparser stateごとのtoken受理情報を生成できるため、host languageとDSLの境界のような[[composite-language|composite language]]で、lexer側に構文状態の複製を増やしにくい。

ただし、候補を絞っても複数tokenが残れば[[scanner-conflict|scanner conflict]]になる。また、LALRのstate mergeによって異なる文脈のtoken受理集合が混ざると、Canonical LRではなかったpseudo-scanner conflictが発生する。このためPSLRでは[[minimal-lr-parser|Minimal LR(1)]]や[[ielr|IELR]]によるstateの区別が重要になる。

## 出典

- [PSLR(1): Pseudo-Scannerless Minimal LR(1) for the Deterministic Parsing of Composite Languages](https://open.clemson.edu/all_dissertations/519/)
- [PSLR(1) dissertation PDF](https://malloy.people.clemson.edu/publications/papers/jdenny/jdenny.pdf)
