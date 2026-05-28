---
title: "Requirements gap: Parent zone long-press logo entry not implemented"
labels: ["enhancement", "requirements-gap"]
---

## Description

Requirement §14.1 specifies two ways to enter the parent zone:
1. **长按Logo 3秒** (long-press logo 3 seconds) — **NOT IMPLEMENTED**
2. **连续点击右下角空白处5次** (click bottom-right blank 5 times) — implemented via footer triggers

Only the 5-click footer method exists. The long-press gesture on the logo/home button is missing.

## Current Behavior

- `js/app.js:545-553`: `initFooterTriggers()` only handles the footer click counter
- No `longpress` or `touchstart`/`touchend` timer logic exists for the logo or home button
- `index.html` has a home button (`#backBtn`) but no long-press handler is attached

## Required Fix

Add long-press detection on a logo/home element:
- Use the existing `#backBtn` or add a dedicated logo element
- Handle `touchstart`/`touchend` for mobile and `mousedown`/`mouseup` for desktop
- Prevent accidental triggers (3s hold as specified, with visual feedback)

## Files

- `js/app.js:545-553` (only footer method exists)
- `index.html:46-49` (back button could serve as logo target)
