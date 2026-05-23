---
title: Quiz marks questions "seen" even when answered incorrectly
labels: enhancement
---

## Description

In `js/app.js:484-486`, the quiz's `seenQuestions` array is updated regardless of whether the answer was correct or wrong:

```js
if (quizState.seenQuestions.indexOf(q.id) === -1) {
  quizState.seenQuestions.push(q.id);
}
```

This means a question is considered "completed" even if the child answered incorrectly. The `pickQuestion()` function prioritizes unseen questions, so wrong answers won't be revisited until all 19 questions have been attempted once.

## Impact

- Children who answer incorrectly don't get an immediate opportunity to retry that specific question
- The adaptive difficulty (`consecutiveWrong`) increases future frequency but the question still won't reappear until all others are seen
- May reduce learning effectiveness for difficult concepts

## Location

`js/app.js` lines 484-486

## Suggested Fix

Only mark a question as "seen" when answered correctly, or implement a separate retry queue:

```js
// Option: Only mark seen on correct answer
if (selected === q.correct) {
  if (quizState.seenQuestions.indexOf(q.id) === -1) {
    quizState.seenQuestions.push(q.id);
  }
}
```
