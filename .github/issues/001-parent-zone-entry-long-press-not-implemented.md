---
title: Parent zone entry via long-press on logo not implemented
labels: bug, requirements-gap
---

## Description

Requirements section 14.1 specifies two methods to enter the parent zone:
1. **Long-press Logo 3 seconds** → enter parent zone (prevents children from accidentally accessing it)
2. Click 5 small dots in the footer

Only method #2 (5-click on footer triggers) is implemented in `js/app.js:545-554`. The long-press on logo method is not implemented.

## Impact

Users who expect to long-press the logo (a common pattern in children's apps for parent gates) cannot access the parent zone. The only entry method (footer dots) is hidden and unintuitive.

## Location

- `js/app.js` — `initFooterTriggers()` only handles the 5-click footer trigger
- No event listener exists for a long-press on any logo/branding element
- `index.html` — no logo element with a `longpress` / `mousedown`/`touchstart` timer handler

## Suggested Fix

Add a long-press handler on the title or a logo element that triggers `showParentModal()` after a 3-second hold:

```js
// Example approach
var pressTimer = null;
var logoEl = document.getElementById('homeTitle'); // or similar
logoEl.addEventListener('mousedown', startPressTimer);
logoEl.addEventListener('touchstart', startPressTimer);
logoEl.addEventListener('mouseup', clearPressTimer);
logoEl.addEventListener('touchend', clearPressTimer);
logoEl.addEventListener('mouseleave', clearPressTimer);

function startPressTimer(e) {
  pressTimer = setTimeout(showParentModal, 3000);
}
function clearPressTimer() {
  clearTimeout(pressTimer);
}
```
