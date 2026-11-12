// Copies the approved raw screenshots from the app repo (docs/marketing/screenshots) into src/assets/shots, where
// Astro turns them into AVIF/WebP at several widths. Run after new screenshots are approved:
//   npm run images -- ../Project/docs/marketing/screenshots
// Existing files are kept unless --replace is given.
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const args = process.argv.slice(2);
const from = resolve(args.find((a) => !a.startsWith('--')) ?? '../Project/docs/marketing/screenshots');
const replace = args.includes('--replace');
const to = resolve('src/assets/shots');
let copied = 0;
for (const kind of ['web', 'app']) {
  const dir = join(from, kind);
  if (!existsSync(dir)) continue;
  mkdirSync(join(to, kind), { recursive: true });
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.png'))) {
    const target = join(to, kind, file);
    if (existsSync(target) && !replace) continue;
    copyFileSync(join(dir, file), target);
    copied++;
  }
}
console.log(`copied ${copied} screenshot(s) into ${to}`);
