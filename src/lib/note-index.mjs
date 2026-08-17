import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const NOTE_FILE = /^[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;

/** Build the slug and alias index before Astro starts processing Markdown. */
export const buildNoteIndex = (dir) => {
  const index = new Map();
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    if (!NOTE_FILE.test(entry.name)) {
      throw new Error(`ノートのファイル名は kebab-case にしてください: ${entry.name}`);
    }

    const slug = entry.name.slice(0, -3);
    const raw = fs.readFileSync(path.join(dir, entry.name), 'utf8');
    const parsed = matter(raw);
    if (process.env.NODE_ENV === 'production' && parsed.data.draft === true) continue;

    const title = String(parsed.data.title ?? parsed.content.match(/^#\s+(.+)$/m)?.[1] ?? slug).trim();
    const aliases = Array.isArray(parsed.data.aliases) ? parsed.data.aliases.map(String) : [];
    const note = { slug, title };

    for (const key of [slug, ...aliases]) {
      if (index.has(key)) throw new Error(`重複したノート slug / alias: ${key}`);
      index.set(key, note);
    }
  }

  return index;
};
