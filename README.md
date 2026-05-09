# Personal Web Resume — Erico Rahmad Darmanto

Single-page personal resume website for **Erico Rahmad Darmanto** (Quality Assurance Engineer, Bali — Indonesia).

🔗 Live: _to be configured (GitHub Pages)_

---

## Tech stack

- **HTML5** static — no build step
- **Bootstrap 5.1.3** (bundled into `css/styles.css`)
- **Font Awesome 5.15.4** (CDN)
- **Vanilla JavaScript** — Bootstrap ScrollSpy + responsive nav
- Based on the [Start Bootstrap "Resume" v7.0.4](https://startbootstrap.com/theme/resume) theme (MIT)

## Run locally

The site is fully static. Pick any of:

```bash
# Option 1 — open the file directly
open index.html        # macOS
start index.html       # Windows

# Option 2 — serve via Node
npx serve .

# Option 3 — serve via Python
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Project structure

```
.
├── index.html            # all resume content (sections, nav, social links)
├── css/styles.css        # Bootstrap + theme overrides (single bundled file)
├── js/scripts.js         # ScrollSpy + navbar collapse
├── assets/img/           # profile photo, favicon
├── CLAUDE.md             # guidance for Claude Code agents
└── PLAN.md               # improvement backlog
```

## Editing content

All resume sections (`#about`, `#experience`, `#education`, `#skills`, `#interests`, `#awards`) live directly in **`index.html`**. There is no data file or templating — edit the HTML in place.

## Deployment

Recommended: **GitHub Pages** from the `main` branch.

1. Repo → Settings → Pages → Source: `Deploy from a branch` → `main` / `(root)`
2. Site will be served at `https://<user>.github.io/personal-web-resume/`

## Credits

- Theme: [Start Bootstrap — Resume](https://startbootstrap.com/theme/resume) (MIT)
- Bootstrap (MIT), Font Awesome (free icons under CC BY 4.0 / SIL OFL 1.1 / MIT)

## License

Theme distributed under MIT. Personal content (text, photos) © Erico Rahmad Darmanto.
