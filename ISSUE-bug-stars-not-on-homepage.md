---
title: "Bug: Stars not displayed on home page as required"
labels: ["bug", "requirements-gap"]
---

## Description

**Requirements.md §3.1** states:

> 星星展示：**首页顶部**显示当前星星总数

The star display (`#starsDisplay`) exists only inside the `#learningView` header, not on the home view (`#homeView`). On the home page (`index.html:23-42`), there is no star count element at all.

## Impact

Children cannot see their accumulated star count from the home screen, reducing motivation and the gamification feedback loop described in the requirements.

## Suggested Fix

Add the star display to the home view header (above the category cards) alongside the "欢迎小朋友!" title, and ensure `updateStarsDisplay()` updates both home and learning view star elements.

## Files Affected

- `index.html` — add star display to home view
- `js/app.js` — `updateStarsDisplay()` may need to target both locations
