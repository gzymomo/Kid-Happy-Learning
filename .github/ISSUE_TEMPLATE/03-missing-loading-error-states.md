---
title: No loading or error state for async content fetch
labels: enhancement
---

## Summary

The app fetches `data/content.json` asynchronously with no loading indicator, error recovery, or guard against early interaction.

## Impact

1. **Crash on early interaction**: Clicking a category card or quiz button before fetch completes throws `TypeError` because `content` is `null`.
2. **Silent failure**: If `content.json` fails to load, only `console.error` is called — no user-facing error UI.

## Location

- `js/app.js:660-669` — `fetch` with no loading state, no retry, no error UI

## Suggested Fix

1. Show a loading spinner while fetching
2. Disable interactive elements until content loads
3. On fetch error, show a retry button
4. Add null guards before `content` property access
