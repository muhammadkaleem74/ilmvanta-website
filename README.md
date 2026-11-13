# ilmvanta.com

The public marketing website for Ilm Vanta (school management software for Pakistan). A static site built with
[Astro](https://astro.build): every page is plain HTML; no framework JavaScript is shipped. The school app itself
lives at <https://app.ilmvanta.com> and is a different project.

## Pages

| Path | File |
| --- | --- |
| `/` | `src/pages/index.astro` (hero, modules, "See it" screenshots, roles, mobile app, getting started, plans, your data, FAQ, book a demo) |
| `/privacy` | `src/pages/privacy.astro` (draft, needs legal review) |
| `/terms` | `src/pages/terms.astro` (draft, needs legal review) |
| 404 | `src/pages/404.astro` |

Also built: `sitemap-index.xml`, `robots.txt`, favicon set, `site.webmanifest`, `og-image.png`, `CNAME` (custom domain for GitHub Pages).

## Edit the business details

Everything you may want to change without touching code is in **`site.config.json`**: WhatsApp number, phone, email,
office hours, the Web3Forms key, plan contents, whether to show a starting price, FAQ answers and the legal entity.
`npm run build` lists every value that is still a `TODO` placeholder.

### Demo form (Web3Forms)

1. Go to <https://web3forms.com>, enter the email address that should receive demo requests, and the access key is
   emailed to you.
2. Put it in `site.config.json` → `form.web3formsAccessKey` (the key is public by design; it only lets the form send
   to your inbox).
3. Until a key is set, the form shows "WhatsApp us instead". A hidden honeypot field (`botcheck`) stops simple spam bots.

## Develop

```sh
npm ci
npm run dev        # http://localhost:4321
npm run build      # outputs dist/
npm run preview    # serves dist/ on http://localhost:4321
npm run check:html # html-validate on dist/
```

Node 22.12 or newer.

## Screenshots

Real screenshots of the app, taken from a local demo school with made-up data. The raw PNGs and how they were made
live in the app repository (`docs/marketing/screenshots`). To bring new ones in:

```sh
npm run images -- ../Project/docs/marketing/screenshots   # add --replace to overwrite existing files
```

Astro converts them to AVIF and WebP at several widths (`src/components/Shot.astro`).

`scripts/make-icons.mjs` regenerates the favicons and the Open Graph image from the brand mark.

## Hosting

GitHub Pages. `.github/workflows/deploy.yml` builds the site, runs html-validate and publishes `dist/` on every push to
`main` (or by hand: Actions → Deploy to GitHub Pages → Run workflow). Repo Settings → Pages → Source must be
"GitHub Actions"; custom domain `ilmvanta.com` (also in `public/CNAME`), Enforce HTTPS on.

DNS stays at GoDaddy: four `A @` records to GitHub Pages' IPs and `CNAME www → muhammadkaleem74.github.io`. The
`app` record (app.ilmvanta.com) is a separate host and must not change. GitHub Pages can't set response headers, so
there is no CSP/HSTS header from the host; the site has no third-party scripts. No analytics or tracking scripts are
included.
