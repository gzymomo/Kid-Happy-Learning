---
title: "Parent zone entry method differs from requirements"
labels: bug
---

## Requirement

`requirements.md` §6 (Q5) and §14.1 specify:
- **Long press Logo 3 seconds** → enter parent zone
- Or **continuous click on bottom-right blank area 5 times**

## Implementation

`js/app.js:545-554` implements a 5-click on the **footer trigger dots** (`.footer-triggers`), which have `opacity: 0` (CSS line 887) and are invisible by default. There is no long-press-on-logo mechanism.

## Issues

1. The entry method does not match the specification
2. The invisible trigger dots are extremely hard to discover
3. The requirement's primary method (long press logo) is not implemented

## Suggested Fix

Implement the long-press-on-logo entry as specified, or update the requirements to match the actual implementation. If keeping the dot method, make them slightly visible or document the easter egg.
