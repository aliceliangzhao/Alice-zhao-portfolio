# Shapes Grid Demo

This folder contains a readable reference implementation of the hoverable shapes-grid effect and a simpler reusable decorative variant.

## Files

- `index.html`: full demo page that mounts both examples.
- `codepen.css`: all styling for the page, the full-screen grid, and the decorative component.
- `codepen.js`: shared canvas hover engine plus two explicit builders.

## Included Examples

### 1. Full-Screen Reference

- Full-viewport canvas background
- Left-aligned overlay text
- Nav excluded from the grid
- Text excluded from the grid line-by-line, not as one big rectangle
- Same hover scaling and color-reveal behavior as the original effect

### 2. Reusable Decorative Component

- Full-width decorative strip
- Exactly 4 rows of shapes
- Label text sits on the left side of the last row
- Example label: `previous work`
- Rows 1-3 span the full width
- Row 4 starts after the label width plus padding
- Uses the same hover interaction and color behavior as the full-screen version

## How The JS Is Structured

The JS is intentionally shallow so another LLM can follow it quickly:

- Shared helpers for color mixing, shape drawing, and hover animation
- `buildFullScreenShapes(...)` for the large reference version
- `buildDecorativeShapes(...)` for the 4-row reusable component
- `mountGridSurface(...)` for mounting either surface with the same hover engine

## Important Design Rules

- The effect is canvas-based, not DOM-dot-based.
- Shapes can be circles, pills, or stars.
- Idle state uses gray shapes with occasional flashing bursts.
- Real hover pauses the idle flashing, then idle resumes after a delay.
- The blur/glow effect is currently disabled in the render loop.
- Light mode uses a white background; dark mode uses the original dark background.

## What To Reuse In Another Project

If another project only needs the effect logic, the main files to reuse are:

- `index.html`
- `codepen.css`
- `codepen.js`
