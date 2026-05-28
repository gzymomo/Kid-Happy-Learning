---
title: "Cleanup: meta.totalStars in content.json is unused"
labels: ["cleanup"]
---

## Description

`data/content.json` includes a `meta.totalStars` field (line 5) that is never read or updated by the application code. Stars are tracked exclusively in `localStorage` via `state.stars`.

This field is misleading for content editors who might update it expecting it to have an effect.

## Current State

`data/content.json:5`:
```json
"totalStars": 0
```

The corresponding `js/app.js` uses `state.stars` from localStorage and never references `content.meta.totalStars`.

## Recommended Fix

Either:
1. **Remove** `totalStars` from `meta` since it is unused, or
2. **Use it** as a default/initial value when localStorage is empty

## Files

- `data/content.json:5`
- `js/app.js:53` (state initialization skips it)
