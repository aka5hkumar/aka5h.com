# aka5h.com

Personal site for Akash Kumar. Plain HTML, CSS and JS: no framework, no build step, no dependencies.

## Files

```
index.html          all page content
styles.css          all styling (light + dark theme tokens at the top)
script.js           logo intro, theme toggle, scroll reveal
assets/favicon.svg  favicon (the A mark, adapts to dark mode)
assets/logos/       Meta, CoEnterprise, NYU marks (used as single-color masks)
assets/og.png       link-preview image (1200x630) for messaging apps and social
assets/apple-touch-icon.png  home-screen icon for iOS
404.html            not-found page (GitHub Pages serves it automatically)
robots.txt, sitemap.xml  search engine hints
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
- **The A mark:** 22 `<line>`s inside `.mark` in `index.html`, grouped by direction so they draw in order. Click it to replay.
- **Dark mode:** follows the device. The toggle overrides it until the device itself switches modes, then the page follows the device again.
- **Motion:** turned off automatically for visitors with "reduce motion" enabled.
- **Link previews / search:** title, description, Open Graph tags and JSON-LD live in the `<head>` of `index.html`. If the headline changes, re-render `assets/og.png` to match.
- **Resume:** drop `resume.pdf` in the root and uncomment the Resume link in the Contact section.
