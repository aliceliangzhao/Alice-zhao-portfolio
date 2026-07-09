# Build Plan — simple-editorial style

> **Read this first if you're working on the `style-simple-editorial` branch.**
> This is the migration plan for porting the **simple-editorial** style into the
> Next.js app. It is specific to this style and this branch — it does **not**
> apply to the `main` (card-style) or `style-v2` (halftone) branches.

> **Status (updated 2026-07):** Nav, cursor, project detail page, and the full
> **homepage rebuild** are done (see **§5a** — shapes-grid hero, Selected/Previous
> work, Connect, dividers). Remaining work is **content** (real metrics/images/
> copy) and the **cleanup** in §6. The rainbow shapes-grid on the hero/dividers is
> an intentional override of the "one ink" rule — do not "fix" it to mono.

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
- **One ink (`#111`), one paper (`#fff`).** Secondary text is `#767676` (AA-safe).
  **Exception — 2026 homepage rebuild:** the hero background and the section
  dividers use a full-color "shapes grid" (rainbow palette). This is a deliberate
  override of the mono rule, scoped to those surfaces; everything else stays
  ink-on-paper. See **§5a** for the rebuild and rationale.
- **Satoshi only**, carried across the whole system by weight/scale (400–900).
  Type set large; project titles reach ~96px.
- **Flat sheet, hairline rules.** No shadows.
- **Rounded corners are kept** (`--radius-card`/`--radius-image` = 20px). The
  prototype's "sharp corner everywhere" note is **dropped** — rounded is the
  default; go sharp only case-by-case.
- **Signature motion:** the homepage **shapes grid** (`ShapesGrid.js`) — a canvas
  lattice of shapes that rest gray and reveal color on hover, with idle flashes.
  Replaced the earlier planned halftone dot-morph hero. Quiet scroll cue at the
  bottom of the hero ("Selected work ↓").
- **Blob-lens cursor** is the one sanctioned color on the *rest* of the page.

## 3. Decisions already locked (do not re-litigate)

- **Dark mode + the 6-color background picker are removed.** simple-editorial is
  single-ink. Don't reintroduce them.
- **Nav IA (updated 2026):** **Work / About / Connect** (bold brand "Alice Zhao
  is a UX lead @ AWS."). "Home" was removed; the "Contact" dropdown became a plain
  **Connect** link to `/#connect` (the homepage Connect section). The mobile Menu
  still exposes LinkedIn / Resume / Email.
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
| 3 | **Homepage rebuild** (hero → connect) | ✅ Done — see **§5a** | `page.js` + editorial components |
| 6 | **Project detail page** | ✅ Done (content ongoing) | `ProjectDetailClient.js` + `project.css` |

> Note: steps 3–5 (hero / selected work / about) were merged into a single
> **homepage rebuild** (§5a) that went well beyond the original prototype —
> it introduced the shapes-grid hero, a Previous work section, and a Connect
> section. The project detail page is skinned; remaining work there is **content**
> (real copy/metrics/images per project, tracked in `app/data/projects.js` and
> `app/data/project-context.md`).

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

## 5a. Homepage rebuild (2026) — what's built & why

The homepage was rebuilt around an interactive **shapes-grid** motif. Reference
for the effect: `inspiration/dot-grid/` (the codepen source it was ported from).
Reference for the layout: `inspiration/Alice-zhao-portfolio-homepage.png`.

**Section order** (`app/page.js`), each section after the hero preceded by a
decorative divider:

1. **Hero** (`EditorialIntro.js`) — full-viewport `ShapesGrid` behind the intro
   copy; the "Selected work ↓" label is punched out of the same grid, pinned to
   the bottom of the viewport as the scroll cue + `#work` anchor.
2. **Selected work** (`SelectedWork.js`) — one AWS meta block (`currentWork`)
   beside a **single column** of the 3 case-study cards (from `projectOrder`).
3. **Previous work** (`PreviousWork.js`) — big text-link rows per company
   (`previousWork`).
4. **About** (`EditorialAbout.js`) + photo marquee (`PhotoMarquee.js`).
5. **Connect** (`Connect.js`) — "Let's get in touch!" + a right-half 2×2 grid of
   contact links (`connectLinks`), each spanning 3 of the 12 columns (subgrid).
6. **Footer** (`Footer.js`).

**Section dividers** (`SectionDivider.js`) sit above Previous work / About /
Connect (Selected work's label lives in the hero). The divider owns the section
spacing (`.dividerWrap`); the section it precedes drops its own top margin via
`.sectionFlush`.

### ShapesGrid (`app/components/ShapesGrid.js`) — the engine

Canvas + `requestAnimationFrame` (no animation lib), same React pattern as the
older `DotGridBackground` (which still powers the project-page bottom band).

- **Two variants:** `fullscreen` (hero) and `decorative` (the labeled divider
  strip, 4 rows, label on the last row).
- **Palette is a deliberate rainbow** (`PALETTE` const) — the sanctioned override
  of the mono rule. Idle/resting color comes from the `--color-dot-grid` token so
  the background stays transparent over paper.
- **Behavior matrix (rules §):** desktop = hover reveal + idle color flashes;
  touch (coarse pointer) = idle only, no hover; `prefers-reduced-motion` = one
  static gray frame; `IntersectionObserver` pauses the loop offscreen.
- **Tuning knobs in `CONFIG`:** `gap` (lattice pitch, 32px), `restScale`
  (resting dot size, 0.22), `radiusVmin` (hover radius), `maxHoverScale`, idle
  timing. Change these to retune density/size/energy.
- **Nav clip fix:** the hero canvas extends *up behind the glass nav*
  (`.heroGrid { top: -nav-height }`) so hovered top-row shapes grow clip-free.
  The nav is excluded from the lattice via `data-grid-exclude-fixed`, and
  `buildFullScreen` **phases the lattice** (`offsetY`) so the first visible row
  sits a nav's-top-padding below the nav — keeping the nav↔dots gap even.
  Hero copy is excluded line-by-line via `data-grid-exclude="lines"`.

### Homepage data model (`app/data/about.js`)

Split into a **`// LIVE`** block (homepage: `intro`, `bio`, `currentWork`,
`previousWork`, `connectLinks`) and a **`// LEGACY`** block (only the `/about`
page + `Tools.js`: `workExperience`, `designPhilosophy`, `processSteps`,
`toolsHeading`, `tools`) — cleanup candidates when `/about` is rebuilt. Case-study
cards are single-sourced from `app/data/projects.js` (`projects` + `projectOrder`).

### Hover / interaction language (homepage)

Consistent across cards, previous-work links, and contact links: **text greys to
`--color-muted`** and a **horizontal → arrow reveals** (fade + slide) on hover.
No underline-on-hover anywhere (removed); `ExternalLink`'s persistent underline
stays. In-page anchor jumps smooth-scroll (`html { scroll-behavior: smooth }`,
auto under reduced motion).

### Project detail page

Structure/data model stays (`projects.js`, section model 01/02/03); surfaces are
skinned to ink-on-paper Satoshi. Bottom of the page reuses `SelectedWork`
(`projectSlugs` variant) + a `DotGridBackground` band above the footer.

## 6. Cleanup owed before publish

- **Dead `href="#"` links** to replace: Previous work "Insperity" (`about.js`
  `previousWork`), and any placeholder in `projects.js`. The nav's `/#connect`
  and `#work` are now live anchors.
- **Content still placeholder:** `agent-opportunities` (Amazon Q assistant) has
  real narrative but **no metrics** (bento hidden) and most subsection **images
  missing**; `previousWork` copy is being finalized by Alice. Avatar photo and
  `resume.pdf` still needed.
- **Legacy `/about` page**: everything under the `// LEGACY` banner in `about.js`
  + `app/about/page.js` + `Tools.js` (and the `tools` import in `projects.js`)
  come out together once `/about` is rebuilt or dropped.
- **Orphan tokens** to sweep: `--space-hero-dots-bleed` (old hero) and any
  card-surface tokens only the removed note-cards used.
- Remove dead components once their pages are rebuilt: `PaperTexture`,
  `WaveBackground`, `HeroVisual` (SVG comps), parchment color tokens, the legacy
  tokens in `globals.css`.
- Old `data-cursor="label"` attributes (for the removed CursorTrail) are inert;
  remove as pages are rebuilt.
- Rewrite the steering docs (`DESIGN.md`, `design-brief.md`, `CLAUDE.md`) to the
  simple-editorial direction so they stop pointing at parchment (they still
  describe the old cartography look).

## 7. Build & deploy

- Dev: `npm run dev`
- Build: `npm run build` (static export)
- Deploy: output goes to `docs/` on `main`; custom domain serves from there.
  Publishing simple-editorial = merge `style-simple-editorial` → `main`, build,
  push. `style-card` preserves the old look, so nothing is lost.
- **Remote moved:** `origin` is now
  `https://github.com/aliceliangzhao/Alice-zhao-portfolio.git` (was `miyakelly/…`).
- **Commit convention in effect:** commit after every green build with a clear,
  scoped message; the branch history is the step-by-step record.

## 8. AGENTS.md still applies

This is a customized Next.js — read the relevant guide in
`node_modules/next/dist/docs/` before writing framework code, per `AGENTS.md`.
