# simple-editorial — style prototype

Static HTML/CSS/JS prototype for the **simple-editorial** style ("The Halftone Press"):
near-monochrome ink on paper, single typeface (Satoshi) set huge, flat sheet with
hairline rules, one halftone dot-morph hero, and a blob cursor lens.

This is the **third** of three preserved styles:

| Style | Branch | Form |
|---|---|---|
| card-style | `style-card` | Full Next.js app (the original cartography/bento look) |
| halftone | `style-v2` | Full Next.js app + `redesign/` prototype |
| simple-editorial | `style-simple-editorial` | This static prototype — to be ported into the Next.js app |

## Files

- `index.html` — homepage prototype
- `project-s3-tables.html` — project detail page prototype
- `tokens.css` — design tokens (color, fluid type scale, spacing, 12-col grid)
- `cursor.js` — site-wide blob cursor lens (capability-gated, reduced-motion safe)
- `img/` — placeholder thumbnail asset

Open `index.html` directly in a browser to view. No build step.

Origin: copied from the local-only `inspiration/JS-test/` working files (which are
gitignored), committed here so the style can't be lost. The `.claude`/`.impeccable`
tooling that lived alongside the prototype was intentionally excluded — it isn't part
of the style.
