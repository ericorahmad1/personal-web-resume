# Personal Web Resume — Analysis & Improvement Plan

> Snapshot date: 2026-05-09 (initial)
> Last updated: 2026-05-09 (session 1 — items #1–#5 completed; Phase 1 modernization started)
> Owner: Erico Rahmad Darmanto (`ericorahmad1@gmail.com`)
> Repo: https://github.com/ericorahmad1/personal-web-resume

## 🔖 Modernization checkpoint (Phase 1 + 2 + i18n approved 2026-05-09)

Full plan stored at `~/.claude/plans/tingly-foraging-widget.md` with 16 commit-sized tasks.

**Done so far this session (uncommitted in working tree):**
- ✅ `robots.txt` — bots allowed; private/ blocked; AI training crawlers (GPTBot, ClaudeBot, CCBot, Google-Extended, PerplexityBot, anthropic-ai) opt-out
- ✅ `sitemap.xml` — single URL with hreflang scaffold (will expand when `/id/` ships)
- ✅ `index.html` — added `<meta name="robots">` with `max-image-preview:large`, `<meta name="color-scheme">`, sitemap alternate link
- ✅ `css/styles.css` — print stylesheet (`@media print`) for clean A4 PDF export

**Stopped at:** end of Phase 1 SEO basics. Next 12 commits pending.

**Next session pickup order** (from full plan, recommended sequence):
1. `chore(deps): bootstrap 5.1.3 → 5.3.8 + refresh SRI` (commit 1)
2. `perf(images): AVIF/WebP profile photo via <picture>` (commit 2)
3. `perf(icons): replace Font Awesome CDN with local SVG sprite` (commit 3)
4. `feat(seo): custom OG card image` (commit 5)
5. `feat(perf): self-host Inter Variable; drop Google Fonts` (commit 6)
6. `chore: replace orphan package-lock with proper package.json + build script` (commit 8)
7. `feat: extract content to resume.json (JSON Resume schema)` (commit 9)
8. `feat(i18n): add Indonesian /id/ page with hreflang` (commit 10)
9. `feat(theme): dark mode toggle` (commit 11)
10. `feat(ux): IntersectionObserver section reveal` (commit 12)
11. `feat(ux): variable font + fluid clamp() typography` (commit 13)
12. `feat(nav): offcanvas mobile navigation` (commit 14)
13. `feat(seo): richer Schema.org` (commit 15)
14. `chore(ci): linting + Lighthouse CI` (commit 16)



---

## 0. Progress (as of 2026-05-09)

### ✅ Done in session 1

Two commits on `origin/main`:
- **`cfa72bf`** — chore: cleanup, SEO meta, security hardening, and docs
- **`e1e590c`** — content: replace stale resume data with PDF-sourced 2025/2026 record

Items from the priority table below: **#1, #2, #3, #4, #5 — all ✅**.

### 🌐 Live URLs

| Target | URL | Auto-deploy |
|---|---|---|
| **GitHub Pages (primary)** | https://ericorahmad1.github.io/personal-web-resume/ | ✅ on push to `main` |
| **Netlify (mirror)** | `erico-resume-5f9292.netlify.app` (badge in `app.netlify.com`) | ✅ on push to `main` |

> ⚠️ Same content on both → potential duplicate-content SEO. Pick one as canonical or add `<link rel="canonical">` redirect at the non-primary side. Currently `index.html` canonical points at GH Pages.

### 📦 Done outside the original 9-item plan

These were extra hardening / scope-creep that turned out worthwhile:

- **Subresource Integrity** (`integrity="sha384-..."`) on Bootstrap JS CDN
- **Content Security Policy** meta tag with allowlist (jsdelivr, fontawesome, Google Fonts)
- `referrer="strict-origin-when-cross-origin"` + `X-Content-Type-Options: nosniff`
- **JSON-LD Person schema** with `address` (Denpasar, Bali) + `sameAs` (5 social + Lynk)
- **Lynk portfolio** added to social icons
- **Certifications** section (CAPv2, CNSP, CSCUv3, CND, Google Cybersec Cert, CyberOps, TOEIC)
- **Organizational Experience** section (SlashRoot CTF 2.0/3.0/4.0, UKM KSL)
- Relevance audit when migrating from old HTML → preserved SMK TI Bali Global, MySQL/database skill, anime/sci-fi/aspiring-chef interests
- `private/` folder + `*.pdf` gitignored (user dropped 2 PDF CVs there for content extraction)
- `CLAUDE.md` (guidance for future Claude Code sessions)
- `.gitignore` properly named + expanded (was `.gitignoree` typo with `node_modules/` tracked — 223 files cleaned up)
- README rewrite (was 1 line)

### ☐ Remaining (open for future sessions)

- **#6** Extract resume data → `resume.json` (JSON Resume schema)
- **#7** Add Projects/Portfolio section + "Download CV (PDF)" button
- **#8** Migrate to Astro + PurgeCSS (build pipeline)
- **#9** i18n EN/ID

### 🔓 Open decisions for next session

1. **Canonical URL strategy** — pick GH Pages OR Netlify as primary; currently both serve identical content from `main` (duplicate-content risk). Either remove one deploy or add `<meta name="robots" content="noindex">` on the secondary.
2. **`package-lock.json` orphan** — delete it (no `package.json`) OR materialize a real `package.json` matching the lockfile (Bootstrap 5.1.3 + startbootstrap-resume 7.0.4). Recommendation: delete unless we adopt a build pipeline.
3. **Projects/Portfolio section vs Astro migration order** — adding Projects to current static `index.html` is ~4h; doing it after migrating to Astro is much cleaner but blocks on a 1-day refactor. User to decide which goes first.
4. **Bootstrap upgrade** — 5.1.3 → 5.3.8 is recommended (no CVEs in 5.1.3 but 4 years out of date). Risk: SRI hash will need updating, and a few class names changed in 5.3.x (color modes / dark mode token).
5. **Font Awesome** — currently loads full `all.js` from CDN; subset to ~20 icons used would cut payload significantly. Migrate to FA6/7 in the same pass.

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
