# ydah notes

`/` は、調べものや AI の調査結果を使い捨てにせず、時間をかけて育てていくエバーグリーンノートのサイト。原子性・概念指向・密度の高いリンクを重視し、Obsidian Publish 風にノート同士をつなぐ。ちゃんとした記事ではなく、自分のためのラフなメモを書く場所とする。

## 技術構成

- Astro の静的サイト。TypeScript strict、Astro Content Collections、Markdown が中心。
- ノートのソースは `src/content/notes/*.md`。`src/pages/` はサイトのページ、`src/components/` はUI、`src/lib/` はノート集計とMarkdown拡張。
- `[[wikilink]]`、`#tag`、バックリンク、TOC、Pagefind検索、Mermaid、KaTeX、Shikiを利用する。
- `design.md` は設計、`setup-guide.md` は構築方針、`README.md` は日常の操作方法。実装を変更するときは必要に応じてこれらと整合させる。

## ノートの設計原則

1. **原子性** — 1ノート1概念。複数の概念を詰め込まず、別ノートに切り出して `[[...]]` でつなぐ。
2. **概念指向** — 出来事の記録や単なる要約ではなく、概念・トピックそのものを主語にする。
3. **密度の高いリンク** — 新しいノートを書く前に `src/content/notes/*.md` を `rg` で検索し、既存の言及を見つけたら双方向の wikilink を検討する。
4. **連想的オントロジー優先** — フォルダ階層で分類せず、`[[...]]` と `#tag` で関連付ける。
5. **自分のために書く** — 前置きや読者への配慮は不要。検証結果、コマンド、具体例を優先する。
6. **追記後は章構成を見直す** — `##` を追加したら、見出しの重複・順序・冗長な繰り返しを確認し、必要なら全体の構成も整える。

## 新しいノートを追加する手順

1. `src/content/notes/` に、英数字とハイフンだけの kebab-case ファイル名で作る（例: `perl-signal-handling.md`）。
2. frontmatter の `title` を使うか、本文の最初に `# タイトル` を置く。日本語タイトルを推奨する。`created` / `updated` は lefthook が補完する。
3. Markdownで書く。コードは言語名付きフェンス（` ```perl ` など）を使う。タグは frontmatter ではなく本文中の `#tag` を正とする。
4. 既存ノートを検索して関連リンク・バックリンクを追加し、必要なら独立ノートとして切り出せる概念をメモする。
5. `npm run dev` で表示を確認する。公開用の静的生成は `npm run build` で行う。`dist/` や `public/pagefind/` などの生成物は編集・コミットしない。
6. コミット時、lefthook の `scripts/update-note-dates.mjs` がステージ済みノートに `created` / `updated` を付与する。フックを通さず日付だけを手で書き換えない。

ノートだけの変更は通常のリポジトリ運用に従って直接反映してよい。Astroコンポーネント、Markdown処理、ビルド設定、Actionsなどコードを変更する場合は、差分を確認し、必要ならブランチとPRを使う。

## Zettelkasten的な相互リンク

- `[[file-name]]` はリンク先ノートのタイトルを表示する。
- `[[file-name|表示テキスト]]` は表示テキストを指定する。
- `aliases` に登録された別名もリンク先として解決される。
- 存在しないリンク先は、ビルド時に `[wikilink]` 警告が出て `wikilink broken` として表示される。警告を無視して公開しない。
- リンクされた側のノートには「🔗 リンクされているノート」としてバックリンクが自動表示される。手動でメンテしない。
- コードブロック・インラインコード・数式内の `[[...]]` はリンクに変換されない。

## ハブノート（MOC）

同じ話題の原子ノートが3つ前後たまったら、MOC（Map of Content）を作ってよい。MOC自身は深掘りせず、配下ノートを `[[...]]` で束ね、それぞれの位置づけや違いを一言でまとめる。

- 配下ノート側からもMOCへリンクし、双方向にする。
- MOCには他のタグと合わせて `#moc` を付ける。

## `#tag` の仕様

- `#` の直後は Unicode の文字で始める。数字・アンダースコア始まりは不可。
- 2文字目以降は Unicode の文字、英数字、`_`、`-` を使える。
- 英字を含むタグは小文字に正規化される。日本語タグは表記を変えない。
- 直前が ASCII 英数字の `foo#bar` はタグにしない。行頭、空白、句読点、括弧の直後は認識する。
- コードブロック・インラインコード・数式内では展開されない。
- タグは本文末尾に `#tag1 #tag2` のように半角スペースで並べるのが基本。
- タグ一覧は `/tags/`、個別ページは `/tags/<tag>/` から確認できる。

## Mermaid と数式

- Mermaidは ` ```mermaid ` フェンスで書く。Mermaidを含むページだけが jsDelivr CDN の Mermaid を遅延ロードする。
- 数式は `$$...$$` または `\(...\)` で書く。remark-math と rehype-katex によりビルド時にHTML化される。
- 通常のコードブロックと同様、Mermaid・数式の中の wikilink やタグは展開されない。

## 書き方のトーンと調査

- 日本語で、ラフな個人メモとして書く。前置きや読者への配慮より具体性を優先する。
- 特定の製品・技術・サービスを感情的に批判しない。合わなかった点も事実ベースで書く。
- 根拠のない情報や記憶だけの内容を載せない。Web調査の内容には末尾に「出典」セクションを設け、参照元へリンクする。
- 知識・事実を問われたら、記憶だけで即答せず、まず一次情報や公的情報を検索して裏取りする。医療情報は厚生労働省など国内の公的情報を優先する。
- オープンクエスチョンに回答した後、その内容をノートとして残すか確認する。新規ノートを書いたら、さらに切り出せそうな概念がないか提案する。
- 実験を行う場合は、対象・コマンド・触るリソースを先に説明し、ユーザーの許可を得る。実験記録は `<topic>-experiment.md` のように独立したノートにする。

## 開発と検証

```sh
npm install
npm run dev
npm run check
npm run build
```

- `npm run check` でAstro/TypeScriptの診断を確認する。
- `npm run build` はAstroの静的生成後に `pagefind --site dist` を実行する。
- プロジェクトサイトとして `/notes/` に公開する場合は `PUBLIC_BASE=/notes SITE_URL=https://ydah.github.io npm run build` を使う。
- 自前でリンクを組み立てるときは `import.meta.env.BASE_URL` を使い、`/notes/` のようなルート固定リンクを増やさない。
- 変更後は `git diff --check` と、変更に応じた `npm run check` / `npm run build` を実行する。

## GitHub Pages

`.github/workflows/deploy.yml` が `main` へのpushで `npm ci`、`npm run build`、GitHub Pagesへのデプロイを行う。GitHubリポジトリのPages設定はGitHub ActionsをSourceにする。Actionsや依存関係を変更した場合は、ローカルビルドに加えてworkflowのパス・Nodeバージョン・base設定を確認する。

## 関連ファイル

- `src/content/notes/*.md` — ノート本文
- `src/content.config.ts` — ノートのfrontmatterスキーマ
- `src/lib/remark-wikilink.mjs` — wikilink変換と未解決警告
- `src/lib/remark-hashtag.mjs` / `src/lib/tags.mjs` — タグ変換・集計
- `src/lib/notes.ts` — ノート取得、リンクグラフ、バックリンク、タグ集計
- `src/layouts/BaseLayout.astro` / `src/components/Sidebar.astro` — 共通レイアウトとサイドバー
- `scripts/update-note-dates.mjs` / `lefthook.yml` — 日付更新フック
- `.github/workflows/deploy.yml` — GitHub Pagesデプロイ
