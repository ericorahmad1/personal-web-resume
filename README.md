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
npm install     # one-time, dev dependencies for the build pipeline
npm run build   # regenerate AVIF/WebP/icon-sprite/OG-card
npm run serve   # http://localhost:8000
npm run lint    # htmlhint + stylelint
```

## Project structure

```
.
├── index.html              # English resume (canonical)
├── id/index.html           # Indonesian resume (hreflang)
├── resume.json             # Machine-readable (JSON Resume schema)
├── css/styles.css          # Design tokens + components (~700 lines)
├── js/scripts.js           # Theme toggle, carousels, contact form, ScrollSpy
├── assets/
│   ├── icons.svg           # Local SVG sprite (34 icons)
│   ├── fonts/inter-variable.woff2
│   └── img/erico.{jpg,avif,webp}, og-image.png, favicon.ico
├── scripts/build.mjs       # Build pipeline (sharp, fetch icon sprite)
├── sitemap.xml, robots.txt # SEO
├── netlify.toml (optional) # Netlify config
└── .github/workflows/ci.yml
```

## Editing content

Edit visible content directly in **`index.html`** (English) and **`id/index.html`** (Indonesian). Keep `resume.json` in sync if you want the machine-readable artifact to stay accurate.

A future iteration may render HTML from `resume.json` via a Mustache template in `scripts/build.mjs` — see PLAN.md.

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
