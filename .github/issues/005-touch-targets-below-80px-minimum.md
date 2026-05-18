---
title: "Some touch targets below 80×80px minimum"
labels: bug
---

## Description

The requirements specify a minimum touch target of **80×80px** with at least 12px spacing (Section 3.4, based on Smashing Magazine guidelines). Several interactive elements fall below this threshold.

## Requirements reference

- **Section 3.4**: "触控目标：最小 80×80px，间距 ≥ 12px"
- **G-03**: "所有可点击元素≥80×80px"

## Elements below 80px on at least one dimension

| Element | Current size | Required | File |
|---------|-------------|----------|------|
| `.back-btn` | min-height: **60px** | 80px | css/styles.css:325-328 |
| `.modal-close` | width/height: **44px** | 80×80px | css/styles.css:495-496 |

## Additional notes

- The back button is a primary navigation element used frequently by children — undersized touch target risks frustration
- The modal close button, though visually small, should have a larger invisible hit area (padding or ::before pseudo-element)

## Affected file

- `css/styles.css` — lines 325, 495
