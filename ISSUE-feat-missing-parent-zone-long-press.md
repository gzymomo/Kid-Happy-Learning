---
title: "Missing Feature: Long-press logo entry to parent zone (per requirements)"
labels: ["enhancement", "requirements-gap"]
---

## Description

**Requirements.md §14.1** specifies two ways to enter the parent zone:

> 1. 长按Logo 3秒 → 进入家长区（防止儿童误入）
> 2. 或连续点击右下角空白处5次

Only the **5-click footer method** is implemented (`js/app.js:545-553`). There is no logo element in the app, and no long-press handler.

Additionally, the requirement mentions "右下角空白处" (lower-right corner), but the footer trigger is centered, not in the lower-right.

## Impact

- Parents accustomed to long-press patterns from other children's apps won't find the expected entry method
- The centered footer trigger is more easily discoverable by children, reducing the "child-proof" intent
- No logo exists in the app at all, so the long-press method cannot work

## Suggested Fix

1. Add a logo element (e.g., an icon or the app name) to the home page header or footer area
2. Implement a long-press/touch-hold detection (3 second `setTimeout` on `touchstart`/`mousedown`, cancelled on `touchend`/`mouseup`/`touchmove`)
3. Optionally move the footer trigger dots to the right side of the footer

## Files Affected

- `index.html` — add logo element
- `js/app.js` — add long-press event listener
- `css/styles.css` — style logo area
