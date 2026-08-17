---
created: 2026-08-18
updated: 2026-08-18
---

# syan

#rust #parser #compiler #proc-macro

syanは、Rustの型定義からparserを導出するparser crate。READMEの説明は「syntax treeを宣言するとparserが導出される」というもの。

文法ファイルからCやRustのparserを生成する[[syntax-analysis-and-parser-generators|parser generator]]ではない。Rustのstruct・enumとderive macroを使って、入力をどの型へ組み立てるかを宣言する。syn crateを手書きのparser実装なしで使えるようにする方向の設計。

## 型のフィールド順が文法になる

structのフィールドを順番に並べると、その順番が入力を読む順番になる。enumのvariantは選択肢で、上から順番に試される。

~~~rust
use syan::parse::Parse;
use syan::literal::Integer;
use syan::symbol::Token;

#[derive(Parse)]
struct Assign<S, V> {
    name: Token![S => x],
    eq: Token![S => =],
    value: V,
}

let assign: Assign<_, Integer> = Parse::parse("x = 1").unwrap();
~~~

このstructは、x、=、整数の順に入力を消費する。nameとeqは、値を使うためのfieldというより、構文上のtokenを型に含めるfield。parserの結果は、[[ast|AST]]へsemantic actionで変換する前の、構文に対応した値として扱える。

structのfieldに何を置くかで、parserの動作が変わる。Optionは任意、Vecは繰り返し、Punctuatedは区切り付きの繰り返し、GroupParenなどはdelimited group、Unorderedは二つのfieldの順序を許す。JointとAttemptは、それぞれtoken間のspacingと失敗時のrollbackを指定する。

## ParseStreamとbacktracking

Parse traitの中心は、入力を受け取って値を返すparse_streamメソッド。

~~~text
Parse::parse(source)
    ↓
IntoParseStream
    ↓
ParseStream
    ↓
Parse::parse_stream(&mut stream)
~~~

ParseStreamは、次のatomを読むnext、先読みするpeek、読み戻すpush、checkpoint、rollback、commitを持つ。dupはparserをtransactionとして実行し、失敗したら消費したatomをrollbackし、成功したらcommitする。

標準のString入力では1文字のchar、proc_macro2入力ではTokenTreeがatomになる。Tapeがiteratorの結果とcheckpointの位置を保持するため、one-shot iteratorでもrollbackできる。checkpointが開いていない間は読み終えたatomを保持しない設計になっている。

## atomを抽象化する

syanのparserは、入力のatomをcharに固定しない。sourceとParseStreamがAtomを決めるため、同じParseの型を異なる入力表現へ適用できる。

- String・&str — 1文字ずつのchar。line、column、char offsetのspanが付く
- bytes — byte列を読むsource
- proc_macro2::TokenStream — TokenTreeを読むsource

proc_macro2対応はdefault featureだが、optional feature。これを外せば、proc-macro2に依存せず、textとbyteのsourceだけを使える。

proc_macro2のsourceでは、括弧などのdelimited groupが一つのTokenTreeとして渡される。GroupParenの中身は、#[group]を付けた別fieldへparseさせる。このため、Rustのproc macro入力を扱うときに、括弧のtokenを一つずつ手で処理しなくてよい。

## Unparseとspan

Parseの逆方向にはUnparseがある。#[derive(Unparse)]を付けると、値をatomのsinkへ書き戻せる。proc_macro2::TokenStreamをEmitterにすれば、構文値からproc macroの出力TokenStreamを作れる。

tokenやliteralはspanを持ち、Parseの結果にも入力の位置が残る。Spanは型parameterなので、text sourceとproc_macro2 sourceで同じ構文型を使い、sourceごとのspan型を選べる。

ただし、これは入力文字列を完全に保存する[[lossless-syntax-tree|lossless syntax tree]]とは別の設計。text sourceの空白はParseStreamのseparatorとして扱われ、Parseの結果に元の空白やコメントがそのまま格納されるわけではない。Unparseは値をatom列へ戻す処理。

## 相互再帰

相互再帰するAST型には、moduleへ#[recurse]を付ける。

~~~rust
#[recurse]
mod ast {
    #[derive(Parse)]
    pub enum Expr<S> {
        Neg {
            minus: Token![S => -],
            inner: Box<Expr<S>>,
        },
        Lit(Integer),
    }
}
~~~

通常のderiveだけで相互再帰する型のParse実装を生成すると、型のtrait boundが循環する。syanの#[recurse]は、型参照グラフからcycleを見つけ、Parse・Unparse・Spannedの実装を[[decycle|decycle]]へ渡して、この循環したobligationを処理する。

デフォルトのranked engineは、compile-timeのtrait obligationをrankで切り、runtimeでは自然な再帰型としてparseする。#[recurse(structural)]はcompile-time unrollを使い、runtime registryを使わない代わりに対応範囲が狭い。

いずれも再帰下降parserなので、型の再帰と文法の左再帰は別に考える必要がある。BoxやVecなどで有限サイズになる型は扱えるが、左再帰の文法をそのまま書くとparserが再帰し続ける。

## Visitor

parserの導出とは別に、#[derive(Ast)]とvisitor!がある。Ast deriveでnodeを登録し、#[subast]で到達可能な別のnode型を指定して、visit・visit_mutのtraversalを生成する。

つまりsyanは、入力を型へ組み立てるParse、型をatomへ戻すUnparse、構築した型を走査するVisitorを別々のderiveとして持つ。parserが[[semantic-less|semantic-less]]な構文データを作り、後段で意味を解釈する形にしやすい。

## synとの違い

synでは、構文型を定義したあと、Parse traitの実装で入力の読み方を手書きする。syanでは、構文型のfield順やfield typeが読み方になる。

この差は、parser combinatorのようにparser値を組み合わせるか、型を中心にparserを組み立てるかの差でもある。syanでは、parserの定義と構文データの型が同じ場所に集まる。一方で、複雑な曖昧性や型から直接表せない文法は、field attributeや独自のParse実装が必要になる。

## 出典

- [syan README](https://github.com/yasuo-ozu/syan/blob/main/README.md)
- [Parse・Unparse・Spannedのtrait定義](https://github.com/yasuo-ozu/syan/blob/main/core/src/decycle_traits.rs)
- [ParseStream](https://github.com/yasuo-ozu/syan/blob/main/core/src/parse/parse_stream.rs)
- [入力source](https://github.com/yasuo-ozu/syan/tree/main/core/src/source)
- [derive macroとrecurse macro](https://github.com/yasuo-ozu/syan/blob/main/macro/lib.rs)
- [syan crate documentation](https://docs.rs/syan/latest/syan/)
