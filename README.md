# ydah notes

Astro + GitHub Pages で公開するエバーグリーンノート。

## 前提

- Node.js `22.12.0` 以上
- npm

## 開発

```sh
npm install
npm run dev
```

型チェックと本番ビルドは次のコマンドで実行する。

```sh
npm run check
npm run build
npm run preview
```

検索をローカルで確認する場合は、最初に一度ビルドして Pagefind の生成物を開発サーバーへコピーする。

```sh
npm run search:dev
npm run dev
```

## ノートを書く

ノートは `src/content/notes/*.md` に置く。ファイル名は小文字の英字・数字・ハイフンだけで kebab-case にする（例: `perl-signal-handling.md`）。

- `[[file-name]]` または `[[file-name|表示テキスト]]` でノートをリンクする。
- `aliases: [別名]` をfrontmatterに書くと、その別名でもリンクできる。
- `#tag` はタグページへのリンクになる。
- コードブロックと数式内の `[[...]]` / `#tag` は変換されない。
- `title` がなければ本文の最初の H1、さらにそれもなければファイル名がタイトルになる。
- `created` / `updated` はfrontmatterに書ける。コミット時にlefthookが自動で補完・更新する。
- `draft: true` は開発中に表示されるが、本番ビルドから除外される。
- Mermaidは mermaid 言語を指定したフェンス付きコードブロック、数式は `$$...$$` または `\(...\)` で書く。

未解決の wikilink はビルド時に警告される。リンクされたノートにはバックリンクが自動表示されるため、バックリンクを手動管理しない。

## 公開先を変える場合

デフォルトは `https://ydah.github.io/`（ユーザーサイト）で、通常の `npm run build` はこの設定で生成する。

プロジェクトサイト `https://ydah.github.io/notes/` としてローカルでビルドする場合は、次のように指定する。

```sh
PUBLIC_BASE=/notes SITE_URL=https://ydah.github.io npm run build
```

現在の `.github/workflows/deploy.yml` は `PUBLIC_BASE` を指定せずにビルドするため、デフォルトのユーザーサイト向け設定になっている。プロジェクトサイトへ変更する場合は、workflowにも `PUBLIC_BASE=/notes` を設定すること。

## GitHub Pages

`main` ブランチへのpushで `.github/workflows/deploy.yml` が `npm ci`、`npm run build`、GitHub Pagesへのデプロイを実行する。GitHubリポジトリのPages設定では、Sourceに **GitHub Actions** を選ぶ。

## 主な構成

- `src/content/notes/*.md` — ノート本文
- `src/pages/` — トップ、ノート、タグ、検索、RSS、robots.txt
- `src/lib/` — Markdown拡張、ノート集計、タグ・wikilink処理
- `src/components/` / `src/layouts/` — 共通UIとレイアウト
- `scripts/update-note-dates.mjs` / `lefthook.yml` — 作成日・更新日の自動更新
- `dist/` / `public/pagefind/` — ビルド生成物。コミットしない
