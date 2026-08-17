import { visit } from 'unist-util-visit';
import { TAG_RE, tagUrl } from './tags.mjs';

export const remarkHashtag = ({ base = '' } = {}) => (tree) => {
  visit(tree, 'text', (node, indexInParent, parent) => {
    if (!parent || parent.type === 'link' || !node.value.includes('#')) return;

    const children = [];
    let last = 0;
    for (const match of node.value.matchAll(TAG_RE)) {
      const start = (match.index ?? 0) + match[1].length;
      if (start > last) children.push({ type: 'text', value: node.value.slice(last, start) });

      children.push({
        type: 'link',
        url: tagUrl(match[2], base),
        data: { hProperties: { class: 'tag', 'data-pagefind-filter': 'tag' } },
        children: [{ type: 'text', value: `#${match[2]}` }],
      });
      last = start + 1 + match[2].length;
    }

    if (!children.length) return;
    if (last < node.value.length) children.push({ type: 'text', value: node.value.slice(last) });
    parent.children.splice(indexInParent, 1, ...children);
    return indexInParent + children.length;
  });
};
