---
created: 2026-08-17
updated: 2026-08-17
---

# IELR

#parser #compiler #lr #bison

IELRはInadequacy Elimination LRの略。[[lalr-parser|LALR]]に近い状態数を保ちながら、[[canonical-lr-parser|Canonical LR(1)]]と同じ言語認識能力を持つparser tableを構築する方式。

Bisonでは次の指定でIELRを選べる。

```text
%define lr.type ielr
```

Bisonの`lr.type`のデフォルトは`lalr`で、`ielr`と`canonical-lr`にも切り替えられる。

## LALR・Canonical LRとの違い

| 方式 | 状態の扱い | 特徴 |
|---|---|---|
| [[lalr-parser|LALR]] | 同じLR(0) coreの状態をマージ | 小さいが、人工的なconflictが起きることがある |
| IELR | 必要な文脈を区別しながら状態をマージ | [[canonical-lr-parser|Canonical LR]]と同じ認識能力とLALRに近い状態数を持つ |
| [[canonical-lr-parser|Canonical LR]] | 状態をマージしない | 正確だが、状態数とテーブルが大きくなりやすい |

IELRは決定的LRパーサーのtable構築方式。[[glr|GLR]]のように実行時に複数の解析候補を並行して追跡する方式ではない。

[[mysterious-conflict|mysterious conflict]]のように、LALRの状態マージが原因で発生する[[conflict|conflict]]を避けるために使える。Bisonの公式マニュアルでは、IELRは必要な場合だけCanonical LRに相当する状態の区別を残し、それ以外ではLALRに近い表を作る方式として説明されている。

## 他のツールとの関係

IELRはBisonが提供する方式で、Menhirや[[ocamlyacc|ocamlyacc]]に`%define lr.type ielr`を書くものではない。ocamlyaccはLALR(1)を生成し、[[menhir|Menhir]]はLR(1)を扱う。

## 出典

- [LR Table Construction](https://www.gnu.org/software/bison/manual/html_node/LR-Table-Construction.html)
- [Mysterious Conflicts](https://www.gnu.org/software/bison/manual/html_node/Mysterious-Conflicts.html)
- [Bison Reference Manual](https://www.gnu.org/software/bison/manual/)
