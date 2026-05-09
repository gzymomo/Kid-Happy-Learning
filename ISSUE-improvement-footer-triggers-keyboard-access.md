---
title: "Improvement: Footer trigger dots not keyboard accessible"
labels: ["accessibility", "enhancement"]
---

## Description

The footer trigger dots in `index.html:64-69` are `<span>` elements with no `role="button"` or `tabindex`, making them unreachable via keyboard navigation.

```html
<div class="footer-triggers" id="footerTriggers">
    <span class="trigger-dot" data-click="0"></span>
    <span class="trigger-dot" data-click="1"></span>
    <!-- ... -->
</div>
```

The click handler is on the parent container (`js/app.js:547`), so individual dots aren't focusable or actionable via keyboard.

## Impact

- Users relying on keyboard navigation (TV remote, accessibility tools) cannot trigger the parent zone entry
- Violates requirements.md §12 (WCAG 2.1 AA keyboard navigation)

## Suggested Fix

Option A: Add `tabindex="0"` and `role="button"` to the parent `#footerTriggers` div and handle Enter/Space on it.
Option B: Make individual dots focusable and track which dot is focused for the click count.

## Files Affected

- `index.html`
- `js/app.js` — add keyboard handler for footer triggers
