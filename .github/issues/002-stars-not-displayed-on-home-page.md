---
title: Stars count not displayed on home page as required
labels: bug, requirements-gap
---

## Description

Requirements section 3.1 states: **"星星展示：首页顶部显示当前星星总数"** — Stars should be shown at the top of the home page.

Currently, the star display (`#starsDisplay`) is only rendered inside `#learningView` (`index.html:51-54`). When on the home view (`#homeView`), the star count is not visible anywhere.

## Impact

- Children cannot see their accumulated stars when choosing a learning module
- Reduced motivation from the reward system since stars are only visible after entering a learning section
- Direct contradiction of an explicit requirement

## Location

- `index.html:51-54` — stars display only in `#learningView`
- `app.js:70-73` — `updateStarsDisplay()` only updates `#starCount` which is inside `#learningView`

## Suggested Fix

Move the star display element into the home view (e.g., above `#categoryCards`), or duplicate it so it appears on both views. Update `updateStarsDisplay()` to handle both locations.

```html
<!-- In homeView, e.g. before .category-cards -->
<div class="stars-display" aria-label="星星数量">
  <span class="star-icon">⭐</span>
  <span class="star-count" id="homeStarCount">0</span>
</div>
```
