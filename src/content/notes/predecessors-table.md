---
created: 2026-08-18
updated: 2026-08-18
---

# predecessors表

#parser #compiler #lr #ielr

predecessors表は、LR automatonで各stateへ直接遷移してくるstateを記録する表。IELRでは、conflict stateから開始stateの方向へlaneを逆向きにたどるために使う。

## 定義

state集合をΣ、state間の遷移関数をδとすると、state sのpredecessorsは次の集合。

~~~text
predecessors[s] = { s' : ∃ y, δ(Σ[s'], y) = Σ[s] }
~~~

つまり、あるsymbol yでsへ遷移できるstate s'を全て集める。s'からsへの遷移が一つでもあれば、s'はsのpredecessorになる。

これは「lookaheadがどのGOTOに依存するか」を表す表ではない。[[predecessor-dependency|predecessor dependency]]はfollow setの依存関係、predecessors表はstate machineの直接の逆向き辺を表す。

## IELRでの用途

IELRのPhase 2では、LALR tableで見つかった[[inadequacy|inadequacy]]から逆向きにlaneをたどる。現在のstate sに対してpredecessors[s]を調べれば、sへ到達し得る先行stateを得られる。

逆向きの探索中に、どの先行stateと遷移が問題の[[inadequacy-contribution|inadequacy contribution]]を運んだ可能性があるかを[[lane-annotations|lane annotations]]として記録する。このannotationがPhase 3のstate分割の材料になる。

predecessors表はPhase 2のための補助表であり、stateを分割した後の最終parser runtimeが参照する表ではない。

## predecessor dependencyとの違い

すべての直接の遷移元が、follow計算上のpredecessor dependencyになるわけではない。predecessors表が「どのstateから入れるか」を列挙するのに対し、predecessor dependencyはnullableな記号列を通じて、あるGOTOのfollowが先行laneの情報を必要とすることを表す。

この違いを混同すると、逆向きのlane探索とlookaheadの依存関係の計算を同じものとして扱ってしまう。

## 出典

- [The IELR(1) algorithm](https://malloy.people.clemson.edu/publications/papers/scp09/scp09.pdf)
- [IELR(1) parser tables](https://malloy.people.clemson.edu/publications/papers/sac08/paper.pdf)
