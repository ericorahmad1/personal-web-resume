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

`PLAN.md` at the repo root contains the current improvement backlog and a "🔖 Modernization checkpoint" section listing exactly which commits in the multi-session plan are done. Consult it before proposing larger refactors.

The full execution plan lives in the user's plan dir at `~/.claude/plans/tingly-foraging-widget.md` (Phase 1 + Phase 2 + EN/ID i18n, 16 commit-sized steps, approved 2026-05-09).

### Resumption trigger

When the user says **"lanjutkan progres"** (or "lanjut progress" / "continue progress"), resume the modernization plan at the next un-done commit listed in PLAN.md's checkpoint section. Do NOT re-plan or re-ask the catalog questions — decisions are locked in: Phase 1+2 + EN/ID i18n, dual deploy retained, custom domain deferred, GH Pages canonical.
