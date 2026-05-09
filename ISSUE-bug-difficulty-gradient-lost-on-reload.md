---
title: "Bug: Quiz difficulty gradient tracking lost on page reload"
labels: ["bug", "feature-regression"]
---

## Description

**Requirements.md §3.2** specifies difficulty gradient:

> 连续答对3次，该题后续出现频率降低；连续答错2次，增加练习频率

The `consecutiveCorrect` and `consecutiveWrong` maps in `quizState` (`js/app.js:338-339`) are initialized as empty objects each time `initQuiz()` runs. While `state.quizStats` saves `consecutiveCorrect`, the `initQuiz()` function **does not restore** `consecutiveCorrect` from `state.quizStats` — it always starts fresh:

```js
// js/app.js:332-339
function initQuiz() {
    quizState = {
        // ...
        consecutiveCorrect: {},  // ← always starts empty
        consecutiveWrong: {}     // ← always starts empty
    };
```

And at `js/app.js:488`:
```js
state.quizStats = quizState.consecutiveCorrect;
```
This saves the data, but on next page load, the saved `state.quizStats` is never read back into `quizState.consecutiveCorrect`.

## Impact

The adaptive difficulty feature resets on every page refresh, making it session-only. This undermines the "difficulty gradient" acceptance criteria.

## Suggested Fix

In `initQuiz()`, restore `consecutiveCorrect` from `state.quizStats`:
```js
consecutiveCorrect: state.quizStats ? Object.assign({}, state.quizStats) : {},
```

Also save `consecutiveWrong` to state to preserve the full difficulty gradient:
```js
state.quizWrongStats = quizState.consecutiveWrong;
```
