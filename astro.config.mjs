// Static site: every page is plain HTML at build time; no framework JavaScript ships to the browser.
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';

const site = JSON.parse(readFileSync(new URL('./site.config.json', import.meta.url), 'utf8'));

// Remind at build time which business values are still placeholders (site.config.json).
const todo = [];
(function walk(value, path) {
  if (typeof value === 'string' && (value.startsWith('TODO') || value === 'WEB3FORMS_ACCESS_KEY')) todo.push(path);
  else if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) walk(v, path ? `${path}.${k}` : k);
})(site, '');
if (todo.length) console.warn(`\n[site.config.json] placeholders still to fill: ${todo.join(', ')}\n`);

export default defineConfig({
  site: site.siteUrl,
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'always' },
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
  image: { responsiveStyles: false },
});
