# Personal Web Resume — Erico Rahmad Darmanto

Single-page personal resume website for **Erico Rahmad Darmanto** (QA / Security Engineer, Denpasar — Bali, Indonesia).

🔗 **Live:** https://ericorahmad1.github.io/personal-web-resume/ &nbsp;·&nbsp; 🇮🇩 https://ericorahmad1.github.io/personal-web-resume/id/ &nbsp;·&nbsp; 🤖 [resume.json](https://ericorahmad1.github.io/personal-web-resume/resume.json) (JSON Resume schema)

---

## Tech stack

- **HTML5** static — no SSR, no framework runtime
- **Bootstrap 5.3.8** (CDN with SRI) + custom design system on top
- **Inter Variable** (self-hosted woff2) — fluid typography via `clamp()`
- **Local SVG icon sprite** (Simple Icons + Lucide) — replaces Font Awesome
- **Vanilla JavaScript** — Bootstrap components + ScrollSpy + theme toggle + carousels + form handler
- **Build pipeline** (`scripts/build.mjs` + sharp) — image optimization (AVIF/WebP), icon sprite, OG card

## Run locally

The site is fully static — open `index.html` in a browser, or:

```bash
npm install        # one-time, dev dependencies for the build pipeline

# Full build: regenerates AVIF/WebP, icon sprite, OG card, and HTML pages
npm run build

# Or run individual steps:
npm run build:pages     # render index.html + id/index.html from template + JSON
npm run build:images    # AVIF + WebP from erico.jpg
npm run build:icons     # fetch icons from Simple Icons + Lucide → assets/icons.svg
npm run build:og        # SVG → 1200×630 OG card

npm run serve      # http://localhost:8000
npm run lint       # htmlhint + stylelint
```

## Project structure

```
.
├── index.html              # English page (GENERATED — edit data/site.en.json instead)
├── id/index.html           # Indonesian page (GENERATED — edit data/site.id.json)
├── data/
│   ├── site.en.json        # English: UI strings, work, projects, awards, etc.
│   └── site.id.json        # Indonesian: same shape, translated
├── templates/page.mustache # Single template both pages render from
├── resume.json             # Machine-readable (JSON Resume schema), separate artifact
├── css/styles.css          # Design tokens + components (~900 lines)
├── js/scripts.js           # Theme toggle, carousels, contact form, ScrollSpy
├── assets/
│   ├── icons.svg           # Local SVG sprite (34 icons)
│   ├── fonts/inter-variable.woff2
│   └── img/erico.{jpg,avif,webp}, og-image.png, favicon.ico
├── scripts/build.mjs       # Build pipeline (sharp, mustache, fetch)
├── sitemap.xml, robots.txt # SEO
└── .github/workflows/ci.yml
```

## Editing content

> ⚠️ **Don't edit `index.html` or `id/index.html` directly** — they're generated.
> Run `npm run build:pages` after editing data files to regenerate them.

- **English content**: edit `data/site.en.json`
- **Indonesian content**: edit `data/site.id.json`
- **Machine-readable resume**: edit `resume.json` (separate artifact for ATS / LinkedIn / AI agents — does not feed the HTML)
- **Layout / styling**: edit `templates/page.mustache` (structure) or `css/styles.css` (visual)

After any data change:
```bash
npm run build:pages
git add . && git commit -m "content: ..."
git push
```

---

## Configuring third-party services

Two integrations ship with placeholder IDs that you need to replace before they work.

### 1. Contact form (Formspree)

The "Get in touch" button opens a modal that POSTs to **Formspree** (free tier: 50 submissions/month, no credit card).

**Setup:**
1. Sign up at https://formspree.io and create a new form (you can use whatever email address you want notifications sent to — e.g., `ericorahmad1@gmail.com`).
2. Copy the form's endpoint, e.g. `https://formspree.io/f/abcdwxyz`.
3. Replace the `FORMSPREE_FORM_ID` placeholder in **two** places:
   - `index.html` — search for `formspree.io/f/FORMSPREE_FORM_ID`
   - `id/index.html` — same string
4. Commit + push. The form is now live.

Until configured, the modal falls back to a `mailto:` link with the user's subject + message pre-filled.

### 2. Analytics (Umami Cloud)

Privacy-friendly, no cookies, GDPR-friendly. Free tier: 1 site, 100K events/month.

**Setup:**
1. Sign up at https://cloud.umami.is and add a new website (use the canonical URL `https://ericorahmad1.github.io/personal-web-resume/`).
2. Copy the website's UUID from the dashboard.
3. Replace the `UMAMI_WEBSITE_ID` placeholder in **two** places:
   - `index.html` — `<script ... data-website-id="UMAMI_WEBSITE_ID">`
   - `id/index.html` — same
4. Commit + push.

Alternative providers (require additional CSP `script-src` allowlist updates):
- **Plausible** (paid, $9/mo) — `<script defer data-domain="..." src="https://plausible.io/js/script.js"></script>`
- **GoatCounter** (free) — `<script data-goatcounter="https://YOURCODE.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>`
- **Cloudflare Web Analytics** (free, requires Cloudflare proxy)

Until configured, the analytics tag is a harmless no-op.

---

## Deployment

The site is deployed on two targets in parallel:

- **GitHub Pages** (canonical) — auto-deploys from `main` branch root, served at `https://<user>.github.io/personal-web-resume/`
- **Netlify** (mirror) — auto-rebuilds on push, badge in this repo

Both deploys advertise the GH Pages URL as canonical, so search engines index a single source.

## Credits

- Theme baseline: [Start Bootstrap — Resume](https://startbootstrap.com/theme/resume) (MIT)
- Bootstrap 5.3 (MIT) · Inter Variable (OFL) · Lucide icons (ISC) · Simple Icons (CC0)
- Form: [Formspree](https://formspree.io) (free tier)
- Analytics: [Umami Cloud](https://umami.is) (free tier)

## License

Theme distributed under MIT. Personal content (text, photos) © Erico Rahmad Darmanto.
