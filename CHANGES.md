# Changes Applied to Frontend Academy

This document lists every modification made during the review. Changes are
grouped by the issue they fix.

---

## 1. Broken homepage links — FIXED

### 13 stub doc pages created
All previously-broken `index.html` links now resolve:

- `docs/react-introduction.html`
- `docs/react-components.html`
- `docs/react-props-state.html`
- `docs/react-events.html`
- `docs/react-lists.html`
- `docs/react-forms.html`
- `docs/react-hooks.html`
- `docs/react-context.html`
- `docs/tailwind-css.html`
- `docs/accessibility.html`
- `docs/git-workflow.html`
- `docs/team-collaboration.html`
- `docs/deployment.html`

Each is a "Coming Soon" placeholder using the shared sidebar and site styling.
Replace the content section with real lessons when ready.

### 3 missing projects removed from homepage
Dead project-card for `canvas-ball-game/` was linked but doesn't exist.
Removed from homepage + course-card. `react-movie-app` and `react-mini-ecommerce`
were already absent from the project-grid cards in the homepage, so only
`canvas-ball-game` needed removing.

### 2 orphan pages linked
`user-research.html` and `wireframing.html` existed but weren't reachable
from the homepage. Added to the Part 4 course-card list.

---

## 2. Shared sidebar — NEW

### `docs/assets/sidebar.js`
Single source of truth for docs navigation. Edit the `NAV_CONFIG` array
at the top of this file to change the sidebar across every doc page at once.

### All doc pages migrated
Every doc page now has just:

```html
<nav class="sidebar" data-current-title="Page Name"></nav>
...
<script src="assets/sidebar.js"></script>
<script src="assets/script.js"></script>
```

40 of 41 pages migrated. `react-hooks-usecontext.html` has a unique
self-contained design and was deliberately left alone.

---

## 3. `docs/assets/script.js` bug fixes

### Removed aggressive HTML-stripping regex
**Before:** `rawCode.replace(/<\/?[a-z][^>]+(>|$)/gi, "")` — destroyed valid
JS like `str.split("<div>")`, JSX, and template literals containing HTML.
**After:** run the user's code as-is. The iframe sandbox is already isolation.

### Copy button now works on file:// and insecure contexts
`navigator.clipboard.writeText()` silently fails without HTTPS / localhost.
Added a textarea + `execCommand('copy')` fallback, a `.catch()` handler,
and a visible "⚠ Failed" state so students know when a copy didn't work.

### Mobile sidebar: closes on nav-link click
Previously, tapping a link inside the sidebar navigated but left the sidebar
open. Now a click handler on `.sidebar` listens for link clicks and closes
the sidebar on mobile. The outside-click listener also now early-returns
when the sidebar is closed (was firing on every desktop click).

### Infinite-loop guard on the Run button
A 4-second timeout now kills the iframe if user code runs too long
(`while(true){}`, etc.). Without this, the whole browser tab hangs until
force-refresh. Runs a timeout handler that removes the iframe and logs
`"⏱ Execution timeout (4000ms)"` to the console output.

### Modernised caret-aware text insertion
Replaced deprecated `document.execCommand('insertText', ...)` in the
contentEditable code editor with a modern Selection/Range-based
`insertTextAtCaret()` helper. Fires an `input` event so Prism
re-highlighting still kicks in.

---

## 4. `docs/assets/style.css` fixes

### Removed misleading `cursor: pointer` on `.course-card`
The card itself isn't clickable — only the `<a>` links inside it are.
Cursor was lying to users. Removed.

### Fixed invalid CSS selector
`pre:not(.code-editor pre)` used a descendant selector inside `:not()`,
which isn't a simple selector and has spotty support. Replaced with
`pre.standalone, body > pre`. Code-editor `<pre>` elements are naturally
scoped inside `.code-editor` wrappers and don't match these selectors.

---

## 5. `index.html` fixes

### Loaded all Prism language components
Previously only `prism-javascript` was loaded explicitly, so HTML/CSS/JSX/JSON
code blocks fell back to plain highlighting. Added:
- `prism-markup` (HTML)
- `prism-css`
- `prism-jsx`
- `prism-json`

---

## 6. Code hygiene

### UTF-8 BOMs stripped from all HTML files
Several HTML files began with the UTF-8 BOM byte sequence (`EF BB BF`).
Harmless but inconsistent. All HTML files now start directly with `<!DOCTYPE`.

---

## Not changed (intentional)

- `react-hooks-usecontext.html` — kept its unique self-contained design.
  If you want it to match the rest of the site, convert it manually.
- Content of all existing lessons — only navigation/structure touched.
- `projects/` directories — out of scope for this review.
- Georgian vs English comments — left as-is. If you want to standardise,
  that's a separate pass.

---

## Post-fix verification

```
BROKEN LINKS (homepage -> docs):    0  (was 13)
ORPHAN DOC PAGES:                   0  (was 2)
SIDEBAR DUPLICATION:                fixed  (40 pages now share one file)
script.js syntax:                   parses cleanly
sidebar.js syntax:                  parses cleanly
```
