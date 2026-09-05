---
created: 2026-08-18
updated: 2026-08-18
---

# predecessor dependency

#parser #compiler #lr #ielr

predecessor dependencyは、IELR(1)のgoto-follow計算で使うGOTO間の依存関係の1つ。あるGOTOのfollow setが、現在のstateより前にあるGOTOやitemのlookaheadに依存する関係である。

## GOTOのfollowへの依存

GOTOを次のように表す。

~~~text
g = GOTO(state_i, A) -> state_j
~~~

gのitemでAの後ろにある記号列がnullableなら、Aの前の文脈から来たlookaheadがgのfollowに伝わる。このlookaheadを供給するGOTOがgのsource stateより前にあれば、その依存がpredecessor dependencyになる。

~~~text
state_p --α--> state_i --A--> state_j
      └─ g'             └─ g

g の follow が g' の follow に依存する
~~~

ここでstate_pは必ずしも一つ前のstateではない。依存経路が複数の遷移を含む場合、state_pはeventual predecessor（最終的な先行state）になる。

論文では、goto-followのincludes関係に現れる経路の記号列をαとすると、αが空でない場合をpredecessor dependencyと定義している。αが空なら同じstate内の[[internal-dependency|internal dependency]]になる。

## internal dependencyとの違い

両者とも、生成規則の残りがnullableなために別のfollow setを参照する。違いは、依存経路がsource stateをまたぐかどうかにある。

- internal dependency — 同じstate内で依存が完結する
- predecessor dependency — 別のstateを通り、eventual predecessorにあるGOTOへ依存する

この2種類は、goto-follow計算では一つのGFip依存関係としてまとめて閉包を計算できる。ただしsuccessor dependencyとは分けて扱う。[[goto-follow-closures|goto-follow closures]]では、internal・predecessorの閉包を先に計算し、その後でsuccessor側のfollowを加える。

## laneを混ぜないための制約

異なるlaneが一つのLALR stateに合流すると、predecessor dependencyを通じて異なる文脈のlookaheadが同じfollow setに入ることがある。

例えば、次の文法では、Sの2つの生成規則から来たlaneが途中で合流する。

~~~text
S -> aAa
S -> bAb
A -> cD
D -> ε
~~~

Dのfollowにはaとbの両方が必要になる。一方、合流前のa側のlaneにbを、b側のlaneにaをそのまま戻すと、実際には存在しない文脈まで混ざる。

そのため、goto-follow依存関係を単純な無向の到達可能性として扱わない。followの計算では、successor dependencyをたどった後にpredecessor dependencyをたどらない。この制約とlaneの追跡が、[[lane-annotations|lane annotations]]で状態分割箇所を判定する材料になる。

## [[predecessors-table|predecessors表]]との違い

IELRの実装には、あるstateへ遷移するstateを列挙するpredecessors表も登場する。

~~~text
predecessors[s] = { s' : δ(Σ[s'], y) = Σ[s] となるs' }
~~~

これはstateの直接の遷移元を列挙する表である。laneをconflict stateから逆向きにたどるために使う。すべてのpredecessorsがpredecessor dependencyを持つわけではない。

predecessor dependencyは、follow setの依存関係そのもの。predecessors表は、状態機械上の逆向き探索に使う別の情報。

## 状態分割との関係

predecessor dependencyは、先行stateを通るlookaheadの伝播経路を含む。そのため、LALR stateをisocoreごとに分割すると、どの先行stateからどのlookaheadが来るかが変わり得る。

IELRは[[lane-annotations|lane annotations]]を使って先行laneを逆向きに追跡する。同じconflictへの寄与を保てる範囲で、conflict state以外も含めた必要なstateだけを分割する。

## 出典

- [The IELR(1) algorithm](https://malloy.people.clemson.edu/publications/papers/scp09/scp09.pdf)
- [IELR(1) parser tables](https://malloy.people.clemson.edu/publications/papers/sac08/paper.pdf)
