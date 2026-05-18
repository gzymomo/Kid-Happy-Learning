---
title: "Quiz difficulty tracking (consecutiveCorrect/consecutiveWrong) not persisted across page reloads"
labels: bug
---

## Description

The quiz difficulty adjustment system tracks consecutive correct/wrong answers to modify question frequency (3 correct → reduced frequency, 2 wrong → increased frequency). However, this tracking data is not properly restored on page reload, so the difficulty adaptation resets every time the page is refreshed.

## Requirements reference

- **Section 3.2**: "难度梯度：连续答对3次，该题后续出现频率降低；连续答错2次，增加练习频率"

## Current behavior

In `js/app.js`:

1. `initState()` loads `quizStats` from localStorage (line 61), assigning it as `state.quizStats`
2. But `initQuiz()` (line 332-374) always initializes fresh empty objects:
   ```js
   consecutiveCorrect: {},
   consecutiveWrong: {}
   ```
3. `state.quizStats` is never used to restore `consecutiveCorrect`/`consecutiveWrong`
4. Additionally, on save (line 488), only `consecutiveCorrect` is saved:
   ```js
   state.quizStats = quizState.consecutiveCorrect;  // misses consecutiveWrong
   ```

## Affected file

- `js/app.js:332-340` — quiz state always starts fresh
- `js/app.js:487-488` — only correct stats saved, not wrong stats

## Fix

1. In `initQuiz()`, restore `consecutiveCorrect` and `consecutiveWrong` from `state.quizStats`
2. Save both `consecutiveCorrect` and `consecutiveWrong` in `state.quizStats`
