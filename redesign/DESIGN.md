---
name: Alice Zhao — Product Designer
description: A high-contrast editorial homepage where the designer's name is set as a halftone type specimen.
colors:
  ink: "#111111"
  paper: "#ffffff"
  muted: "#767676"
  card-placeholder: "#d9d9d9"
typography:
  display:
    fontFamily: "Satoshi, Helvetica Neue, Arial Black, Arial, sans-serif"
    fontSize: "fills viewport width (canvas-fit)"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.08em"
  headline:
    fontFamily: "Satoshi, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(40px, 7vw, 96px)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Satoshi, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(28px, 3.6vw, 48px)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  body-large:
    fontFamily: "Satoshi, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(22px, 1.8vw + 8px, 32px)"
    fontWeight: 400
    lineHeight: 1.32
    letterSpacing: "normal"
  body:
    fontFamily: "Satoshi, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(18px, 1.0vw + 12px, 24px)"
    fontWeight: 500
    lineHeight: 1.32
    letterSpacing: "normal"
  label:
    fontFamily: "Satoshi, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(15px, 1.1vw + 9px, 24px)"
    fontWeight: 400
    lineHeight: 1.32
    letterSpacing: "normal"
  nav:
    fontFamily: "Satoshi, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(13px, 0.5vw + 11px, 16px)"
    fontWeight: 400
    lineHeight: 1.32
    letterSpacing: "normal"
rounded:
  none: "0"
spacing:
  card-gap: "clamp(12px, 1.2vw, 16px)"
  gap: "clamp(12px, 1.6vw, 20px)"
  pad: "clamp(16px, 2.6vw, 32px)"
  row-gap: "clamp(48px, 6vw, 80px)"
  section-top: "clamp(64px, 9vw, 120px)"
  dot-pitch: "12px"
components:
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.nav}"
  project-title:
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
  project-meta:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
  project-tags:
    textColor: "{colors.muted}"
    typography: "{typography.body}"
  thumb:
    backgroundColor: "{colors.card-placeholder}"
    rounded: "{rounded.none}"
---

# Design System: Alice Zhao — Product Designer

## 1. Overview

**Creative North Star: "The Halftone Press"**

This is a printing press caught mid-impression. The page's whole reason to exist
is one act: a field of ink dots resolving into the name *Alice Zhao*, set
enormous in Satoshi Black. Everything else, the hairline-ruled project list, the
12-column grid, the single intro line, is the clean broadsheet around that one
inked headline. The system descends from editorial newsprint and Swiss type
specimens, not from web UI. The name is not a logo placed on a page; the name IS
the page.

The personality is **confident, precise, playful**, in that order and held in
tension on purpose. Confidence is the sheer scale of the type. Precision is the
visible grid and the hairline rules: nothing is approximate, everything snaps to
a column. Play is rationed to exactly one place, the halftone dot-morph, so that
when it happens it reads as wit rather than decoration. A discerning visitor,
recruiters, design peers, cross-functional partners, should conclude "this
person has senior craft" from the execution before reading a single word.

This system explicitly rejects the generic AI/SaaS landing page: no gradient
blobs, no identical icon-heading-text card grids, no tiny tracked uppercase
eyebrows stacked over every section, no big-number hero-metric template. It also
rejects minimal-to-a-fault: stark is not the same as forgettable, and the page
must leave a mark. And it guards against the second-order reflex, "black
Helvetica on white with a 12-column grid" is itself becoming the default
designer-portfolio look, so the halftone press moment is what keeps this from
being *just* the genre.

**Key Characteristics:**
- Near-monochrome: near-black ink on white paper, gray reserved for secondary text and image placeholders.
- One typeface (Satoshi) carrying the whole system through weight and scale, 400 to 900.
- Type set huge: the hero name fills the viewport width; project titles reach 96px.
- A visible, intentional 12-column grid with fluid `clamp()` spacing.
- Zero border-radius, zero shadow. Depth comes from scale, hairline rules, and the dot-morph, never from elevation.
- Exactly one signature motion (the halftone morph), plus a quiet looping scroll cue.

## 2. Colors

A high-contrast neutral palette: near-black ink on white paper, with a single
gray for de-emphasized text and a lighter gray for image placeholders. There is
no chromatic accent, and that is the point; the ink itself is the brand color.

### Primary
- **Ink** (`#111`): The primary mark. Body text, headings, nav links, hairline
  rules, and the dots that compose the hero name. Against paper it lands at
  roughly 18.9:1, far past AA. This near-black (not pure `#000`) softens the
  glare of large solid type while staying unambiguously "black".

### Neutral
- **Paper** (`#fff`): The page field. Pure white, treated like a broadsheet
  sheet, the negative space the type is printed onto. Most of the surface is
  paper.
- **Muted** (`#767676`): Secondary, de-emphasized text, the second clause of the
  intro line, the project tag rows. Sits at ~4.5:1 on paper, meeting AA for
  normal text. This is the **corrected** secondary; see the AA Floor Rule.
- **Card Placeholder** (`#d9d9d9`): Fill for project image placeholders before
  real imagery loads. Decorative only, never carries text.

### Spectral (cursor-lens only)
The page's only chromatic color, and it exists *exclusively* inside the cursor
lens (see the Cursor Lens component). At rest the page is pure ink-on-paper; this
gradient is never painted statically.
- **Ember** (`#ff6a3d`) → **Magenta** (`#e0218a`) → **Violet** (`#8a2be2`): a
  warm-to-cool spectral sweep, composed as `--lens-gradient` and revealed only
  under the pointer via blend modes.

### Named Rules
**The Single-Ink Rule.** There is one ink and one paper. No accent hue is ever
introduced "for interest". If a screen feels like it needs color to be
interesting, the type or the layout is underperforming; fix that instead.
**The one sanctioned exception is the Cursor Lens:** color may appear *only*
transiently, under the pointer, via the lens. It is never a static fill, never a
gradient baked into text or a surface at rest. Remove the cursor and the page is
monochrome again.

**The AA Floor Rule.** Secondary text is `#767676` (≥4.5:1 on paper), never the
legacy `#9b9b9b` (~2.6:1, fails AA). Light-gray-for-elegance is prohibited at
body sizes: the muted clause of the intro and the project tags are content, not
decoration, and must clear AA. `#9b9b9b` is deprecated and must not be used for
any text.

## 3. Typography

**Display Font:** Satoshi (with Helvetica Neue / Arial Black / Arial fallback)
**Body Font:** Satoshi (with Helvetica Neue / Helvetica / Arial fallback)

**Character:** One family does everything. Satoshi is a geometric-leaning grotesk
with a tall x-height and a true Black (900) weight; the system gets all its
contrast from weight and scale, not from pairing competing typefaces. The result
reads as disciplined and contemporary, a type specimen, not a font salad.

### Hierarchy
- **Display** (900, fills viewport width, line-height 1, tracking -0.08em): The
  hero name *Alice Zhao*, rendered on `<canvas>` for the halftone morph. The
  single loudest element on the page; tracking is pulled tight so the letters
  read as one sculpted mass.
- **Headline** (700, `clamp(40px, 7vw, 96px)`, line-height 1.08, tracking
  -0.02em): Project titles. The second-loudest voice; large enough that each
  project announces itself on the skim.
- **Title** (700, `clamp(28px, 3.6vw, 48px)`, line-height 1.08): A smaller
  heading step available for sub-headings within future content. Same tight
  tracking as Headline.
- **Body Large** (400, `clamp(22px, 1.8vw + 8px, 32px)`, line-height 1.32): The
  intro paragraph below the nav. Set generously because it is the only running
  prose on the first screen.
- **Body** (500/700, `clamp(18px, 1.0vw + 12px, 24px)`, line-height 1.32):
  Captions, project meta rows, and tags. Medium (500) for tags, Bold (700) for
  captions and the meta row. Cap running prose at 65–75ch (captions are capped
  at ~30ch by design).
- **Label** (400, `clamp(15px, 1.1vw + 9px, 24px)`, line-height 1.32): The header
  brand line ("Alice Zhao is a product designer.", hidden below 640px). Never
  uppercased.
- **Nav** (400, `clamp(13px, 0.5vw + 11px, 16px)`, line-height 1.32): The header
  nav links (Work / About / Lab, LinkedIn / Email / Resume). The quietest type on
  the page, a step below the brand line so the navigation reads as secondary;
  never uppercased. (The `--font-size-p-xs` token; also exposed as the `.p-xs`
  utility.)

### Named Rules
**The One-Family Rule.** Satoshi carries the entire system. Adding a second
typeface is prohibited unless a true functional need appears (e.g. a monospace
for code), and even then it is the exception, not a pairing.

**The Negative-Tracking Rule.** Big type tightens, it never loosens. Display
tracks -0.08em, headlines -0.02em. Never let large headings sit at default or
positive tracking; loose letters at scale read as amateur. Tracking floor is
-0.08em (letters must not touch).

**The Sentence-Case Rule.** No all-caps body copy, ever. Uppercase is reserved
for nothing on this page; even labels are sentence case. ALL CAPS sentences are
unreadable at these sizes and read as shouting.

## 4. Elevation

This system is **flat by doctrine**. There are no `box-shadow`s, no blurs, no
glass, and no border-radius anywhere. Depth and hierarchy come from three
sources only: the sheer scale contrast between the hero name and everything
else, the **dotted halftone rules** that separate project meta rows (a row of
ink dots printed at the hero's dot pitch, not a plain hairline), and the
foreground/background reading created by the halftone dot-morph. The page should
feel like ink printed on a flat sheet, not like floating cards.

### Named Rules
**The Flat-Sheet Rule.** Surfaces are flat. If a future element seems to need a
shadow to be legible, the contrast or the spacing is wrong; fix that instead of
lifting it off the page. The only "elevation" is a hairline rule or the grid.

**The Sharp-Corner Rule.** Border-radius is `0` everywhere. Rounded corners are
prohibited; the broadsheet aesthetic depends on crisp right angles.

**The Halftone Grammar Rule.** The hero's dots are the page's language, not a
one-off trick. The same ink-dot lattice, printed at the hero pitch
(`--dot-pitch`, tied to `--hero-cell`), recurs as structure: the dotted rule
above every project. Plain hairlines are retired. Any new divider or separator
should ask whether it can carry the halftone instead of a solid line, so the
motif reads as a system. The hero is the one element allowed to break the grid
(full-bleed, edge to edge); everything else obeys the `--space-pad` gutters. One
bleed, not many: keep the name as the sole grid-escaping element.

## 5. Components

### Navigation
- **Style:** A 12-column header row. Brand line occupies columns 1–5; a center
  nav (Work / About / Lab) sits at columns 7–9; utility links (LinkedIn / Email
  / Resume) right-align at columns 9–13.
- **Typography:** Nav links use the Nav scale (`clamp(13px, 0.5vw + 11px, 16px)`,
  the `--font-size-p-xs` token), regular weight, Ink. The brand line uses the
  larger Label scale (`clamp(15px, 1.1vw + 9px, 24px)`), so the links sit a clear
  step below the brand.
- **States:** Links are Ink with no underline at rest; `text-decoration:
  underline` on hover. No color shift, no background, no pill.
- **Mobile:** Below 640px the brand line is hidden (`display: none`) and the two
  nav groups share a single row (center-left, utility-right). Below 380px the nav
  groups are allowed to wrap rather than overflow. The name stays in the DOM via
  the hero `<h1>`, so nothing is lost for SEO / assistive tech.

### Project Card
- **Corner Style:** Sharp (radius `0`).
- **Structure:** Each project spans all 12 columns and splits into two equal
  halves, a text half and a media half, with a `clamp(12px, 1.6vw, 20px)` gap.
- **Checkerboard:** Odd-numbered projects place the image on the **left**, text
  on the right; even projects mirror it. This alternation is the rhythm of the
  list.
- **Text half:** A meta row (role @ company, left; year, right) sitting under a
  `1px solid #111` top rule, then the project title (Headline scale), then a tag
  line (Body, Muted).
- **Media half:** A placeholder thumb (`#d9d9d9`, aspect-ratio `1 / 0.82`,
  `object-fit: cover` when an image is present) followed by a bold caption capped
  at ~30ch.
- **Background / Shadow / Border:** None, none, and only the single hairline top
  rule on the meta row. See Elevation.
- **Internal Padding:** Items inside a half are stacked with `clamp(12px, 1.2vw,
  16px)` gaps; rows are separated by `clamp(48px, 6vw, 80px)`.
- **Mobile:** Below 640px each project collapses to a single column, stacked
  text → image → caption, and the desktop image-left order is reset.

### Hero Name (Signature Component)
- **What:** The name *Alice Zhao* drawn on `<canvas>` as a halftone dot lattice
  that morphs between airy open dots and solid letterforms, looping (hold solid →
  breathe to dots → back). Dots are sampled from rendered Satoshi Black glyphs,
  quantized into three discrete sizes for a true halftone texture, and clipped to
  a crisp (optionally dilated) glyph mask so edges stay razor-clean.
- **Load intro:** On first paint the name assembles in three beats, one per
  letter then the whole field: (1) **seed** — one representative dot from each
  letter of "Alice Zhao" pops in, one by one, left to right (A, l, i, c, e, Z,
  h, a, o; the space is skipped); (2) **fill** — the rest of the halftone dots
  arrive to complete the airy field; (3) **merge** — the existing dot-merge
  morph runs once, resolving to the solid name. The page content (header, intro,
  projects) is held hidden behind a `.preloading` flag and **reveals at the
  start of the merge**, when the name is legible, in a brief staggered
  fade-and-rise; the idle breathing loop takes over once the merge completes.
  Letter centres are derived deterministically from the font (`measureText` on
  cumulative substrings), never pixel-scanned, so it can't split an "A" or merge
  a tight pair.
- **Accessibility:** A real `<h1>Alice Zhao</h1>` stays in the DOM
  (visually hidden) and the canvas carries `role="img"` with
  `aria-label="Alice Zhao"`. Canvas type must always keep this text equivalent.
- **Reduced motion:** Both the load intro and the morph loop must have a
  `prefers-reduced-motion: reduce` path. Under reduced motion the page shows the
  solid name and all content immediately, with no seed/merge animation and no
  breathing loop. The `.preloading` flag is added inline in `<head>` only when
  JS is on AND motion is allowed, so no-JS and reduced-motion visitors never see
  a hidden page. A failsafe (`forceFinish` at 4s) guarantees the page is never
  left hidden or the hero half-drawn even if the rAF loop stalls (backgrounded
  tab, a font that never resolves).
- **Full-bleed:** The hero is the one element that escapes the `--space-pad`
  gutters and prints edge to edge (`.hero` zeroes its horizontal padding). The
  canvas's internal margin (`ceil(--hero-cell * 1.25) + 1` ≈ 16px) reserves room
  for the dilating dots so the letters never clip the viewport at the bleed.
- **Why it earns its place:** This is the one playful, inventive moment. Keep
  everything around it disciplined so it lands.

### Scroll Cue
- **Style:** A thin (2px) vertical segment ("runner") with a fading
  afterimage ("trail"), bottom-right, that travels downward on an
  ease-in/ease-out loop (`cubic-bezier(0.7, 0, 0.3, 1)`, 1.8s) to imply "keep
  scrolling".
- **Reduced motion:** Under `prefers-reduced-motion: reduce` the runner rests
  static and the trail is hidden.
- **Decorative:** `aria-hidden="true"`. It informs, it must never trap or
  scroll-jack.

### Dotted Project Rule
- **What:** The divider above each project's meta row. A single row of ink dots
  at the hero pitch (`--dot-pitch`), drawn as a `radial-gradient` on
  `.project .meta::before`, replacing the old 1px hairline.
- **Why:** Makes the halftone the page's structural grammar; the dividers are
  visibly the same ink-dots as the name, recurring 3× down the list.

### Cursor Lens (Signature Interaction)
- **What:** A soft gradient disc (`--lens-gradient`, ember→magenta→violet,
  `--lens-size` diameter) follows the pointer and recolors the content beneath
  it. The page is pure ink-on-paper at rest; color exists *only* under the
  cursor (the sanctioned exception to the Single-Ink Rule).
- **How it covers everything:** a single `position: fixed` `.lens` element with
  `mix-blend-mode: lighten` blends over the whole page at once. Because lighten
  is `max(layer, gradient)`, near-black ink (`#111`) takes the gradient color
  while white paper (`max(#fff, …) = #fff`) stays white, recoloring text, the
  `<canvas>` hero name, and image darks uniformly. A feathered radial mask gives
  the disc a soft rim (no hard circular edge).
- **Images get a stronger blend:** each `.thumb::after` adds a second overlay
  with `mix-blend-mode: color` (maps the gradient's hue+saturation onto the
  image while keeping its luminance), masked to a disc centered on the cursor's
  position *within that thumb* (`--lx`/`--ly`). This reads vividly at any
  brightness, where lighten alone would barely touch a light image.
- **Performance:** JS coalesces `pointermove` to one DOM write per frame
  (`requestAnimationFrame`), positions the lens with `translate3d` (compositor),
  and toggles `.lens-on` / `.is-hovering` on enter/leave.
- **Exclusions:** gated to `(hover: hover) and (pointer: fine)` (no touch) and
  **disabled under `prefers-reduced-motion: reduce`** (a large color field
  chasing the cursor is a vestibular trigger). Decorative: `aria-hidden`,
  `pointer-events: none`, never intercepts input.

## 6. Do's and Don'ts

### Do:
- **Do** let the type be the design. Set the name and project titles huge; scale
  contrast is the primary hierarchy tool.
- **Do** keep everything on the visible 12-column grid with the fluid `clamp()`
  spacing tokens. Alignment is the argument for precision.
- **Do** use `#767676` for all secondary/de-emphasized text (≥4.5:1 on paper).
- **Do** keep one playful moment (the halftone morph) and keep its surroundings
  disciplined so it reads as wit, not noise.
- **Do** carry the halftone as the page's grammar: dividers print the hero's
  ink-dots at `--dot-pitch`, not solid hairlines (the Halftone Grammar Rule).
  Keep the hero as the sole full-bleed, grid-escaping element.
- **Do** ship a `prefers-reduced-motion: reduce` path for the hero morph and the
  scroll cue, and keep the real `<h1>` text behind the canvas.
- **Do** tighten tracking on large type (-0.08em display, -0.02em headlines) and
  never loosen it.

### Don't:
- **Don't** introduce a *static* accent hue or gradient. One ink, one paper (the
  Single-Ink Rule). No `background-clip: text` gradient headings, no gradient
  baked into a surface at rest. The *only* color is the Cursor Lens, and only
  transiently under the pointer; at rest the page is monochrome.
- **Don't** use `#9b9b9b` (or any sub-4.5:1 gray) for text; it fails AA. Legacy
  value is deprecated.
- **Don't** build the generic AI/SaaS landing page: no gradient blobs, no
  identical icon-heading-text card grids, no tiny uppercase tracked eyebrows over
  every section, no big-number hero-metric template.
- **Don't** let it become minimal-to-a-fault. Stark is fine; forgettable is a
  failure. The page must leave a mark.
- **Don't** settle for "black Helvetica on white grid" as the whole idea, that's
  the second-order portfolio reflex; the halftone press moment is what
  differentiates it.
- **Don't** add border-radius, shadows, blur, or glass (the Flat-Sheet and
  Sharp-Corner Rules). Depth comes from scale, hairlines, and the morph.
- **Don't** add a second typeface without a real functional need; Satoshi carries
  the system.
- **Don't** set body copy in ALL CAPS, and don't let large headings overflow
  their grid track at any breakpoint, test the title copy at tablet and mobile.
