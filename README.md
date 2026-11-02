# aka5h.com

Personal site for Akash Kumar. Plain HTML, CSS and JS: no framework, no build step, no dependencies.

## Files

```
index.html          all page content
styles.css          all styling (light + dark theme tokens at the top)
script.js           logo intro, theme toggle
assets/favicon.svg  favicon (the A mark, adapts to dark mode)
assets/logos/       Meta, CoEnterprise, NYU marks (used as single-color masks)
CNAME               custom domain for GitHub Pages (aka5h.com)
```

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy on GitHub Pages

1. Push this repo to GitHub.
2. Settings → Pages → Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
3. Custom domain is already set via `CNAME`. At your DNS provider, point `aka5h.com` at GitHub Pages:
   - `A` records for the apex: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - optional `CNAME` for `www` → `<your-github-username>.github.io`
4. Once DNS resolves, tick "Enforce HTTPS".

## Editing

- **Copy:** everything lives in `index.html`, one `<section>` per block.
- **Colors:** theme tokens at the top of `styles.css`; `--accent` is the one highlight color.
- **Type:** one family, Archivo. Its width axis does the work: `--wide` for display, normal for body, `--narrow` for small metadata.
- **Layout:** every list uses `.row` (a hanging `.row__hang` column beside `.row__body`). Outcome numbers sit in a `.figures` list inside the work they belong to.
- **The A mark:** 22 `<line>`s inside `.mark` in `index.html`, grouped by direction so they draw in order. Click it to replay.
- **Dark mode:** follows the OS by default; the toggle saves the choice in `localStorage`.
- **Motion:** turned off automatically for visitors with "reduce motion" enabled.
- **Resume:** drop `resume.pdf` in the root and uncomment the Resume link in the Contact section.
