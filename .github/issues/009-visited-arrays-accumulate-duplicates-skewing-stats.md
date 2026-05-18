---
title: "Visited item arrays accumulate duplicates, skewing progress stats"
labels: bug
---

## Description

When a user clicks a learning card multiple times, `visitedLetters`, `visitedWords`, or `visitedChinese` arrays get duplicate entries pushed without deduplication. This inflates the progress statistics shown in the parent zone.

## Current behavior

In `js/app.js`:
- `renderLetters` (line 228): `state.visitedLetters.push(letter.id)` — no check if already visited
- `renderWords` (line 249): `state.visitedWords.push(word.id)` — no check
- `renderChinese` (line 270): `state.visitedChinese.push(cn.id)` — no check

Parent zone stats use `.length` directly (line 518-520):
```js
document.getElementById('statLetters').textContent = state.visitedLetters.length + '/7';
```

If a child clicks "A" five times, stats show "5/7" instead of "1/7".

## Expected behavior

- Only add to visited array if the id is not already present
- Use a `Set` or filter duplicates before pushing
- Or simply don't track visited in real-time — only count unique items

## Affected file

- `js/app.js:228-230, 249-250, 270-271`
