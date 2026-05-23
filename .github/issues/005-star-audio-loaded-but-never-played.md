---
title: Star reward audio loaded but never played
labels: bug, enhancement
---

## Description

In `js/app.js`, the audio manager loads a "star" sound from `content.rewards.starAudio` (`app.js:182`), but this sound is never played anywhere in the code.

The `correct` and `wrong` sounds are played in `handleQuizAnswer()` (`app.js:460, 471`), but the `star` sound is loaded and never triggered.

## Impact

- Unnecessary audio loading (wasted bandwidth/cache)
- Missing audio feedback when a star is earned, which would enhance the reward experience
- The star animation is purely visual with no audio accompaniment

## Location

- `js/app.js:182` — star sound loaded
- `js/app.js:459-460` — star earned but only `correct` sound played, not `star`
- `data/content.json:173` — `starAudio` defined but unused

## Suggested Fix

Play the star sound alongside the reward animation in `handleQuizAnswer()` when a correct answer is given:

```js
function handleQuizAnswer(selected, btnEl) {
  // ... after correct answer
  if (selected === q.correct) {
    btnEl.classList.add('correct');
    addStar();
    audioManager.play('star');  // Play star sound
    audioManager.play('correct');
    // ...
  }
}
```
