---
created: 2026-08-25
updated: 2026-08-25
---

# seccomp

#linux #kernel #security #sandbox

seccompは、プロセスが発行できるシステムコールをLinuxカーネル側で制限する仕組み。SECure COMPutingの略。使っていないシステムコールを呼べないようにして、プロセスがカーネルに到達できる面積を減らす。

seccompが制限するのはシステムコールの入口であって、ファイルシステムやネットワークなどのポリシー全体ではない。seccompだけで完全なサンドボックスになるわけではなく、必要に応じて他の権限制御やLSMなどと組み合わせる。

## strict modeとfilter mode

古い単純な方式としてstrict modeがある。許可されるシステムコールは`read`、`write`、`_exit`、`sigreturn`だけで、それ以外を呼ぶとスレッドが終了する。用途が限定されるため、通常はfilter modeを使う。

filter modeでは、BPFプログラムがシステムコールごとに実行される。BPFプログラムは`struct seccomp_data`を読み、システムコール番号、アーキテクチャ、命令ポインタ、最大6個の引数を見て、カーネルに取るべきactionを返す。

~~~text
システムコール
      ↓
struct seccomp_data
      ↓
BPF filter
      ↓
KILL / TRAP / ERRNO / USER_NOTIF / ALLOW ...
~~~

filter modeを無特権プロセスから有効にする場合、先に`PR_SET_NO_NEW_PRIVS`を設定する。そうでなければ、悪意のあるfilterを付けたままset-user-IDプログラムを`execve`するような使い方ができてしまう。` CAP_SYS_ADMIN `を持つ場合はこの条件が別扱いになる。

## filterのaction

filterの返り値には、システムコールをどう扱うかを表すactionと、actionに渡すデータが含まれる。代表的なactionは次の通り。

- `SECCOMP_RET_ALLOW` — システムコールを実行する
- `SECCOMP_RET_ERRNO` — システムコールを実行せず、指定したerrnoを返す
- `SECCOMP_RET_KILL_PROCESS` — プロセスを終了する
- `SECCOMP_RET_KILL_THREAD` — 呼び出し元のスレッドを終了する
- `SECCOMP_RET_TRAP` — `SIGSYS`を送る
- `SECCOMP_RET_LOG` — 記録してから実行する
- `SECCOMP_RET_USER_NOTIF` — [[seccomp-user-notify|seccomp user notify]]でユーザー空間のsupervisorへ通知する

filterは重ねてインストールできる。複数のfilterがあるときはすべて評価され、最も優先度の高いactionが採用される。後から追加したfilterのデータが使われる場合があるので、単純に「最後のfilterが結果を上書きする」と考えない。

## allow-list

実用上は、必要なシステムコールだけを許可するallow-list方式が扱いやすい。deny-list方式は、新しい危険なシステムコールや既存システムコールの危険なフラグが増えたときに更新漏れが起きる。

filterではシステムコール番号だけでなく、アーキテクチャも確認する必要がある。同じマシン上で複数のシステムコールABIが使える場合、番号だけを見たfilterは別ABI経由で迂回される可能性がある。

## 親子プロセスとexecve

filterが`fork`や`clone`を許可している場合、子プロセスにも同じシステムコール制限が引き継がれる。`execve`後も既存のfilterは保持される。

filterを後から追加すると、システムコールごとに評価する処理が増える。その代わり、実行中のプロセスを段階的にさらに制限できる。

## seccompの位置づけ

seccompの主な目的は、アプリケーションが使う必要のないカーネル機能を露出させないこと。プロセスがすでに開いているファイルディスクリプタや、システムコール以外で完結するカーネル機能まで一律に消す仕組みではない。

seccomp filterのBPFはポインタを追跡して参照できない。システムコール引数のレジスタ値は検査できるが、ポインタが指すユーザー空間メモリの内容をfilter自身が読むことはできない。この制約が、カーネル内のfilter評価を単純に保つ。

そのため、引数の指す文字列や構造体の内容を読んで判断したい場合は、[[seccomp-user-notify|seccomp user notify]]など別の仕組みが必要になる。ただし、ユーザー空間で引数を読んで判断する仕組みにはTOCTOUの注意点がある。

## 出典

- [Seccomp BPF - The Linux Kernel documentation](https://www.kernel.org/doc/html/latest/userspace-api/seccomp_filter.html)
- [seccomp(2)](https://man7.org/linux/man-pages/man2/seccomp.2.html)
