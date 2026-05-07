---
title: "Hardcoded content counts break extensibility — stats show fixed 0/7, 0/6, 0/6"
labels: ["bug", "medium"]
---

## Description

§4.2 promises that content can be extended by simply editing `data/content.json` without modifying code. However, the parent zone stats display hardcodes the expected counts:

```js
// js/app.js:518-520
document.getElementById('statLetters').textContent = state.visitedLetters.length + '/7';
document.getElementById('statWords').textContent = state.visitedWords.length + '/6';
document.getElementById('statChinese').textContent = state.visitedChinese.length + '/6';
```

Adding a new letter (H), word, or Chinese character will show incorrect totals (e.g., "0/7" instead of "0/8").

## Requirements Affected

- L-03: "修改JSON数组，新增字母H无需改代码" (modify JSON array, add letter H without changing code)
- §4.2: "扩展内容：直接修改 data/content.json，无需改代码" (extend content: directly edit content.json, no code changes needed)
- §15: v1.1 plans to extend to A-Z + 20 words + 20 characters

## Suggested Fix

Use `content.letters.length`, `content.words.length`, and `content.chinese.length` dynamically instead of hardcoded numbers:

```js
document.getElementById('statLetters').textContent =
  state.visitedLetters.length + '/' + content.letters.length;
document.getElementById('statWords').textContent =
  state.visitedWords.length + '/' + content.words.length;
document.getElementById('statChinese').textContent =
  state.visitedChinese.length + '/' + content.chinese.length;
```
