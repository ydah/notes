---
created: 2026-08-25
updated: 2026-08-25
---

# Endpoint Security

#macos #security #endpoint-security #system-extension

AppleのEndpoint Securityは、macOS上のセキュリティ関連イベントを監視し、必要なイベントを承認・拒否するC API。プロセスの実行、ファイルシステムのマウント、プロセスのfork、シグナル送信などを対象にできる。

macOSの動作を観測し、セキュリティポリシーへ反映するソフトウェアで使う。用途にはEDR、アンチウイルス、DLP、実行ファイルの監視、ファイルアクセスの監査などがある。

## どこで動くか

Endpoint Securityを使うプログラムは、Endpoint Security用のsystem extensionとして構成する。通常のアプリの権限だけで動く監視プロセスではない。

system extensionは、カーネルのアドレス空間で動くkextと異なり、ユーザー空間で動く。Endpoint Securityのsystem extensionはカーネルからイベントを受け取り、ユーザー空間のプロセスとして監視や承認を処理する。

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

アプリとsystem extensionはアプリバンドルに含め、System Extensions frameworkでインストール・更新する。Endpoint Securityの利用にはcom.apple.developer.endpoint-security.client entitlementが必要。このentitlementはAppleへ申請する。

## clientのライフサイクル

Endpoint Security clientは次の順で使う。

1. es_new_clientでEndpoint Security subsystemへ接続する。
2. es_subscribeで監視したいイベントの種類を登録する。
3. callbackでes_message_tを受け取る。
4. auth eventならes_respond_auth_resultなどでallowまたはdenyを返す。
5. 終了時にes_delete_clientでclientを破棄する。

client作成は、entitlement不足、root権限で実行されていないこと、TCCの許可不足、同時接続client数の上限超過などで失敗する。es_new_clientの結果から、recoverableな許可不足と実装・設定ミスを区別する。

## auth eventとnotify event

Endpoint Securityのイベントは、発生前に判断するauthorization eventと、発生後に通知されるnotification eventに大別できる。

- ES_EVENT_TYPE_AUTH_* — 対象操作を進めてよいか、clientがallowまたはdenyを返す
- ES_EVENT_TYPE_NOTIFY_* — すでに発生した操作の情報を受け取る。監査や検知に向く

ES_EVENT_TYPE_AUTH_EXECを購読すると、プロセスのexecを許可するか判断できる。callbackでイベントを受け取った後、応答せずにdeadlineを過ぎると、clientのdeadline miss modeに従って処理される。承認イベントは、重い解析をその場で行わず、期限内に応答できる構成にする。

## イベントの購読

イベントの購読は、イベント種別の配列をes_subscribeに渡して行う。

~~~c
es_event_type_t events[] = {
    ES_EVENT_TYPE_AUTH_EXEC,
    ES_EVENT_TYPE_NOTIFY_FORK,
};

es_subscribe(client, events, 2);
~~~

client作成時に渡したhandlerでmessage->event_typeを確認し、イベントごとのデータを読む。auth eventとnotify eventは必要な処理が異なる。同じhandlerで受けても、最後の応答処理を一律にしない。

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

allowまたはdenyの判断材料は、es_message_tのeventごとのデータから取得する。署名情報、実行ファイルのパス、親プロセス、audit tokenなどを組み合わせられる。

## notify eventの流れ

notify eventは、対象操作の発生後に情報を受け取る。操作を止める必要がないため、認識・監査・統計・検知に向く。

auth eventと同様に購読するが、notify eventにはauthorization responseを返さない。イベントの種類に応じて、必要な情報を保存するか、別の処理キューへ渡す。

## client実装で気をつけること

### handlerを詰まらせない

authorization eventはclientの応答を待つ。ファイルI/O、ネットワークアクセス、重いハッシュ計算、外部プロセスの起動などをhandler内で同期的に行うと、deadlineを超えうる。

イベントには期限内に応答し、詳細な記録や分析は別スレッド・別プロセスへ渡す。allow / denyの判断に必要な情報と、後から記録する情報を分ける。

### 購読範囲を絞る

購読するイベントを増やすほど、clientに届くメッセージ数と処理量も増える。目的に必要なAUTH_*とNOTIFY_*だけを選ぶ。

### policyと観測を分ける

authorization eventで操作を止めるpolicy判定と、notify eventによる監査・検知は分ける。監査・検知が遅れても、policy判定の応答期限に影響させない。

## kextとの違い

kextはカーネル内で実行されるため、クラッシュやメモリ破壊がシステム全体に影響する。system extensionはユーザー空間で実行され、以前kextが担っていた種類の機能をカーネルの外側で実装できる。

Endpoint Securityは「任意のカーネルコードを実行するAPI」ではない。macOSが公開するイベントと応答の境界を使い、監視対象や応答方法はEndpoint Securityのイベント型・message型・APIに従う。

## 出典

- [Endpoint Security](https://developer.apple.com/documentation/endpointsecurity)
- [Client](https://developer.apple.com/documentation/endpointsecurity/client)
- [es_event_type_t](https://developer.apple.com/documentation/endpointsecurity/es_event_type_t)
- [com.apple.developer.endpoint-security.client](https://developer.apple.com/documentation/bundleresources/entitlements/com.apple.developer.endpoint-security.client)
- [System Extensions](https://developer.apple.com/documentation/systemextensions)
