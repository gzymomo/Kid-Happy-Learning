---
title: "Bug: visitedLetters/visitedWords/visitedChinese arrays grow unboundedly"
labels: ["bug"]
---

## Description

Every click on a learning card pushes the item ID to the corresponding `visited*` array (`js/app.js:228, 249, 269`) without checking for duplicates. This causes unbounded array growth in `localStorage`.

## Current Behavior

`js/app.js:228`:
```js
state.visitedLetters.push(letter.id);
```

`js/app.js:249`:
```js
state.visitedWords.push(word.id);
```

`js/app.js:269`:
```js
state.visitedChinese.push(cn.id);
```

Each click on the same card adds the ID again — clicking "A" 10 times results in `["letter-A", "letter-A", "letter-A", ...]`.

## Impact

- **localStorage quota**: Repeated clicks could eventually fill the ~5MB localStorage limit
- **Parent stats inflation**: Parent zone shows `visitedLetters.length/7` as progress, making it look like the child visited more letters than actually exist (e.g., "15/7").

## Required Fix

Check for duplicates before pushing, or use a `Set`-like approach:
```js
if (!state.visitedLetters.includes(letter.id)) {
  state.visitedLetters.push(letter.id);
}
```

## Files

- `js/app.js:228-229`
- `js/app.js:249-250`
- `js/app.js:269-270`
