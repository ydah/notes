---
created: 2026-09-07
updated: 2026-09-07
---

# parser state

#parser #compiler #lr

parser stateは、LR parserが読み終えた入力の構文的な左文脈を要約したもの。LR itemの集合として表し、[[lr-table|LR table]]の一行に対応する。

runtimeではstateをstackに積み、最上段のstateと[[lookahead-token|lookahead token]]から[[action-table|ACTION]]を選ぶ。[[shift|Shift]]ではtokenと次のstateを積む。[[reduce|Reduce]]では規則の右辺に対応する要素を取り除き、残った最上段のstateと規則の左辺から[[goto-table|GOTO]]先を決める。

DennyのPSLR論文ではparser stateを$s_p$と書く。プレーンテキストでは`sp`とも表記する。[[pslr|PSLR]]では、parserが現在の$s_p$を[[pseudo-scanner]]へ渡す。pseudo-scannerは[[accepted-token-set|accepted token set]] $acc(s_p)$を使い、parser stateを字句解析の文脈にする。

## 出典

- [Bison Manual: Parser States](https://www.gnu.org/software/bison/manual/html_node/Parser-States.html)
- [PSLR(1): Pseudo-Scannerless Minimal LR(1) for the Deterministic Parsing of Composite Languages](https://open.clemson.edu/all_dissertations/519/)
- [PSLR博士論文本文](https://malloy.people.clemson.edu/publications/papers/jdenny/jdenny.pdf)
