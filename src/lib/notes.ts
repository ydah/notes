import { getCollection, type CollectionEntry } from 'astro:content';
import { extractWikilinks } from './markdown.mjs';
import { extractTags, normalizeTag } from './tags.mjs';

export type NoteMeta = {
  slug: string;
  title: string;
  created?: Date;
  updated?: Date;
  aliases: string[];
  tags: string[];
  outgoing: string[];
  hasH1: boolean;
  entry: CollectionEntry<'notes'>;
};

export const getNotes = async (): Promise<NoteMeta[]> => {
  const entries = await getCollection('notes', ({ data }) => import.meta.env.DEV || !data.draft);
  const notes = entries.map((entry): NoteMeta => {
    const body = entry.body ?? '';
    const title = entry.data.title ?? body.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? entry.id;
    return {
      slug: entry.id,
      title,
      created: entry.data.created,
      updated: entry.data.updated,
      aliases: entry.data.aliases,
      tags: extractTags(body),
      outgoing: extractWikilinks(body).map(({ target }) => target),
      hasH1: /^#\s+.+$/m.test(body),
      entry,
    };
  });

  const targetToSlug = new Map<string, string>();
  for (const note of notes) {
    targetToSlug.set(note.slug, note.slug);
    for (const alias of note.aliases) targetToSlug.set(alias, note.slug);
  }
  for (const note of notes) {
    note.outgoing = note.outgoing.map((target) => targetToSlug.get(target) ?? target);
  }
  return notes;
};

export const buildBacklinks = (notes: NoteMeta[]) => {
  const backlinks = new Map<string, NoteMeta[]>();
  for (const note of notes) {
    for (const target of new Set(note.outgoing)) {
      if (!backlinks.has(target)) backlinks.set(target, []);
      backlinks.get(target)?.push(note);
    }
  }
  return backlinks;
};

export const getBacklinks = async () => buildBacklinks(await getNotes());

export const getTagMap = async () => {
  const tags = new Map<string, NoteMeta[]>();
  for (const note of await getNotes()) {
    for (const tag of note.tags) {
      const key = normalizeTag(tag);
      if (!tags.has(key)) tags.set(key, []);
      tags.get(key)?.push(note);
    }
  }
  return tags;
};

export const byUpdated = (a: NoteMeta, b: NoteMeta) =>
  (b.updated?.getTime() ?? 0) - (a.updated?.getTime() ?? 0) || a.title.localeCompare(b.title, 'ja');
