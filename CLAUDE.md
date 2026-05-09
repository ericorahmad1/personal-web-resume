# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static single-page personal resume website for Erico Rahmad Darmanto (QA Engineer), based on the [Start Bootstrap "Resume" v7.0.4](https://startbootstrap.com/theme/resume) template (MIT). All resume content (experience, education, skills, awards) is hard-coded directly in `index.html` — there is no data file or CMS; content edits happen in that one file.

## How to run / develop

There is **no build step, test suite, or linter** in this repo. To preview changes:

- Open `index.html` directly in a browser, or
- Serve the directory with any static server, e.g. `npx serve .` or `python -m http.server`.

Live-reload is not configured; refresh the browser manually.

## Architecture

Three files do all the work:

- **`index.html`** — every section (`#about`, `#experience`, `#education`, `#skills`, `#interests`, `#awards`) is a hand-written `<section class="resume-section">` block. The left side-nav (`#sideNav`) is bound to these sections via Bootstrap ScrollSpy.
- **`css/styles.css`** — a single 11k-line file that **already contains all of Bootstrap 5.1.3 plus the theme overrides** concatenated together. It is *not* generated from a build; edit it directly, but expect most of it to be vendored Bootstrap.
- **`js/scripts.js`** — 34 lines: initializes Bootstrap ScrollSpy on `#sideNav` and auto-collapses the responsive navbar on link click. That's the entire client-side behavior.

External resources loaded from CDN at runtime: **Bootstrap 5.1.3 JS bundle**, **Font Awesome 5.15.4** (full library, not subsetted), and Google Fonts (Saira Extra Condensed, Muli). Note the asymmetry: Bootstrap **CSS is bundled locally** but **JS is CDN** — when upgrading Bootstrap, both must move together.

## Repo quirks to be aware of

- **`.gitignoree`** (with a trailing `e`) is a filename typo, so it does not work as a gitignore. As a result `node_modules/` is currently tracked in git. Fixing this requires renaming the file *and* `git rm -r --cached node_modules/`.
- **`package-lock.json` exists without a `package.json`.** The lockfile lists `bootstrap@5.1.3` and `startbootstrap-resume@7.0.4` but `npm install` will not behave normally without a manifest. Treat the lockfile as historical metadata, not a working npm setup.
- **`assets/img/profile.jpg`** is unreferenced; only `erico.jpg` and `favicon.ico` are used by `index.html`.

## Project planning

`PLAN.md` at the repo root contains the current improvement backlog (typo fixes, SEO meta, content updates 2021→2026, possible Astro migration, etc.) with a priority-ordered table. Consult it before proposing larger refactors so suggestions stay aligned.
