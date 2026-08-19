---
created: 2026-08-19
updated: 2026-08-19
---

# Minimal LR(1)

#parser #compiler #lr #pslr

Minimal LR(1)は、Canonical LR(1)の言語認識能力を保ちながら、LALR(1)に近い大きさのparser tableを生成するという設計目標・アルゴリズムの名前。単にstate数が全体で最小になるという意味ではなく、LR(1)の文脈をどこまで区別するかを必要な箇所に絞るという意味でのminimal。

Canonical LR(1)はlookaheadの異なる文脈を別stateに保つので正確だが、stateとtableが大きくなりやすい。LALR(1)は同じLR(0) coreを持つstateをmergeするため小さいが、本来は別だった文脈を混ぜて人工的なconflictや認識能力の低下を起こすことがある。

[[ielr|IELR]]は、LALRのstate mergeで生じるLR(1)-relative inadequacyを調べ、必要なstateだけをsplitする。これにより、LALRに近いtable sizeでCanonical LR(1)相当の認識能力を保つ。つまり、Canonical LRの全stateをそのまま残すのではなく、mergeしても意味が変わらないstateはmergeする。

PSLRでは、parser stateのtoken受理集合を[[pseudo-scanner|pseudo-scanner]]が使う。したがって、parserの認識能力だけでなく、state mergeによってscannerのtoken候補が変わらないことも必要になる。PSLRのMinimal LR(1)は、IELRをこのpseudo-scannerの文脈へ拡張したものとして説明される。

この意味でMinimal LR(1)は、LR(0)やLALRより強い別の実行時parser方式というより、Canonical LRの正確さとLALRの表の小ささの両方を得るためのtable生成上の基準。文法がLALRで十分なら、IELRで余計なsplitが起きず、結果がLALRと同じになることもある。

## 出典

- [PSLR(1): Pseudo-Scannerless Minimal LR(1) for the Deterministic Parsing of Composite Languages](https://open.clemson.edu/all_dissertations/519/)
- [PSLR(1) dissertation PDF](https://malloy.people.clemson.edu/publications/papers/jdenny/jdenny.pdf)
- [Bison Manual: LR Table Construction](https://www.gnu.org/software/bison/manual/html_node/LR-Table-Construction.html)
