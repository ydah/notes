---
created: 2026-08-19
updated: 2026-08-19
---

# scanner conflict

#lexer #parser #compiler #pslr

scanner conflictは、同じ入力位置でscannerが複数のtoken候補を認識し、tokenizationを一意に決められない状態。

PSLRの論文では、入力文字列をξ、token集合をTとする。ξのprefixで、あるtokenの正規表現に一致する(lexeme, token)の集合をM(ξ, T)と定義する。M(ξ, T)の部分集合のうち、候補を複数含むものがscanner conflictになる。全候補を含むものがcomplete conflict、候補が二つだけのものがpairwise conflict。

候補の違いには二種類ある。

- identity conflict — 同じlexemeが異なるtoken kindに一致する。`int`がkeywordとidentifierの両方に一致する場合など。
- length conflict — 異なる長さのlexemeが候補になる。`>`と`>>`が同じ位置から始まる場合など。同じtoken kindで長さだけが異なる場合はautolength conflictと呼ぶ。

通常のscannerはlength conflictを最長一致で解決し、identity conflictを規則の記述順で解決する。この規則は単独の言語では便利だが、[[composite-language|composite language]]ではparserの状態によって正しい選択が変わることがある。

[[pseudo-scanner|pseudo-scanner]]は、現在のLR stateで受理候補になるtoken集合に絞ってからscannerを動かす。それでも複数候補が残る状態を、PSLRではpseudo-scanner conflictと呼ぶ。parser tableの同じstateに異なる文脈をマージすると、Canonical LRでは分かれていたtoken候補がunionされ、新しいconflictが生じることがある。

parser conflictは、同じtoken列に対してACTION表の複数の動作が競合する問題。scanner conflictは、token列を作る前にtokenの切り方が競合する問題。二つは別の段階で起きるが、一つの文法に同時に存在することはある。

## 出典

- [PSLR(1): Pseudo-Scannerless Minimal LR(1) for the Deterministic Parsing of Composite Languages](https://open.clemson.edu/all_dissertations/519/)
- [PSLR(1) dissertation PDF](https://malloy.people.clemson.edu/publications/papers/jdenny/jdenny.pdf)
