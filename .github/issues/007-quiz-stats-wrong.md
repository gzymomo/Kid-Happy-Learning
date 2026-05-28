---
title: "Bug: quizStats only saves consecutiveCorrect, losing consecutiveWrong on reload"
labels: ["bug"]
---

## Description

In `js/app.js:488`, `state.quizStats` is set to `quizState.consecutiveCorrect` but `quizState.consecutiveWrong` is not persisted. On page reload, the wrong-streak tracking is lost, which breaks the adaptive difficulty feature described in requirement §3.2.

## Current Behavior

`js/app.js:488`:
```js
state.quizStats = quizState.consecutiveCorrect;
```

`js/app.js:337-339` (state initialization):
```js
quizState = {
  consecutiveCorrect: {},
  consecutiveWrong: {}
};
```

Only `consecutiveCorrect` is persisted to localStorage via `state.quizStats`. On reload, `consecutiveWrong` resets to `{}`, meaning a child who previously got a question wrong twice will lose the increased frequency weight.

## Requirements Impact

§3.2 states:
> 连续答错2次，增加练习频率（未来自适应功能）

The wrong-streak tracking should survive page reloads.

## Required Fix

Persist `consecutiveWrong` alongside `consecutiveCorrect`.

## Files

- `js/app.js:488`
- `js/app.js:337-339`
