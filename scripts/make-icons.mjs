// Makes the favicon set and the Open Graph image from the brand mark (run once; outputs are committed in public/).
//   node scripts/make-icons.mjs
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';

const mark = (pad = 0, bg = null) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${30 + pad * 2} ${30 + pad * 2}">
${bg ? `<rect x="${-pad}" y="${-pad}" width="${30 + pad * 2}" height="${30 + pad * 2}" fill="${bg}"/>` : ''}
<rect width="30" height="30" rx="8" fill="#4F46E5"/><path d="M7 10.5c3-1.4 5.6-1.2 8 .6 2.4-1.8 5-2 8-.6v10c-3-1.4-5.6-1.2-8 .6-2.4-1.8-5-2-8-.6z" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/><path d="M15 11.1v10" stroke="#fff" stroke-width="1.8"/><circle cx="22.5" cy="7" r="2.2" fill="#F59E0B"/></svg>`;
// Maskable: full-bleed indigo with the book inside the safe zone.
const maskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><rect width="30" height="30" fill="#4F46E5"/><g transform="translate(4.5 4.5) scale(.7)"><path d="M7 10.5c3-1.4 5.6-1.2 8 .6 2.4-1.8 5-2 8-.6v10c-3-1.4-5.6-1.2-8 .6-2.4-1.8-5-2-8-.6z" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/><path d="M15 11.1v10" stroke="#fff" stroke-width="1.8"/><circle cx="22.5" cy="7" r="2.2" fill="#F59E0B"/></g></svg>`;

writeFileSync('public/favicon.svg', mark());
const png = (svg, size) => sharp(Buffer.from(svg), { density: 600 }).resize(size, size).png().toBuffer();
writeFileSync('public/apple-touch-icon.png', await png(mark(3, '#FFFFFF'), 180));
writeFileSync('public/icon-192.png', await png(mark(), 192));
writeFileSync('public/icon-512.png', await png(mark(), 512));
writeFileSync('public/icon-maskable-512.png', await png(maskable, 512));

// favicon.ico with 16, 32 and 48 px PNG images inside
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((s) => png(mark(), s)));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const entries = sizes.map((s, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s, 0); e.writeUInt8(s, 1); e.writeUInt8(0, 2); e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6); e.writeUInt32LE(images[i].length, 8); e.writeUInt32LE(offset, 12);
  offset += images[i].length;
  return e;
});
writeFileSync('public/favicon.ico', Buffer.concat([header, ...entries, ...images]));

// Open Graph image 1200x630: navy band, mark, headline, and the real dashboard screenshot.
const shot = await sharp(readFileSync('src/assets/shots/web/dashboard.png')).resize(700).png().toBuffer();
const shotMeta = await sharp(shot).metadata();
const bg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<rect width="1200" height="630" fill="#0F172A"/>
<rect x="590" y="80" width="${700 + 24}" height="${shotMeta.height + 60}" rx="18" fill="#1E293B"/>
<g transform="translate(64 72) scale(2.4)">${mark().replace(/<\/?svg[^>]*>/g, '')}</g>
<text x="152" y="122" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="44" font-weight="800" fill="#FFFFFF">Ilm Vanta</text>
<text x="64" y="250" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="46" font-weight="800" fill="#FFFFFF">School management</text>
<text x="64" y="306" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="46" font-weight="800" fill="#FFFFFF">for Pakistan</text>
<text x="64" y="372" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="25" fill="#B6C2D4">Admissions, attendance, fee challans,</text>
<text x="64" y="408" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="25" fill="#B6C2D4">exams, timetables and payroll.</text>
<text x="64" y="466" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="25" fill="#A5B4FC">English and Urdu app for parents and teachers.</text>
<text x="64" y="566" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="24" font-weight="700" fill="#FFFFFF">ilmvanta.com</text>
</svg>`;
await sharp(Buffer.from(bg))
  .composite([{ input: shot, left: 602, top: 110 }])
  .png({ compressionLevel: 9 })
  .toFile('public/og-image.png');
console.log('icons and og-image written');
