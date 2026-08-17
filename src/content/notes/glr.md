---
created: 2026-08-17
updated: 2026-08-17
---

# GLR

#parser #compiler #lr #glr

GLR（Generalized LR）は、LRパーサーで複数の操作候補が残ったときに、候補ごとに解析を分岐させる構文解析方式。

通常のLRパーサーは、[[parsing-table|構文解析表]]の各セルに1つの操作を決めておく。未解決の[[conflict|conflict]]があると、どちらか一方を選ぶ必要がある。GLRでは、未解決の[[conflict|shift/reduce conflict]]や[[conflict|reduce/reduce conflict]]に到達したとき、パーサースタックを分岐させて複数の候補を追跡する。

入力を読み進めるうちに構文エラーになったスタックは捨て、同じ状態に到達したスタックはまとめる。曖昧な文法では、複数の解析木や意味値を後段へ渡せる。

```text
expr -> expr "+" expr
      | ID
```

`ID + ID + ID`は、`(ID + ID) + ID`と`ID + (ID + ID)`の2通りに解析できる。通常のLRではshift/reduce conflictになるが、GLRでは2つの候補を並行して追跡できる。

GNU Bisonでは文法に`%glr-parser`を指定する。Menhirでは`--GLR`バックエンドを使い、生成されたOCamlコードを`MenhirGLR`ライブラリと組み合わせる。分岐中の[[semantic-action|semantic action]]もReduce時に実行される。候補ごとの処理が混在しうるため、副作用は避けるのが安全。

GLRは「どの解釈が正しいか」を自動的に決める方式ではない。複数の解析結果を残すのか、merge functionや優先順位で1つにまとめるのかは文法側で指定する。

## 出典

- [GLR Parsers](https://www.gnu.org/software/bison/manual/html_node/GLR-Parsers.html)
- [Generalized LR Parsing](https://www.gnu.org/software/bison/manual/html_node/Generalized-LR-Parsing.html)
- [GLR Semantic Actions](https://www.gnu.org/software/bison/manual/html_node/GLR-Semantic-Actions.html)
- [Menhir Reference Manual](https://gallium.inria.fr/~fpottier/menhir/manual.html)
