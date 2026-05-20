---
title: "Letter story audio not auto-played on click (L-02)"
labels: bug
---

## Requirement

Acceptance criterion L-02:
> 点击后显示故事文字+播放故事语音

This requires that clicking a letter card **automatically** plays the story audio.

## Implementation

`js/app.js:230-232` shows the story modal after a 1-second delay but does **not** auto-play the story audio. The user must manually click the "听故事" button to hear the story.

`js/app.js:302-310` — `showStory()` only opens the modal and sets content; audio is only played in the `storyAudioBtn` event handler (line 561-571).

## Suggested Fix

After the modal opens, auto-play the story audio:

```js
function showStory(letter) {
  // ... existing modal setup ...
  // Auto-play story audio
  if (letter.storyAudioFile && audioManager) {
    audioManager.play(letter.id + '-story');
  } else if (letter.story) {
    speak(letter.story, 'zh-CN');
  }
}
```
