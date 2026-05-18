---
title: "Stars display not shown on home page as required"
labels: enhancement
---

## Description

The requirements state **"星星展示：首页顶部显示当前星星总数"** (Section 3.1). However, the star display (`#starsDisplay`) is only rendered inside `.learning-header`, which is only visible when a learning category is active. The home page has no star count visible.

## Requirements reference

- **Section 3.1**: "星星展示：首页顶部显示当前星星总数"

## Current behavior

- `#starsDisplay` is inside `.learning-header` in `index.html:51-54`
- Stars are only visible after navigating into a learning category
- Home page (`#homeView`) has no star counter

## Expected behavior

- Star count should be visible on the home page, positioned near the header
- Consider moving `#starsDisplay` to the `.main-content` or duplicating it for the home view
- Alternatively, restructure so a persistent header shows stars on all views

## Affected files

- `index.html` — stars display only in learning view
- `js/app.js` — `updateStarsDisplay()` targets `#starCount` which is hidden on home page
