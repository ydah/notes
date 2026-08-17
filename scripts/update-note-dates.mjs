#!/usr/bin/env node
import fs from 'node:fs';

const getToday = () => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: process.env.NOTE_DATE_TIMEZONE ?? 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
};

const today = getToday();
const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---\r?(?:\n|$)([\s\S]*)$/;

for (const file of process.argv.slice(2)) {
  if (!file.endsWith('.md') || !fs.existsSync(file)) continue;
  const raw = fs.readFileSync(file, 'utf8');
  const match = raw.match(frontmatterPattern);

  if (!match) {
    const next = `---\ncreated: ${today}\nupdated: ${today}\n---\n\n${raw}`;
    if (next !== raw) fs.writeFileSync(file, next);
    continue;
  }

  const [, frontmatter, body] = match;
  const lines = frontmatter.split(/\r?\n/).filter((line) => !/^\s*updated\s*:/.test(line));
  if (!lines.some((line) => /^\s*created\s*:/.test(line))) lines.unshift(`created: ${today}`);
  lines.push(`updated: ${today}`);
  const next = `---\n${lines.join('\n')}\n---\n${body}`;
  if (next !== raw) fs.writeFileSync(file, next);
}
