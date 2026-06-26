# Build Plan — simple-editorial style

> **Read this first if you're working on the `style-simple-editorial` branch.**
> This is the migration plan for porting the **simple-editorial** style into the
> Next.js app. It is specific to this style and this branch — it does **not**
> apply to the `main` (card-style) or `style-v2` (halftone) branches.

---

## 1. Context: three styles, one app

This portfolio has three preserved visual styles, each on its own branch (all
pushed to `origin`):

| Style | Branch | What it is |
|---|---|---|
| **card-style** | `style-card` (= `main`) | Original cartography / bento-grid look. Currently the published site. |
| **halftone** | `style-v2` | An earlier redesign attempt (full app + a `redesign/` prototype). |
| **simple-editorial** | `style-simple-editorial` | **This one.** The target style; will eventually become the published portfolio. |

**Goal:** finish porting simple-editorial into the Next.js app on this branch.
When done, it merges into `main` and deploys (via the `docs/` folder + custom
domain). The other two styles stay preserved on their branches.

## 2. What simple-editorial is ("The Halftone Press")

A near-monochrome editorial style. Reference prototype lives in
[`simple-editorial/`](./simple-editorial/) (static HTML/CSS/JS — open
`index.html` / `project-s3-tables.html` in a browser; no build step). Treat it
as the **spec** for what we're building in React.

Core characteristics:
- **One ink (`#111`), one paper (`#fff`).** No accent hue anywhere except the
  cursor lens. Secondary text is `#767676` (AA-safe).
- **Satoshi only**, carried across the whole system by weight/scale (400–900).
  Type set large; project titles reach ~96px.
- **Flat sheet, hairline rules.** No shadows.
- **Rounded corners are kept** (`--radius-card`/`--radius-image` = 20px). The
  prototype's "sharp corner everywhere" note is **dropped** — rounded is the
  default; go sharp only case-by-case.
- **One signature motion** (the halftone dot-morph hero) + a quiet scroll cue.
- **Blob-lens cursor** is the one sanctioned color on the page.

## 3. Decisions already locked (do not re-litigate)

- **Dark mode + the 6-color background picker are removed.** simple-editorial is
  single-ink. Don't reintroduce them.
- **Nav IA matches the prototype:** Home / Work / About / Contact (Contact is a
  dropdown of LinkedIn / Resume / Email).
- **Rounded corners stay** (see above).
- **Cursor:** the blob lens replaces the old `CursorTrail` globally.
- Real contact links: LinkedIn `https://www.linkedin.com/in/liangzhaoux/`,
  Email `liangzhao0801@gmail.com`, Resume (Google Drive link in `Navigation.js`).

## 4. Working conventions for this migration

- **One reviewable commit per step.** Alice reviews each step before the next.
  Commit message format: `Step N: …` or `Nav: …`, ending with the
  `Co-Authored-By: Claude Opus 4.8` trailer.
- **Build after every change:** `npm run build` must stay green before committing.
- **Additive where possible.** New token layer sits alongside the legacy tokens
  so un-ported pages keep working; legacy tokens get removed at the very end.
- Voice/copy: no em dashes; timelines in weeks not days; lead with impact.
- Prefer extracting components; single source of truth (project data in
  `app/data/projects.js`).

## 5. The plan (status)

Phase 1 (preserve all three styles on branches) — **DONE.**

Port phases:

| # | Step | Status | Key files |
|---|---|---|---|
| 0 | **Foundation** — new token layer | ✅ Done | `app/tokens.css` (imported first in `app/layout.js`) |
| 1 | **Nav** (shared component) | ✅ Done | `app/components/Navigation.js` + `Navigation.module.css` |
| 2 | **Cursor** — blob lens | ✅ Done | `app/components/BlobCursor.js` (wired in `layout.js`) |
| 3 | **Homepage hero / intro** | ⬜ Next | rebuild from `simple-editorial/index.html` |
| 4 | **Homepage selected work** | ⬜ | editorial rows (employer = row, projects in cols 4–12) |
| 5 | **Homepage about** | ⬜ | |
| 6 | **Project detail page** | ⬜ | re-skin `ProjectDetailClient.js` + `project.css` from `simple-editorial/project-s3-tables.html` |

### Step 1 — Nav: what was built (so you don't undo it)

The shared `Navigation` (used by project / about / lab pages; the homepage still
has its own nav inside `HomepageScroll` until Step 3):

- **Sticky, glass-blur bar** that **auto-hides on scroll-down, slides back in on
  scroll-up** at all widths. Stays visible while a dropdown is open.
- **Three responsive tiers**, but the desktop→compact switch is **overflow-driven,
  not a fixed breakpoint**: `Navigation.js` measures the inline trio
  (brand · phase labels · menu) via `scrollWidth` on mount/resize/font-load and
  toggles a `.compact` class when it wouldn't fit. This adapts to each project's
  label length so labels never clip against the menu.
  - **Desktop (fits):** inline `brand · phase labels · menu`.
  - **Compact (doesn't fit):** short "Alice Zhao" · section-jumper dropdown · Menu
    dropdown — same three-region order, pinned with flex `order`.
  - **Mobile (≤640px):** compact padding; solid bar that turns to glass while
    resurfaced; on **project pages** the brand is dropped (jumper + Menu only).
- **Phase labels** = the project `sections` with scroll-spy (active highlights;
  click smooth-scrolls). Only render when `sections` is passed.
- **One font size for the whole bar** via `--nav-text-size` (defined on `.header`
  in `Navigation.module.css`). Brand/section/menu share it across all tiers so
  text never jumps size or weight at the breakpoint.
- Contact links always show the ↗ icon; `external` only controls `target=_blank`.

### Steps 3–6 — approach

- **Rebuild the homepage from the prototype** rather than retrofitting the dense
  existing `HomepageScroll` (structure changes bento → editorial rows). When the
  homepage is rebuilt, switch it to use the shared `Navigation` and give it real
  `#work` / `#about` anchors (the nav already links to them).
- For the project page, the structure/data model stays (`projects.js`, section
  model 01/02/03); re-skin surfaces to ink-on-paper, retype in Satoshi, remove
  parchment texture.

## 6. Cleanup owed before publish

- Remove dead components once their pages are rebuilt: `PaperTexture`,
  `WaveBackground`, `HeroVisual` (SVG comps), parchment color tokens, the legacy
  tokens in `globals.css`.
- Old `data-cursor="label"` attributes (for the removed CursorTrail) are inert;
  remove as pages are rebuilt. The blob lens reads `data-cursor-target` /
  `data-cursor-hide` / `data-cursor-dark`.
- Rewrite the steering docs (`DESIGN.md`, `design-brief.md`, `CLAUDE.md`) to the
  simple-editorial direction so they stop pointing at parchment.
- Flag/remove dead `href="#"` links before deploy.

## 7. Build & deploy

- Dev: `npm run dev`
- Build: `npm run build` (static export)
- Deploy: output goes to `docs/` on `main`; custom domain serves from there.
  Publishing simple-editorial = merge `style-simple-editorial` → `main`, build,
  push. `style-card` preserves the old look, so nothing is lost.

## 8. AGENTS.md still applies

This is a customized Next.js — read the relevant guide in
`node_modules/next/dist/docs/` before writing framework code, per `AGENTS.md`.
