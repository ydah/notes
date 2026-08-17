import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkHashtag } from './src/lib/remark-hashtag.mjs';
import { remarkWikilink } from './src/lib/remark-wikilink.mjs';
import { buildNoteIndex } from './src/lib/note-index.mjs';

// This repository is deployed as the project site https://ydah.github.io/notes/.
// Set PUBLIC_BASE= to build a user-site/custom-domain variant locally.
const BASE = (process.env.PUBLIC_BASE ?? '/notes').replace(/\/$/, '');
const SITE = process.env.SITE_URL ?? 'https://ydah.github.io';
const noteIndex = buildNoteIndex(fileURLToPath(new URL('./src/content/notes/', import.meta.url)));

export default defineConfig({
  site: SITE,
  base: BASE || undefined,
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: {
    processor: unified({
      remarkPlugins: [
        [remarkWikilink, { index: noteIndex, base: BASE }],
        [remarkHashtag, { base: BASE }],
        remarkMath,
      ],
      rehypePlugins: [rehypeKatex],
    }),
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid', 'math'],
    },
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
});
