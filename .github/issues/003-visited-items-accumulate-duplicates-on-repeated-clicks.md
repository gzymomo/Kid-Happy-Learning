---
title: Visited items arrays accumulate duplicate entries on repeated clicks
labels: bug
---

## Description

In `js/app.js`, clicking a learning card pushes the item ID into the visited array without checking for duplicates:

- `renderLetters()` line 228-229: `state.visitedLetters.push(letter.id)` — called every click
- `renderWords()` line 249-250: `state.visitedWords.push(word.id)` — called every click
- `renderChinese()` line 269-270: `state.visitedChinese.push(cn.id)` — called every click

If a child taps the same letter/word/character card multiple times, the array accumulates duplicates. This inflates the progress stats shown in the parent zone (`app.js:518-520`).

## Impact

- Parent zone stats will show incorrect progress (e.g., "15/7" for letters after tapping the same letter multiple times)
- Misleading learning progress reporting

## Location

`js/app.js` lines 228-229, 249-250, 269-270

## Suggested Fix

Check if the ID already exists before pushing:

```js
if (state.visitedLetters.indexOf(letter.id) === -1) {
  state.visitedLetters.push(letter.id);
}
```

Or use a `Set`-like structure or deduplicate on save/display.
