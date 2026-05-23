---
title: Hardcoded module counts in parent zone stats
labels: bug, maintenance
---

## Description

In `js/app.js`, the `showParentModal()` function uses hardcoded denominator values for progress stats:

```js
document.getElementById('statLetters').textContent = state.visitedLetters.length + '/7';
document.getElementById('statWords').textContent = state.visitedWords.length + '/6';
document.getElementById('statChinese').textContent = state.visitedChinese.length + '/6';
```

These values (`/7`, `/6`, `/6`) are hardcoded to match the current `content.json`. If the content is extended (e.g., adding letter H or more words/chinese), these stats will display incorrect denominators.

## Impact

- Content expansion requires code changes to keep parent zone stats accurate
- Violates the content extensibility design principle (section 4.2: "修改JSON，无需改代码")

## Location

`js/app.js` lines 518-520

## Suggested Fix

Derive counts dynamically from the content data:

```js
document.getElementById('statLetters').textContent =
  state.visitedLetters.length + '/' + content.letters.length;
document.getElementById('statWords').textContent =
  state.visitedWords.length + '/' + content.words.length;
document.getElementById('statChinese').textContent =
  state.visitedChinese.length + '/' + content.chinese.length;
```
