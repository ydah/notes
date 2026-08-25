---
created: 2026-08-25
updated: 2026-08-25
---

# Endpoint Security

#macos #security #endpoint-security #system-extension

AppleのEndpoint Securityは、macOS上で起きるセキュリティ関連のシステムイベントを監視し、必要なイベントを承認・拒否するためのC API。プロセスの実行、ファイルシステムのマウント、プロセスのfork、シグナル送信などを対象にできる。

EDR、アンチウイルス、DLP、実行ファイルの監視やファイルアクセスの監査など、macOSの動作を観測してセキュリティポリシーに反映するソフトウェアで使われる。

## どこで動くか

Endpoint Securityを使うプログラムは、通常のアプリの権限だけで動く単純な監視プロセスではなく、Endpoint Security用のsystem extensionとして構成する。

system extensionはカーネルのアドレス空間で動くkextとは異なり、ユーザー空間で動く。Endpoint Securityのsystem extensionはカーネルからイベントを受け取り、ユーザー空間のプロセスとして監視や承認の処理を行う。

~~~text
macOS kernel
      │
      │ system event
      ▼
Endpoint Security subsystem
      │
      ▼
Endpoint Security client
  (system extension / user space)
      │
      ├─ eventを記録する
      └─ auth eventにallow / denyを返す
~~~

アプリとsystem extensionをアプリバンドルに含め、System Extensions frameworkでインストール・更新する。Endpoint Securityの利用にはcom.apple.developer.endpoint-security.client entitlementが必要で、このentitlementはAppleへ申請する。

## clientのライフサイクル

Endpoint Security clientは、おおむね次の順番で使う。

1. es_new_clientでEndpoint Security subsystemへ接続する。
2. es_subscribeで監視したいイベントの種類を登録する。
3. callbackでes_message_tを受け取る。
4. auth eventならes_respond_auth_resultなどでallowまたはdenyを返す。
5. 終了時にes_delete_clientでclientを破棄する。

最初のclient作成に失敗する理由として、entitlement不足、rootとして実行されていない、TCCによって許可されていない、同時接続client数の上限超過などがある。es_new_clientの結果を見て、recoverableな許可不足と実装・設定ミスを分ける必要がある。

## auth eventとnotify event

Endpoint Securityのイベントには大きく、発生前に判断するauthorization eventと、発生後に通知されるnotification eventがある。

- ES_EVENT_TYPE_AUTH_* — 対象操作を進めてよいか、clientがallowまたはdenyを返す
- ES_EVENT_TYPE_NOTIFY_* — すでに発生した操作の情報を受け取る。監査や検知に向く

例えば、ES_EVENT_TYPE_AUTH_EXECを購読すると、プロセスのexecを許可するか判断できる。callbackでイベントを受け取ったあとに応答しないままdeadlineを過ぎると、clientに設定されたdeadline miss modeに従って処理される。承認イベントの処理は、重い解析をその場で行わず、期限内に応答できる構成にする必要がある。

## イベントの購読

イベントの購読は、イベント種別の配列をes_subscribeに渡して行う。

~~~c
es_event_type_t events[] = {
    ES_EVENT_TYPE_AUTH_EXEC,
    ES_EVENT_TYPE_NOTIFY_FORK,
};

es_subscribe(client, events, 2);
~~~

実際には、client作成時に渡したhandlerでmessage->event_typeを確認し、イベントごとのデータを読む。auth eventとnotify eventでは必要な処理が異なるため、同じhandlerで受けても、最後の応答処理を一律にしない。

## authorizationの流れ

AUTH_EXECのようなauthorization eventでは、カーネル側の操作が保留され、clientが応答してから処理が続く。

~~~text
プロセスがexecを要求
        ↓
Endpoint SecurityがAUTH_EXECを生成
        ↓
clientのhandlerがイベントを評価
        ↓
es_respond_auth_result(ALLOW / DENY)
        ↓
execを実行、または拒否
~~~

allowまたはdenyの判断に必要な情報は、es_message_tのeventごとのデータから取得する。署名情報、実行ファイルのパス、親プロセス、audit tokenなどを組み合わせて判断する構成が考えられる。

## notify eventの流れ

notify eventは、対象操作がすでに発生したあとで情報を受け取る。操作を止める必要がないため、認識・監査・統計・検知の用途に向く。

auth eventと同じようにイベントを購読するが、notify eventに対してauthorization responseを返すものではない。イベントの種類を見て、必要な情報を保存したり、別の処理キューへ渡したりする。

## client実装で気をつけること

### handlerを詰まらせない

authorization eventはclientの応答を待っている。ファイルI/O、ネットワークアクセス、重いハッシュ計算、外部プロセスの起動などをhandler内で同期的に行うと、deadlineを超える可能性がある。

イベントを受け取ったら、期限内に必要な応答を返し、詳細な記録や分析は別スレッド・別プロセスへ渡す設計にする。allow / denyの判断に必要な情報と、後から記録すればよい情報を分ける。

### 購読範囲を絞る

購読するイベントを増やすほど、clientに届くメッセージ数と処理量が増える。最初からすべてのイベントを購読するのではなく、目的に必要なAUTH_*とNOTIFY_*だけを選ぶ。

### policyと観測を分ける

authorization eventで操作を止めるpolicy判定と、notify eventを使った監査・検知は別の処理として考える。後者の処理が遅くなっても、前者の応答期限に影響しないようにする。

## kextとの違い

kextはカーネル内で実行されるため、カーネルのクラッシュやメモリ破壊がシステム全体に影響する。system extensionはユーザー空間で実行されるので、以前kextが担っていた種類の機能を、カーネルの外側で実装できる。

Endpoint Securityは「任意のカーネルコードを実行するAPI」ではなく、macOSが公開するイベントと応答の境界を使う仕組み。監視対象や応答方法はEndpoint Securityのイベント型・message型・APIに従う。

## 出典

- [Endpoint Security](https://developer.apple.com/documentation/endpointsecurity)
- [Client](https://developer.apple.com/documentation/endpointsecurity/client)
- [es_event_type_t](https://developer.apple.com/documentation/endpointsecurity/es_event_type_t)
- [com.apple.developer.endpoint-security.client](https://developer.apple.com/documentation/bundleresources/entitlements/com.apple.developer.endpoint-security.client)
- [System Extensions](https://developer.apple.com/documentation/systemextensions)
