# Code review — PO Website

## Summary

- **Code quality:** Good. Defensive checks, no inline handlers, single source for layout and mockup.
- **SEO & JSON-LD:** Solid. One canonical/OG inconsistency fixed (terms.html). Schema is valid and consistent.
- **Files to remove or exclude:** `.DS_Store` (and `images/.DS_Store`) should not be in the repo; `indexnow-key.txt` should not be deployed while it contains a placeholder. Both are now in `.netlifyignore`; remove `.DS_Store` from Git if already committed.

---

## 1. Code quality

### JavaScript
- **layout.js:** IIFE, no globals. Nav/footer via `innerHTML`; mockup injected from one `MOCKUP_HTML` string. Menu toggle uses `addEventListener`, `aria-expanded` and `aria-label` updated. External links use `rel="noopener noreferrer"`. No inline `onclick`.
- **script.js:** DOM guards (`#contact-form`, `#contact-submit`, `#current-year`, `#snackbar`). Snackbar uses `textContent` by default, `innerHTML` only when `allowHtml: true`. Timeout id stored and cleared to avoid stacked timers. `resetButton()` in `finally`; min loading delay 600ms. `res.ok` checked before `res.json()`. Year set only when `Number.isFinite(year)`.

### HTML / CSS
- Skip link, `main#main-content`, landmark roles and `aria-label` where needed. Single `h1` per page. Forms and buttons are usable without JS (submit works; feedback via snackbar when JS runs).

### Improvements (optional)
- Add `decoding="async"` to logo images in layout.js if you want explicit decoding.
- Consider `fetch` `AbortController` for contact form if you add a “cancel” or navigation-away behaviour later.

---

## 2. Files to remove or keep out of deploy

| Item | Action |
|------|--------|
| **.DS_Store**, **images/.DS_Store** | Add to `.gitignore` (if not already). Run `git rm --cached .DS_Store "images/.DS_Store"` if already committed. |
| **indexnow-key.txt** | Contains `REPLACE_WITH_YOUR_INDEXNOW_KEY`. Do not deploy. Added to `.netlifyignore`. When you use IndexNow, add a real key and then remove `indexnow-key.txt` from `.netlifyignore` if the file must be public. |
| **readme.md / README.md / OPTIMIZATION.md** | If present, exclude from deploy via `.netlifyignore` (done for these names). |

`.netlifyignore` created/updated so the above (and `.git`, `node_modules`, `package-lock.json`) are not published.

---

## 3. SEO

### Done well
- Canonical URLs on all pages (terms.html fixed to `https://peeledonion.in/terms.html`).
- Unique `<title>` and meta `description` per page.
- `og:title`, `og:description`, `og:url`, `og:image`, `og:type`, `og:site_name`; `twitter:card`.
- `robots` meta where used (e.g. index, follow).
- `hreflang` and `x-default` on index and contact (and can be added to other pages if you target multiple locales).
- Single `h1` per page; sections with `aria-label` or headings.
- `sitemap.xml` and `robots.txt` with correct sitemap URL.

### Fix applied
- **terms.html:** Canonical and `og:url` were `https://www.peeledonion.in/terms`. Updated to `https://peeledonion.in/terms.html`. All JSON-LD `url` values on that page set to `https://peeledonion.in` (no `www`). Placeholder verification meta tags commented out.

### Optional
- Add `og:image:width` and `og:image:height` for `og-home.png` if you want explicit dimensions.
- Add BreadcrumbList JSON-LD on inner pages (e.g. Home > Terms) for richer SERP snippets.

---

## 4. JSON-LD

### index.html
- **Organization:** name, url, logo, description, address, contactPoint. Valid.
- **WebSite:** name, url. Valid.
- **SoftwareApplication:** name, applicationCategory, operatingSystem, offers (free), brand, areaServed (India), url, description. No fake `aggregateRating`. Valid.
- **FAQPage:** mainEntity with Question/Answer pairs. Valid.
- **BreadcrumbList:** single item “Home”. Valid.

### Other pages
- Organization and WebSite (and on contact, Organization with contactPoint). URLs use `https://peeledonion.in` (no `www`). terms.html fixed to match.

### Optional
- **WebSite:** add `potentialAction` with `SearchAction` if you add site search.
- **Organization:** add `sameAs` array if you have social profiles.

---

## 5. Other factors

### Performance
- One shared CSS file; two JS files (layout, script). No heavy external libs; Phosphor removed in favour of inline SVG icons. Mockup image injected from one string; image file stored once. Lazy loading and async decoding on mockup img; footer logo has `loading="lazy"`.

### Accessibility
- Skip link, semantic layout, button/link labels, `aria-expanded` / `aria-controls` on menu, no reliance on colour alone. Snackbar is `aria-live="polite"` (on contact page).

### Security
- Snackbar: `innerHTML` only when `allowHtml: true` (mailto link). Form: no sensitive data in client; Web3Forms handles server-side. External links use `rel="noopener noreferrer"`.

### Maintainability
- Single config in layout.js (blog URL); mockup markup in one place. Contact success/error messages and API endpoint in one file. Clear comments for snackbar and form behaviour.

---

## 6. Checklist

- [x] terms.html canonical and og/JSON-LD URLs fixed (no www, terms.html)
- [x] terms.html verification placeholders commented out
- [x] .netlifyignore created: .git, .DS_Store, readme/OPTIMIZATION/CODE-REVIEW, indexnow-key.txt, node_modules, package-lock
- [ ] If .DS_Store or images/.DS_Store are in Git: run `git rm --cached .DS_Store "images/.DS_Store"`
- [ ] Replace indexnow-key.txt content when using IndexNow; then remove from .netlifyignore if it must be public
- [ ] Add real Google/Bing verification codes where commented in HTML
