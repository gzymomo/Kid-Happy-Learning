---
title: "Long-press on logo not implemented for entering parent zone"
labels: enhancement
---

## Description

Section 14.1 specifies two ways to enter the parent zone:
1. Long-press the Logo for 3 seconds
2. Click the footer 5 times

Only the footer click method is implemented (`initFooterTriggers` in js/app.js:545-554). The long-press on logo is not implemented.

## Requirements reference

- **Section 14.1**: "长按Logo 3秒 → 进入家长区（防止儿童误入）"

## Current behavior

- No long-press handler on any element
- Only the hidden footer 5-click sequence works (`js/app.js:545-554`)

## Expected behavior

- Long-pressing the logo/title area for 3 seconds should open the parent modal
- Should use `touchstart`/`touchend` events with timing for mobile, and `mousedown`/`mouseup` for desktop
- Should provide visual feedback (e.g., progress ring or haptic) during the long-press
- Should cancel if finger/mouse moves away before 3 seconds

## Affected files

- `index.html` — no long-press target defined (could use the home title or a dedicated element)
- `js/app.js` — no long-press handler
