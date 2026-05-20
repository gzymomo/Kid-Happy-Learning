---
title: "Star count displayed in learning view, not on home page top (requirements §3.1)"
labels: bug
---

## Requirement

`requirements.md` §3.1 states:
> 星星展示：首页顶部显示当前星星总数

Stars should be visible on the home page top at all times.

## Implementation

The star display (`#starsDisplay`) is only rendered inside the `.learning-view` header (`index.html:51`), which is hidden (`hidden` class) on the home page. Stars are not visible from the home view.

## Suggested Fix

Move the star display to the home view or add it to both views. For example, include it in the `.home-view` section above the category cards.
