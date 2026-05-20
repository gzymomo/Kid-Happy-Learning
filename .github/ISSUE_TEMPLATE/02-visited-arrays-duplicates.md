---
title: Visited learning arrays accumulate duplicate entries
labels: bug
---

## Summary

In `renderLetters`, `renderWords`, and `renderChinese`, each card click unconditionally pushes the item ID to the corresponding `state.visited*` array without deduplication. Repeated clicks bloat these arrays.

## Impact

1. **Parent zone stats**: `state.visitedLetters.length` inflates over time, making progress numbers unreliable.
2. **Storage bloat**: Arrays grow unbounded in localStorage.
3. **Misleading progress**: A child who clicks the same letter 10 times shows "10/7" letters learned.

## Locations

- `js/app.js:228` — `state.visitedLetters.push(letter.id)` — no dedup
- `js/app.js:249` — `state.visitedWords.push(word.id)` — no dedup
- `js/app.js:270` — `state.visitedChinese.push(cn.id)` — no dedup

## Suggested Fix

Check if the ID already exists before pushing:

```js
if (state.visitedLetters.indexOf(letter.id) === -1) {
  state.visitedLetters.push(letter.id);
}
```
