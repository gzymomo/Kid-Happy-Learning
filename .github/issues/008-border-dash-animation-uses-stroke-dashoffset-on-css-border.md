---
title: CSS border-dash animation uses SVG property on CSS border (no effect)
labels: bug
---

## Description

In `css/styles.css:214-219`, the `.category-card::after` pseudo-element uses a `borderDash` animation with `stroke-dashoffset: -100`:

```css
@keyframes borderDash {
  to { stroke-dashoffset: -100; }
}
```

The `stroke-dashoffset` property only works on SVG elements, not on CSS borders. This animation has no visual effect and produces no visible dash movement on the border.

## Impact

- Dead CSS code (animation does nothing)
- Category card dashed border decoration is static, not animated as intended
- Child-safe animation affordance is lost

## Location

`css/styles.css` lines 214-219

## Suggested Fix

Remove the dead animation, or implement a proper CSS border animation using a different technique (e.g., a `conic-gradient` mask or SVG border). Simpler approach: just use the dashed border without animation, or remove the `::after` decoration entirely for cleaner styling.

```css
.category-card::after {
  /* Remove the borderDash animation since it has no effect on CSS borders */
  /* or keep the static dashed border */
}
```
