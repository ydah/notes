import { stripNonContent } from './markdown.mjs';

// The first character must be a Unicode letter; this avoids treating issue numbers as tags.
export const TAG_RE = /(^|[^A-Za-z0-9])#(\p{L}[\p{L}\p{N}_-]*)/gu;

export const normalizeTag = (tag) => /[A-Za-z]/.test(tag) ? tag.toLowerCase() : tag;

export const tagUrl = (tag, base = '') => {
  const prefix = base.replace(/\/$/, '');
  return `${prefix}/tags/${encodeURIComponent(normalizeTag(tag))}/`;
};

export const extractTags = (markdown) => {
  const found = new Set();
  for (const match of stripNonContent(markdown).matchAll(TAG_RE)) {
    found.add(normalizeTag(match[2]));
  }
  return [...found];
};
