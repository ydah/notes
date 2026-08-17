import { visit } from 'unist-util-visit';

const WIKILINK = /\[\[([^\[\]|]+?)(?:\|([^\[\]]+?))?\]\]/g;

export const remarkWikilink = ({ index, base = '' } = {}) => {
  if (!(index instanceof Map)) throw new Error('remarkWikilink requires a note index');
  const prefix = base.replace(/\/$/, '');

  return (tree, file) => {
    visit(tree, 'text', (node, indexInParent, parent) => {
      if (!parent || parent.type === 'link' || !node.value.includes('[[')) return;

      const children = [];
      let last = 0;
      for (const match of node.value.matchAll(WIKILINK)) {
        const start = match.index ?? 0;
        if (start > last) children.push({ type: 'text', value: node.value.slice(last, start) });

        const target = match[1].trim();
        const label = match[2]?.trim();
        const hit = index.get(target);
        if (!hit) {
          const message = `未解決の wikilink: [[${target}]]`;
          file.message(message, node);
          console.warn(`[wikilink] ${file.path ?? 'note'}: ${message}`);
        }

        children.push({
          type: 'link',
          url: `${prefix}/notes/${encodeURIComponent(hit?.slug ?? target)}/`,
          data: { hProperties: { class: hit ? 'wikilink' : 'wikilink broken' } },
          children: [{ type: 'text', value: label ?? hit?.title ?? target }],
        });
        last = start + match[0].length;
      }

      if (!children.length) return;
      if (last < node.value.length) children.push({ type: 'text', value: node.value.slice(last) });
      parent.children.splice(indexInParent, 1, ...children);
      return indexInParent + children.length;
    });
  };
};
