import Slugger from 'github-slugger';
import type { HastPluginEntry } from 'satteri';

// Sätteri hast plugin: gives each h2-h4 an id (same slugger Astro uses) and appends a "#" link to it.
// Astro's own heading-id plugin runs after user plugins and keeps existing ids.
export const headingAnchors: HastPluginEntry = () => {
  const slugger = new Slugger();
  return {
    name: 'heading-anchors',
    element: {
      filter: ['h2', 'h3', 'h4'],
      visit(node, ctx) {
        const className = node.properties?.className;
        if (Array.isArray(className) && className.includes('sr-only')) return;
        const existing = node.properties?.id;
        const id = typeof existing === 'string' ? existing : slugger.slug(ctx.textContent(node));
        if (typeof existing !== 'string') ctx.setProperty(node, 'id', id);
        ctx.appendChild(node, {
          type: 'element',
          tagName: 'a',
          properties: {
            href: `#${id}`,
            className: ['heading-anchor'],
            ariaHidden: 'true',
            tabIndex: -1,
          },
          children: [{ type: 'text', value: '#' }],
        });
      },
    },
  };
};
