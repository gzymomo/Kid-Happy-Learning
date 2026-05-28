---
title: "TV keyboard navigation: arrow key support missing for focus movement"
labels: ["enhancement", "accessibility"]
---

## Description

Requirement §1 (Target Users) specifies TV support with direction-key + Enter keyboard navigation when touch is unavailable. Requirement G-04 also mandates Tab/方向键+Enter support.

The current implementation only handles Enter/Space on individual elements but does **not** implement arrow-key-based focus movement between cards, which is essential for TV/remote control navigation.

## Current Behavior

- `js/app.js:273-277, 293-297`: Only `Enter` and `Space` keydown handlers are added to individual cards
- No `keydown` listener on the grid container for arrow key focus movement
- No focus trap or roving tabindex pattern for TV-style navigation
- The `.no-touch` class is applied when `maxTouchPoints === 0`, but arrow key navigation is missing

## Required Fix

Implement arrow-key focus navigation for the grid and category card layouts:
1. Listen for `ArrowUp`/`ArrowDown`/`ArrowLeft`/`ArrowRight` on card containers
2. Implement roving tabindex or programmatic focus movement between cards
3. Ensure quiz option navigation also works with arrow keys
4. Test with `navigator.maxTouchPoints = 0` simulation

## Files

- `js/app.js:188-193` (touch detection)
- `js/app.js:273-277, 293-297` (existing keyboard handlers)
- `css/styles.css:903-922` (`.no-touch` focus styles exist but no JS navigation logic)
