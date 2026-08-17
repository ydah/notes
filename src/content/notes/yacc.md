---
created: 2026-08-17 21:20
updated: 2026-08-17
---
# Yacc

#unix #parser #compiler #lr

「Yet Another Compiler-Compiler」。Bell LaboratoriesのStephen C. Johnsonが1970年代に開発したパーサージェネレータ。入力構造を文法規則として記述し、規則を認識したときに実行するactionを添えて、[[parser|構文解析器]]のサブルーチンを生成する。[[lr-parser|LRパーサー]]と[[lexical-analyzer|字句解析機]]の組み合わせが、UNIX上のコンパイラ実装で広く使われるようになった。

## 仕組み

Yaccの文法ファイルには、tokenを返す[[lexical-analyzer|字句解析機]]、文法規則、規則に対応するactionを用意する。Yaccは文法からパーサーを生成し、字句解析機からtokenを受け取り、規則を認識するとactionを実行する。

初期のYaccはLALR(1)文法と、曖昧さを解消するための規則を扱った。演算子の優先順位や結合方向を宣言でき、[[shift-reduce-parsing|shift/reduce構文解析]]で起きるshift/reduce conflictやreduce/reduce conflictを報告する。

## 生成物

UNIX版Yaccでは、Cのパーサー実装を`y.tab.c`として生成し、そこに`yyparse`を含める。tokenを返す`yylex`、エラー処理を行う`yyerror`、アプリケーションの`main`などは利用者が用意する。

`-v`を指定すると`y.output`にパーサーテーブルとconflictの情報が出る。文法を修正するときは、この状態ごとの出力を読むことになる。

## 後継

Yaccの文法形式とインターフェースは、GNU Bison・Berkeley Yacc・各種言語向けのyacc系ツールへ引き継がれている。[[gnu-bison|GNU Bison]]はYacc互換を保ちながら、IELR・Canonical LR・GLRなどを追加した実装。

## 出典

- [Yacc: Yet Another Compiler-Compiler - Stephen C. Johnson](https://ptacts.uspto.gov/ptacts/public-informations/petitions/1464894/download-documents?artifactId=1-JLgkGy2J9B2fZiIxl8i77_SrLKIO182215d8EtRfi1OuF2apZUdic)
- [UNIX System V yacc manual](https://www.bitsavers.org/pdf/att/unix/System_V_386_Release_3.1/386_UNIX_System_V_Release_3.1_Programmers_Reference_Manual_1987.pdf)
