---
title: "Parent zone entry: long-press Logo 3s not implemented"
labels: ["enhancement", "medium"]
---

## Description

§14.1 specifies two ways to enter the parent zone:
1. **Primary:** 长按Logo 3秒 → 进入家长区（防止儿童误入） (long-press the Logo for 3 seconds)
2. **Secondary:** 或连续点击右下角空白处5次 (or tap the bottom-right empty area 5 times)

Only the secondary method (footer triggers 5-click) is implemented in `js/app.js:545-554`.

## Impact

- Children can more easily stumble into the parent zone since the footer area is accessible
- The more deliberate, child-proof entry method (long-press) is missing
- Requirement Q5 specifies long-press as the primary method

## Suggestion

Add a long-press listener on the app logo (or title element) with a 3-second timer. Show a visual progress indicator during the hold (e.g., a circular progress or countdown). When the timer completes, open the parent modal.

```js
let longPressTimer;
titleElement.addEventListener('pointerdown', () => {
  longPressTimer = setTimeout(showParentModal, 3000);
});
titleElement.addEventListener('pointerup', () => clearTimeout(longPressTimer));
titleElement.addEventListener('pointerleave', () => clearTimeout(longPressTimer));
```
