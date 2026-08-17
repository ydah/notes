---
created: 2026-08-18
updated: 2026-08-18
---

# decycle

#rust #compiler #proc-macro #parser

decycleは、Rustで相互再帰するtrait boundを処理するためのattribute macro。通常のtrait solverでは、次のようなimplは循環したobligationになる。

~~~rust
trait Evaluate {
    fn evaluate(&self) -> i32;
}

struct Expr;
struct Term;

impl Evaluate for Expr
where
    Term: Evaluate,
{
    fn evaluate(&self) -> i32 {
        Term.evaluate()
    }
}

impl Evaluate for Term
where
    Expr: Evaluate,
{
    fn evaluate(&self) -> i32 {
        Expr.evaluate()
    }
}
~~~

ExprのEvaluateを証明するにはTermのEvaluateが必要で、TermのEvaluateを証明するにはExprのEvaluateが必要になる。decycleはtraitやmoduleをmacroで書き換え、循環を有限段数のtrait obligationへ変換する。

## #[decycle]の対象

trait定義、または相互再帰するimplを含むinline moduleに#[decycle]を付ける。module内でcycleに参加するtraitにも#[decycle]を付ける。module外のtraitは、module内の#[decycle] useでcycleに参加させられる。

macroはmodule内の型参照とtrait boundを解析し、cycleに含まれる型・traitだけを変換する。cycleに関係しない通常のitemまで、意味を変えるためのruntime APIではない。

## ranked engine

デフォルトのranked engineでは、cycleにある各traitに、隠れたRanked版のtraitを作る。Rankは再帰の残り段数を表す型parameter。

概念的には次の形。

~~~text
元のtrait A
    ↓ delegate
A_Ranked<Rank>
    ↓ obligation
B_Ranked<Rankの一段下>
    ↓
有限段数でfloor
~~~

元のtraitのimplをRanked traitにも展開し、再帰するboundを一段下のRankへ向ける。同じRankを直接要求しないので、Rust compilerは循環そのものではなく、有限の型の段階としてobligationを解ける。

recurse_levelはcompile-timeに展開する段数。current implementationではranked engineのデフォルト値が10で、support_infinite_cycleがtrueならfloorで停止せず、元のtrait実装へre-entryする。

unbounded modeのre-entryにはthread-localなfunction pointer registryを使う。各threadの再帰呼び出しが自分の登録を参照するため、compile-timeのrankを越えた実行時の再帰も続けられる。これは再帰の深さを制限する機能ではないので、終了しないcycleは通常の再帰と同じくstack overflowになる。

support_infinite_cycleをfalseにするとruntime registryは生成されない。その代わり、実行時の再帰がrecurse_levelのfloorに達すると、cycle limitに到達した処理として停止する。runtime costを増やさない代わりに、深さに制限がある。

## structural engine

#[decycle(structural)]は、ranked traitとruntime registryを使わず、compile-timeにcycleをunrollする別方式。

cycle memberごとに、自然な型と同じlayoutの#[repr(transparent)]なterminator wrapperを生成する。trait実装のreceiverをwrapper側と自然な型側で対応させ、有限の展開でtrait obligationをcycleの外へ出す。

この方式はruntime machineryが不要で、READMEではzero-costの方式として説明されている。一方、対応できる型・method signatureの範囲はranked engineより狭く、構造的に扱えない形はcompile-time errorになる。structuralにrecurse_levelやsupport_infinite_cycleを渡すことはできない。

二つのengineは、cycleを切るという目的は同じでも、実装上のtrade-offが違う。

- ranked — generic methodの複数instantiationをまたぐre-entryなどを扱いやすい。unbounded modeではthread-local registryのcostがある
- structural — runtime costがない。代わりに、対応する型の形やmethod signatureに制約が多い

## なぜparserで使うのか

再帰下降parserの構文型は、ExprがTermを持ち、括弧付きのExprがさらにExprを持つように、型の参照がcycleになることがある。

syanでは、#[recurse] moduleの中に相互再帰するParse実装を置く。syanのmacroはParse・Unparse・Spannedのderiveを展開したあと、cycleに含まれるimplをdecycleへ渡す。decycleはparserの文法を解析するのではなく、生成されたRustのtrait obligationを変換している。

したがって、decycleは[[syntax-analysis-and-parser-generators|parser generator]]でも、[[mutual-recursion|相互再帰]]する文法をLR parserへ変換するアルゴリズムでもない。Rustの型・trait実装のcycleを、macro expansionの段階で扱う部品。

## 制約

decycleが解くのはcompile-timeのtrait obligationのcycle。自然なデータ型が有限サイズになることや、実行時の関数再帰が終了することまでは保証しない。

現在の実装では、cycle全体を一つのinline moduleに置く必要がある。cycleに含まれるtraitはdecycleが認識できる形で注釈されていなければならず、外部traitや外部型の組み合わせにも制限がある。

ranked engineのunbounded modeでは、closureやasync blockのようなanonymous typeをgeneric methodのcycleに渡せない場合がある。structural engineにも、Selfを含むimpl Traitやasync fnなど、layoutを保った変換ができないsignatureの制約がある。

これは一般のtrait cycleを意味論的にcoinductionする機能ではない。macroが認識できる型参照グラフを解析し、対応するtrait実装をrankedまたはstructuralな形へ書き換える仕組み。

## syanとの関係

[[syan|syan]]は、#[recurse]を自前でtrait obligationのcycleを解くmacroとして実装せず、decycleを内部で利用している。syan側の#[recurse]は、型参照のcycleを見つけ、Parse・Unparse・Spannedのderive結果をdecycleの入力へ整形するfront end。

この分離により、syanは「構文型からparserを導出する」ことに集中し、相互再帰したimplのtrait boundをどうコンパイル可能にするかはdecycleに任せられる。

## 出典

- [decycle README](https://github.com/yasuo-ozu/decycle/blob/main/README.md)
- [decycleの公開APIとengineの説明](https://github.com/yasuo-ozu/decycle/blob/main/lib.rs)
- [decycle attribute macro](https://github.com/yasuo-ozu/decycle/blob/main/macro/lib.rs)
- [decycle documentation](https://docs.rs/decycle/latest/decycle/)
- [syanのrecurse macro](https://github.com/yasuo-ozu/syan/blob/main/macro/recurse.rs)
