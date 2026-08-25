---
created: 2026-08-25
updated: 2026-08-25
---

# seccomp user notify

#linux #kernel #security #seccomp

seccomp user notifyは、seccomp filterが特定のシステムコールをユーザー空間のsupervisorへ通知し、supervisorがそのシステムコールの扱いを返す仕組み。filterのactionとして`SECCOMP_RET_USER_NOTIF`を使う。

通常のseccompでは、filterがシステムコールをその場で許可・拒否する。user notifyでは、ポインタの指すメモリをfilter自身が読めないという制約を越えて、supervisorが対象プロセスの情報を調べたり、対象プロセスの代わりに処理を行ったりできる。

## 基本的な流れ

対象プロセスをtarget、通知を受け取るプロセスをsupervisorと呼ぶ。

~~~text
target
  seccomp filter
      │ USER_NOTIF
      ▼
  listener fd ─────────→ supervisor
                              │
                NOTIF_RECV    │ システムコールを調べる
                NOTIF_SEND    │
                              ▼
                         targetへ返り値
~~~

1. targetが`SECCOMP_FILTER_FLAG_NEW_LISTENER`付きでfilterをインストールする。
2. `seccomp()`がlistener file descriptorを返す。
3. targetとsupervisorの間で、そのfdを渡す。Unixドメインソケットの`SCM_RIGHTS`などを使える。
4. filterが`SECCOMP_RET_USER_NOTIF`を返すシステムコールをtargetが呼ぶ。
5. targetはカーネル内で一時停止し、listener fdに通知が生成される。
6. supervisorが`SECCOMP_IOCTL_NOTIF_RECV`で`struct seccomp_notif`を受け取る。
7. supervisorが処理を決め、`SECCOMP_IOCTL_NOTIF_SEND`で`struct seccomp_notif_resp`を返す。

listener fdは特定のスレッドだけに紐づくfdではなく、filterに紐づく。targetがforkすると、そのfilterを共有するプロセスからの通知も同じfdに届く。

## supervisorの応答

supervisorは、targetのシステムコールを実際には実行せず、成功またはエラーの返り値だけをtargetに返せる。

`struct seccomp_notif_resp`の`val`は成功時の返り値、`error`はエラー番号、`id`は受け取った通知と対応付けるための値。targetのシステムコールをカーネルで続行させる場合は`SECCOMP_USER_NOTIF_FLAG_CONTINUE`を使う。

supervisorがtargetの代わりに処理する例として、targetからの`mount`やデバイス操作の要求を、より強い権限を持つコンテナ管理プロセスが受け取り、必要な処理を行って結果を返す形がある。

`SECCOMP_IOCTL_NOTIF_ADDFD`を使うと、supervisorが用意したファイルディスクリプタをtargetへ注入できる。ファイルを開く処理をsupervisor側で行い、そのfdをtargetへ渡すような構成に使える。

## `CONTINUE`の注意点

`SECCOMP_USER_NOTIF_FLAG_CONTINUE`は、targetが元々要求したシステムコールをカーネルで実行させる。supervisorがtargetのメモリからポインタ引数を読み、内容を検査してから`CONTINUE`を返す構成にはTOCTOUがある。

通知を受け取った後、supervisorが検査している間にtargetの別スレッドや攻撃者がメモリを書き換えられると、検査した値と、カーネルが実際に使う値が異なる可能性がある。検査対象のデータはsupervisor側へコピーしてから判断するなど、競合を考慮する必要がある。

このため、seccomp user notifyはセキュリティポリシーを実装するための機構ではない。特権の低いtargetの処理を、より特権の高いsupervisorが代行する用途が基本で、`CONTINUE`するなら別の仕組みかカーネル自身が最終的に安全性を保証する必要がある。

また、別のfilterが`SECCOMP_RET_USER_NOTIF`より高い優先度のactionを返す場合、supervisorには通知されない。user notifyを設定したことだけで、すべての対象システムコールを監視できるわけではない。

## 通知構造体

通知と応答は、カーネルのバージョンによって構造体が拡張される可能性がある。そのため、supervisorは`SECCOMP_GET_NOTIF_SIZES`で`struct seccomp_notif`などのサイズを確認してからバッファを確保する。

`struct seccomp_notif`には通知のID、targetのスレッドID、filterが見ていた`struct seccomp_data`が含まれる。`struct seccomp_data`からシステムコール番号とレジスタ上の引数を取得できるが、ポインタの指す内容そのものは含まれない。

## seccomp filterとの違い

[[seccomp|seccomp]] filterは、カーネル内で完結する高速な許可・拒否に向いている。user notifyは、ユーザー空間の状態やtargetのメモリを調べて、targetの代わりに処理する必要がある場合に使う。

その分、通知の受信・判断・応答が必要になり、targetのシステムコールはsupervisorの応答まで停止する。supervisorが終了した場合やlistener fdが閉じられた場合、`USER_NOTIF`のシステムコールは`ENOSYS`になる。

## 出典

- [Userspace notification - The Linux Kernel documentation](https://www.kernel.org/doc/html/latest/userspace-api/seccomp_filter.html#userspace-notification)
- [seccomp_unotify(2)](https://man7.org/linux/man-pages/man2/seccomp_unotify.2.html)
- [seccomp(2)](https://man7.org/linux/man-pages/man2/seccomp.2.html)
