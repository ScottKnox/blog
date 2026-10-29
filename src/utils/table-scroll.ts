import type { HastPluginEntry } from 'satteri';

// Sätteri hast plugin: wraps each table in a scrollable region so wide tables scroll
// horizontally instead of widening the page. The region is focusable and labelled
// so keyboard users can scroll it.
export const tableScroll: HastPluginEntry = () => ({
  name: 'table-scroll',
  element: {
    filter: ['table'],
    visit(node, ctx) {
      ctx.wrapNode(node, {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-scroll'], role: 'region', ariaLabel: 'Table', tabIndex: 0 },
        children: [],
      });
    },
  },
});
