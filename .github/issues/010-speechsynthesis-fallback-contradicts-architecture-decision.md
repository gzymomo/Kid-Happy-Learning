---
title: "SpeechSynthesis fallback for story audio contradicts architectural decision against Web Speech API"
labels: bug
---

## Description

Section 5.1 explicitly rejects Web Speech API due to offline incompatibility and reliability concerns. However, the code uses `speak()` (which calls `window.speechSynthesis`) as a fallback when pre-recorded audio files are unavailable.

## Requirements reference

- **Section 5.1**: "矛盾：需求要求'可离线运行'，但Speech API需要网络" and "解决方案：预录音频 + Howler.js"
- **Q2**: "预录音频（MP3）+ Howler.js"

## Current behavior

In `js/app.js:103-109` (`playAudioOrSpeak`):
```js
function playAudioOrSpeak(audioKey, text, lang) {
  if (audioManager && audioManager.sounds && audioManager.sounds[audioKey]) {
    audioManager.play(audioKey);
  } else {
    speak(text, lang);  // Falls back to SpeechSynthesis
  }
}
```

Also in `showStory()` (`storyAudioBtn` click handler, app.js:568-569):
```js
} else if (letter && letter.story) {
  speak(letter.story, 'zh-CN');
}
```

## Issues

1. **Offline breakage**: If audio files are missing (which they currently are — `audio/` only contains `.gitkeep`), the app falls back to SpeechSynthesis, which requires network. This means the app cannot function offline.
2. **Inconsistent design**: The requirements explicitly chose pre-recorded audio over TTS, but the code paths re-introduce TTS as a fallback.

## Expected behavior

- Do not use SpeechSynthesis as a fallback
- If audio files are missing, show a visual indicator that audio is unavailable
- Only use pre-recorded audio through Howler.js
