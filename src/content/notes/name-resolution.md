---
created: 2026-08-17
updated: 2026-08-17
---

# 名前解決

#compiler #semantic-analysis #name-resolution

ソースコード中の名前の出現を、その名前が導入された定義へ対応付ける処理。変数、関数、型、モジュール、macroなどについて「この名前はどの定義を指すか」を決める。

~~~text
let value = 1;
{
    let value = 2;
    use(value);
}
~~~

この例の内側のvalueは、外側のvalueではなく内側の定義を参照する。名前解決では、スコープ、import、shadowing、名前の種類ごとのnamespaceなどを考慮する。

名前解決と[[type-inference|型推論]]は別の処理。valueがどの定義を参照するかを決めるのが名前解決で、その定義や式がどの型を持つかを調べるのが型推論・型検査。両方とも[[semantic-analysis|意味解析]]の一部として実装されることが多い。

Rustでは、macro expansionのためにimportとmacro名を先に解決し、AST全体ができたあとにcrate内の名前を解決する。解決処理の結果として、ソース中の名前から対応する定義へのリンクを作る。Rustにはmacro、value、type、lifetimeなど複数のnamespaceがある。

名前解決に失敗すると、未定義の名前や見つからないimportなどのエラーになる。これはtoken列や括弧の対応が壊れている[[syntax-error|構文エラー]]とは異なる。

## 出典

- [Name resolution - Rust Compiler Development Guide](https://rustc-dev-guide.rust-lang.org/name-resolution.html)
- [Name resolution - The Rust Reference](https://doc.rust-lang.org/reference/names/name-resolution.html)
