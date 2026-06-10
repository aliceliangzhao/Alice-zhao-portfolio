# Product

## Register

brand

## Users

Three audiences land on this page, all of them discerning and all of them
skimming fast:

- **Hiring managers & design leaders / recruiters.** Evaluating Alice for a
  senior product-design role. They form a verdict in seconds and want proof of
  taste, seniority, and impact, not a reading assignment.
- **Design peers & the design community.** Other designers judging craft,
  originality, and process. The highest bar in the room: they recognize
  template moves and reward genuine signature work.
- **Cross-functional partners (PMs, engineers, founders).** Assessing how Alice
  thinks and ships, not just how things look.

Context: this is the **homepage of an existing portfolio** that Alice already
owns. It is the first surface every visitor sees, viewed once, often briefly,
frequently on a recruiter's second monitor between other tabs. It is not the
whole site; deeper case studies live elsewhere in her own codebase. This page's
only job is the first impression and the pull into the work.

## Product Purpose

A single-page homepage design whose purpose is to make a discerning visitor
believe, within seconds, that Alice Zhao is an exceptional product designer, and
then pull them toward her work.

Success is not a click. Success is the impression: the page itself is the
portfolio piece. Its execution, the type, the hero motion, the grid discipline,
has to *demonstrate* senior craft so the visitor concludes it before reading a
word of copy.

This is an experimental redesign of the homepage only. It will be fed back into
Alice's existing portfolio codebase later, so the implementation has to be
**legible and portable**: clean structure, token-driven, no surprise
dependencies, easy for a coding agent (or Alice) to lift into another project.

## Brand Personality

**Confident, precise, playful**, in that priority order, and held in tension on
purpose.

- **Confident** — big decisive type, committed choices, nothing timid or
  hedged. The black Satoshi hero name sets the register.
- **Precise** — Swiss/editorial rigor. A visible, intentional grid; restraint;
  every detail considered. This is what reads as *senior*.
- **Playful & inventive** — one earned moment of wit and motion (the halftone
  dot-morph on the hero name) that proves there's a person with ideas behind the
  discipline.

Voice in copy: plain, specific, first-person-by-implication. Short factual lines
("Currently designing agentic experience at Amazon AWS"), never marketing
adjectives. The work carries the weight; the words just point at it.

## Anti-references

- **Generic AI / SaaS landing pages.** No gradient blobs, no identical
  icon-heading-text card grids, no tiny uppercase tracked eyebrows over every
  section, no big-number hero-metric template. These read as template, and this
  audience punishes template instantly.
- **Minimal-to-a-fault / forgettable.** Tasteful-but-invisible is a failure
  here. The page must leave a mark. Quiet restraint everywhere is just as wrong
  as noise everywhere.
- **The second-order Swiss-portfolio reflex.** "Black Helvetica on white with a
  12-column grid" is itself becoming a designer-portfolio default. Staying in
  the editorial lane is right, but the page still needs a distinct signature
  (the hero motion is the current candidate) so it isn't *just* the genre.
- **Award-site spectacle for its own sake.** Heavy WebGL and scroll-jacking are
  inspiration for ambition, not a license for friction. Motion must serve the
  impression, never trap the recruiter who's trying to scan.

## Design Principles

1. **Show senior craft, don't claim it.** The page's own execution is the
   argument. If a visitor has to read words to believe Alice is good, the design
   already failed. Impression comes from quality of build, not adjectives.
2. **One signature moment, earned.** Spend the inventiveness budget in one
   memorable place (today: the hero name's halftone morph) and keep everything
   around it disciplined so that moment lands instead of competing.
3. **The grid is the argument for precision.** Swiss structure is visible and
   intentional. Alignment, rhythm, and restraint are how this page *says*
   "rigorous" without a single word.
4. **Respect the skim.** The primary visitor is fast and distracted. Hierarchy,
   motion, and information order must reward a 5-second glance first, and a
   deeper read second, never the reverse.
5. **Build it so it travels.** This homepage will be lifted into an existing
   codebase. Favor clean, self-documenting, token-driven, dependency-light
   implementation that a coding agent can understand and port without
   archaeology.

## Accessibility & Inclusion

Target **WCAG 2.1 AA**, and treat accessibility as part of the craft the page is
trying to demonstrate, not an afterthought.

- **Canvas-rendered text needs a real text equivalent.** The hero name is drawn
  on `<canvas>`; keep the genuine `<h1>` in the DOM with an accessible name on
  the canvas (the current code does this). Any future canvas/SVG type treatment
  must keep its text accessible to screen readers and search.
- **Reduced motion is required, not optional.** The hero dot-morph and the
  scroll cue must have a `prefers-reduced-motion: reduce` path (a static solid
  hero, no looping cue). The current code already does this; preserve it.
- **Contrast must hold.** Body and secondary text must meet AA (≥4.5:1).
  Note: the current `--color-muted` (#9b9b9b on #fff ≈ 2.6:1) used for the intro
  and project tags fails AA and should be darkened toward the ink end of the
  ramp.
- **Motion that informs, not traps.** No scroll-jacking or motion that blocks a
  visitor from reaching the work. Looping animation should be subtle enough to
  ignore.
