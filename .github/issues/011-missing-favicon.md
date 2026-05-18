---
title: "Missing favicon for PWA"
labels: enhancement
---

## Description

The app has a `manifest.json` with icons but no favicon is linked in `index.html`. This means browser tabs will show a generic icon.

## Affected file

- `index.html` — no `<link rel="icon">` tag
- `assets/` — only contains `.gitkeep`, no actual icon files

## Note

The manifest.json references `assets/icon-192.png` and `assets/icon-512.png` which also do not exist yet. These should be generated before PWA deployment.
