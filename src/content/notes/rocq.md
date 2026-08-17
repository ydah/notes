---
created: 2026-08-17
updated: 2026-08-17
---

# Rocq

#rocq #formal-verification #proof-assistant #parser #menhir

定義・プログラム・定理を記述し、機械検査可能な証明を構築するproof assistant。Rocq自体はパーサージェネレータではない。

Menhirでは、生成したパーサーが文法に対して正しいことを検査するバックエンドとして使われる。`--rocq`を指定すると、Rocqの[[semantic-action|semantic action]]を含む`.vy`ファイルから`.v`ファイルを生成する。

```sh
menhir --rocq parser.vy
```

```text
parser.vy -> parser.v
```

生成されたRocqコードには、Menhirが構築したLR(1)オートマトンだけでなく、パーサーが文法に対してcorrectかつcompleteであることを確認する証明も含まれる。

```text
パーサーが入力を受理した
    ⇒ 入力は文法が生成する文である

入力が文法上正しい
    ⇒ 十分なfuelがあればパーサーが受理する
```

通常のMenhirがOCamlのパーサーを生成するのに対して、Rocqバックエンドはパーサーとその性質の証明を生成する。証明はRocqのkernelで検査されるため、生成コードのテストだけでは確認しにくい文法と実装の対応を形式化できる。

ただし、Menhirの完全性証明はconflict（benign conflictを含む）がない文法でのみ生成できる。必要なら`--rocq-no-complete`で完全性証明の生成を無効にする。

Rocqバックエンドは、曖昧な文法への対応やパーサーの高速化が目的ではない。[[semantic-action|semantic action]]もRocqで書く必要があり、通常のOCaml向けバックエンドより制約が多い。

## 出典

- [Menhir Reference Manual](https://gallium.inria.fr/~fpottier/menhir/manual.html)
- [Rocq Documentation](https://rocq-prover.org/docs)
- [Rocq Reference Manual](https://docs.rocq-prover.org/master/refman/)
