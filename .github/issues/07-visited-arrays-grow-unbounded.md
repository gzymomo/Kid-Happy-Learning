---
title: "visited* arrays grow unbounded — repeated card clicks inflate progress stats"
labels: ["bug", "low"]
---

## Description

Each time a learning card is clicked, its ID is pushed to the corresponding `visited*` array with no deduplication check:

```js
// js/app.js:228
state.visitedLetters.push(letter.id);

// js/app.js:249
state.visitedWords.push(word.id);

// js/app.js:270
state.visitedChinese.push(cn.id);
```

This means clicking the same letter (e.g., "A") 10 times will push 10 duplicate entries, causing the parent zone stats to show "10/7" instead of "1/7".

## Impact

- Parent zone progress display becomes inaccurate
- localStorage usage grows unnecessarily with duplicates
- Can't accurately track which items have been viewed

## Suggested Fix

Add a deduplication check before pushing:

```js
if (state.visitedLetters.indexOf(letter.id) === -1) {
  state.visitedLetters.push(letter.id);
}
```

Or use a `Set`-like approach (filter duplicates on read). A Set stored as an array would be the cleanest pattern.
