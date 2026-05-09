# Personal Web Resume — Analysis & Improvement Plan

> Snapshot date: 2026-05-09
> Owner: Erico Rahmad Darmanto (`ericorahmad1@gmail.com`)
> Repo: https://github.com/ericorahmad1/personal-web-resume

---

## 1. Current State

Single-page static resume website built from **Start Bootstrap "Resume" v7.0.4** template.

### Tech stack
| Layer | Stack |
|---|---|
| Markup | HTML5 statis (`index.html`, 260 lines) |
| Styling | Bootstrap 5.1.3 (bundled into `css/styles.css`, 11,434 lines) + Google Fonts (Saira Extra Condensed, Muli) |
| Icons | Font Awesome 5.15.4 (CDN, full bundle) |
| JS | Vanilla JS — ScrollSpy + navbar collapse (`js/scripts.js`, 34 lines) |
| Tooling | None (no bundler, no lint, no build step) |
| Hosting | Not configured |

### File tree
```
personal-web-resume/
├── .gitignoree              ← TYPO (should be .gitignore)
├── Readme.md                ← only contains title
├── index.html
├── package-lock.json        ← orphan (no package.json)
├── node_modules/            ← committed because .gitignore is broken
├── assets/img/{erico.jpg, favicon.ico, profile.jpg(orphan)}
├── css/styles.css
└── js/scripts.js
```

---

## 2. Issues Found

### 🔴 Bugs / Inconsistencies
1. `.gitignoree` filename typo → `node_modules/` is tracked.
2. `package-lock.json` exists without a `package.json`.
3. `assets/img/profile.jpg` not referenced anywhere (orphan).
4. `index.html:120` — "Institute Teknologi & Bisnis STIKOM Bali &" (dangling `&`).
5. `index.html:125` — "2015 - current" (stale; today is 2026).
6. `index.html:107` — typo `INternal`.
7. `index.html:189` — grammar: "ready to shipping".
8. Career timeline inconsistent: SMK 2013-2015 sits after internships in 2008-2010.
9. Bootstrap CSS bundled locally but JS loaded from CDN — inconsistent.

### 🟡 Best practice
10. Missing SEO/OG/Twitter Card meta tags.
11. No `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, `theme-color`.
12. Profile image `alt=""` (line 23) — accessibility issue.
13. All resume content hard-coded in HTML (data + view not separated).
14. Font Awesome v5 (v6/v7 available); loads entire library.
15. README has no useful content.
16. No LICENSE.

### 🟢 Performance
17. `styles.css` ships full Bootstrap (~11k lines) — should purge.
18. Render-blocking resources in `<head>` without `defer`/`preconnect`.
19. No SRI hashes on CDN scripts.
20. No image lazy-loading.

---

## 3. Action Plan (priority-ordered)

| # | Action | Effort | Impact | Status |
|---|---|---|---|---|
| 1 | Fix `.gitignoree` → `.gitignore`; untrack `node_modules/` | 5 min | 🔥 | ☐ |
| 2 | Write proper README + fix HTML typos | 30 min | 🔥 | ☐ |
| 3 | Add SEO meta + Open Graph + Twitter Card | 30 min | 🔥 | ☐ |
| 4 | Update content 2021 → 2026 (jobs, certs, dates) | 1–2 h | 🔥🔥 | ☐ |
| 5 | Configure GitHub Pages deploy | 30 min | 🔥🔥 | ☐ |
| 6 | Extract resume data → `resume.json` (JSON Resume schema) | 3 h | 🔥 | ☐ |
| 7 | Add Projects section + "Download PDF" button | 4 h | 🔥🔥 | ☐ |
| 8 | Migrate to Astro + PurgeCSS | 1 day | 🔥 | ☐ |
| 9 | i18n EN/ID | 0.5 day | 🔥 | ☐ |

---

## 4. Suggested Refactored Structure

```
personal-web-resume/
├── .gitignore
├── README.md
├── package.json
├── astro.config.mjs            # or vite.config.js
├── public/
│   ├── favicon.ico
│   ├── og-image.jpg
│   └── erico-cv.pdf
├── src/
│   ├── data/resume.json        # JSON Resume schema
│   ├── components/{Section,Experience,Skills}.astro
│   ├── layouts/Base.astro
│   ├── pages/{index.astro, id.astro}
│   └── styles/global.css
└── .github/workflows/deploy.yml
```

---

## 5. Lighthouse Targets

- Performance ≥ 95
- Accessibility ≥ 95
- SEO ≥ 95
- Best Practices ≥ 95

---

## 6. Quick-win Bundle (do first)

Items #1, #2, #3 — under 1 hour total — biggest visible improvement to recruiters.
