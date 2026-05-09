---
title: "Bug: Visited arrays accumulate duplicates, inflating parent stats"
labels: ["bug"]
---

## Description

The `visitedLetters`, `visitedWords`, and `visitedChinese` arrays in `state` push card IDs on every click without deduplication (`js/app.js:228-230`, `js/app.js:249-251`, `js/app.js:270-272`).

```js
state.visitedLetters.push(letter.id);
```

If a child taps the same card 10 times, the array grows to 10 entries. The parent modal stats display the `.length` of these arrays (`js/app.js:518-520`):

```js
document.getElementById('statLetters').textContent = state.visitedLetters.length + '/7';
```

This shows inflated progress like `"10/7"` instead of `"7/7"`.

## Steps to Reproduce

1. Open the app
2. Click the same letter card (e.g., "A") multiple times in Alphabet Park
3. Enter the parent zone (5 clicks on footer)
4. Observe the letter progress shows a number > 7

## Expected Behavior

Visited arrays should contain at most one entry per unique card ID. The fix should either:
- Check for duplicates before pushing, or
- Use a `Set` / deduplicate on read in `showParentModal`

## Severity

Medium — affects parent-reported stats accuracy but not core learning functionality.
