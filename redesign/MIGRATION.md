# Style v2 Migration & Preservation

This file records the move from the original **card-style** design to the new
**"Halftone Press"** direction, and — most importantly — how to find and
retrieve the old design at any time.

_Last updated: 2026-06-09._

---

## TL;DR — how to get the old card-style design back

The old style is fully preserved in git. Nothing was overwritten.

| What you want | Command |
|---|---|
| **See it live** | `git checkout main` then `npm run dev` (the `main` branch is still the old style) |
| **Inspect the exact restore point** | `git checkout v1-cartography` then `npm run dev` |
| **Recover one old file** into the current branch | `git checkout v1-cartography -- app/globals.css` |
| **Compare old vs new for a file** | `git diff v1-cartography -- app/project.css` |

Restore point tag: **`v1-cartography`** → commit `8943d67`.

After checking out `main` or the tag, return to the redesign with
`git checkout style-v2`.

---

## What "card-style" means (the old / v1 design)

The design being preserved — the "ancient cartography meets modern tech" look:

- **Bento grid** homepage with project **cards**.
- **Signature card hover:** card lifts up-right with a solid-black offset shadow
  (`transform: translate(8px, -8px); box-shadow: -8px 8px 0 #000;` — the
  `.hover-card` class).
- **Parchment / cartography texture** substrate, warm neutrals.
- **Rounded corners** (10px on images).
- **Three fonts:** Satoshi (sans), EB Garamond (serif display), IBM Plex Mono.
- **Parchment dark mode** (warm `#110F0B` / `#F0EADD`).
- **Blue accent** `#2936CF`, custom cursor trail.

## What "Halftone Press" means (the new / v2 design)

The target direction (mockup lives in this folder: `redesign/index.html`,
`redesign/tokens.css`, `redesign/DESIGN.md`, `redesign/PRODUCT.md`):

- Homepage rebuilt around a **halftone canvas hero** (the name resolves from ink
  dots), monochrome, flat, sharp corners, **cursor lens**.
- New **site-wide Nav + Footer**.
- Inner pages keep the current design system (blue accent, three fonts, shadows,
  rounded corners, parchment, dark mode).

See `redesign/DESIGN.md` for the full new-style spec.

---

## Git layout (where everything lives)

| Ref | Points at | Meaning |
|---|---|---|
| `main` | `8943d67` | The **old card-style** design. Untouched. |
| tag `v1-cartography` | `8943d67` | Named restore point for the old style. |
| `style-v2` | (active) | The **redesign in progress**. |

`main` is deliberately left at the old style, so the live deployed site stays
the old design until the redesign is merged.

## What changed in v2 so far (the foundation)

Committed on `style-v2`:

1. **`app/tokens.css`** — new single source of truth for design tokens:
   - Size-named font ladder `--font-size-xxs … -xxxl`, each with a `-legacy` and
     a `-next` value plus a **LIVE** token that picks one. Flip one LIVE line to
     adopt a tier site-wide (the LIVE block is the decision ledger).
   - Font-weight scale (`--font-weight-light … -black`).
   - `--space-` spacing names and `--grid-cols` (still 8; flips to 12 with a
     per-element layout pass).
   - Old names (`--t-p`, `--page-gutter`, …) kept as **temporary aliases** so
     nothing broke during migration.
2. **`app/globals.css`** slimmed to base styles that reference tokens.
3. **Project detail pages + components** migrated onto the new size and weight
   tokens.
4. A dev-only `/type` comparison lab was used to judge tiers in context, then
   removed once the scale was settled.
5. **New homepage source** moved out of the build-output folder
   (`docs/new` → `redesign/`) so a `next build` can't wipe it.
6. **Site-wide Navigation** rebuilt in the new style (single fixed resurfacing
   header; brand line, or the project section nav on project pages; center nav;
   social links; mobile Contact disclosure). Color picker and hamburger drawer
   retired.

### Tiers currently adopted (LIVE = next)
- Body (`s`), labels/small text (`xs`) — adopted.
- Everything else is still LIVE = legacy and can be flipped in `app/tokens.css`.

---

## Breakpoints

The codebase has a scattered set of width breakpoints (900 / 768 / 767 / 760 /
640, plus `Tools.css` at 1200 / 1000 / 600).

**Standard going forward: `900px`.** It's already what the token system uses
(`--nav-height` and `--space-pad` switch to their mobile values at 900px) and
the most common breakpoint in the codebase.

- **Done:** Navigation switches to its mobile layout at 900px (and drops the
  `Lab` link there — `Home / Work / About` remain).
- **TODO (revisit):** migrate the stragglers onto 900px (or a defined ladder) —
  `lab` (768px), `HomepageScroll` (767px), and consolidate `Tools.css`
  (1200 / 1000 / 600). Do this as one dedicated responsive pass, not piecemeal.

---

## Next steps (redesign build order)

1. **New site-wide Nav + Footer** (light-first, dark-ready).
2. **Halftone hero canvas** (port from `redesign/index.html`).
3. **Project list + cursor lens.**

When the redesign is ready, merge `style-v2` → `main` and rebuild `docs/`.
