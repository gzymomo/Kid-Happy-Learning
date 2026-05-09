---
title: "Improvement: `meta.totalStars` in content.json is unused dead data"
labels: ["cleanup"]
---

## Description

`data/content.json` contains:
```json
"meta": {
    "version": "1.0.0",
    "lastUpdated": "2026-04-29",
    "totalStars": 0
}
```

The `totalStars` field is never read or written by the application. Star tracking is handled entirely through `localStorage` in `js/app.js`. This field is misleading — since `content.json` is a static file, it cannot be dynamically updated with live star counts.

## Suggested Fix

Remove `totalStars` from `data/content.json` meta to avoid confusion, or rename it to `initialStars`/`defaultStars` if it serves a purpose (e.g., seeding a default value).

## Files Affected

- `data/content.json`
- `requirements.md` §4.1 (content model example, if applicable)
