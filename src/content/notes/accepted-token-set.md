---
created: 2026-09-07
updated: 2026-09-07
---

# accepted token set

#parser #compiler #lr #pslr #lexer

DennyのDefinition 2.2.12におけるaccepted token setは、ある[[parser-state|parser state]]でparser actionが定義されているterminalの集合。parser state $s_p$の集合を$acc(s_p)$と書く。

Definition 2.2.12の基本集合では、LR(1) state $s_p$について次のどちらかを満たすterminal $t$が$acc(s_p)$に入る。

- Shift actionを持つitemで、dotの直後にterminal $t$がある
- Reduce actionを持つitemで、そのlookahead set $K$が$t$を含む

基本集合の$acc(s_p)$にないtokenにはparser actionがなく、そのstateではsyntax errorになる。集合に入っていても、その後の解析が成功するとは限らない。ここでいうacceptedは、入力全体の[[accept|Accept action]]を保証する語ではない。

[[pslr|PSLR]]の[[pseudo-scanner]]は、正規表現に一致するtokenのうち$acc(s_p)$に属するものだけを候補にする。$acc(s_p)$はruntimeで探索せず、parser生成時にstateごとに計算する。

PSLRは後続の定義で同じ$acc(s_p)$を再定義し、基本集合へlexical tieとlayout tokenを加える。この拡張はpseudo-scannerの認識範囲を広げるだけで、parser actionを追加しない。tieで加わったtokenをparserが受理できなければsyntax errorになり、layout tokenはparserへ渡す前に破棄する。

基本集合は、明示的なShift・Reduce actionとReduce lookaheadが残る最適化前のLR item情報から計算する。[[default-reduction|default reduction]]の適用後は、既定のReduceがlookaheadを問わず選ばれるため、全tokenが受理可能であるように見える。適用後のtableだけでは元の集合を復元できない。

## 出典

- [PSLR(1): Pseudo-Scannerless Minimal LR(1) for the Deterministic Parsing of Composite Languages](https://open.clemson.edu/all_dissertations/519/)
- [PSLR博士論文本文](https://malloy.people.clemson.edu/publications/papers/jdenny/jdenny.pdf)
