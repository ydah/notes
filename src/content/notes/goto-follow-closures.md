---
created: 2026-08-18
updated: 2026-08-18
---

# goto-follow closures

#parser #compiler #lr #ielr

goto-follow closureは、IELR(1)のlookahead計算で使う、GOTOごとのfollow集合とその依存関係の推移閉包。通常の非終端記号の[[follow-set|FOLLOW集合]]よりも、LRオートマトンの状態を細かく区別する。

## goto-follow set

GOTO遷移を次のように表す。

~~~text
g = GOTO(state_i, A) -> state_j
~~~

この特定のGOTO gの直後に、構文的に現れ得る終端記号の集合がgoto-follow set。

~~~text
goto_follow(g) = { gの直後に現れ得るtoken }
~~~

文法全体で計算するFOLLOW(A)ではなく、どの状態からどの非終端記号へ遷移したかに依存する。したがって、同じ非終端記号AへのGOTOでも、状態が違えばgoto-follow setが違うことがある。

## followの依存関係

goto-follow setには、主に2種類の情報が入る。

1つ目は、GOTOの遷移先から見える終端記号。

~~~text
state_i --A--> state_j --"+"--> state_k
~~~

この場合、+はGOTO(state_i, A)のgoto-follow setに入る。遷移先でnullableな非終端記号を通過できる場合は、その先のGOTOのfollowも引き継ぐ。

~~~text
state_i --A--> state_j --B--> state_k --"+"--> ...
                         B => ε
~~~

この関係はsuccessor dependencyやread dependencyとして扱われる。直接終端記号へ進む場合だけでなく、nullableな非終端記号を経由する間接的な依存も含む。

2つ目は、生成規則の残りがnullableな場合に、GOTOの前にあるitemのlookaheadからfollowが伝わる関係。これは前方のGOTOのlookaheadが、現在のGOTOのfollowに影響するpredecessor dependencyやinclude dependencyとして現れる。

## closureの計算

GOTOを頂点、followの依存関係を辺とするグラフを考える。あるGOTOから出発して、依存するGOTOを繰り返したときに到達できる終端記号を集めたものがgoto-follow closure。

論文では、successor dependencyをたどるclosureと、internal・predecessor dependencyをたどるclosureを組み合わせて完全なgoto_followsを計算する。単に依存グラフの全ての辺を順番にたどればよいわけではなく、nullable性と、どの状態の経路から来た依存かを保つ必要がある。

ここでいうclosureは、LR itemに新しいitemを追加する通常のLR item closureとは違う。GOTO間のfollow依存関係を固定点まで広げるグラフ計算を指す。

## IELRでの用途

LALRのlookaheadは、状態マージの影響で異なる文脈の情報が混ざることがある。IELRはCanonical LR(1)に近いlookaheadの正確さを保つため、どのGOTOとlookaheadの依存関係がconflictへ寄与したかを調べる。

goto-follow closureは、その調査で使うlookaheadの供給元を計算する。そこから[[lane-annotations|lane annotations]]を作り、どの状態を分割すべきかを判断する。

## 出典

- [The IELR(1) algorithm](https://malloy.people.clemson.edu/publications/papers/scp09/scp09.pdf)
- [IELR(1) parser tables](https://core.ac.uk/download/pdf/82047055.pdf)
- [LR Table Construction](https://www.gnu.org/software/bison/manual/html_node/LR-Table-Construction.html)
