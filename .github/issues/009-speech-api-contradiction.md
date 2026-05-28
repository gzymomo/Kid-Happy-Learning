---
title: "Contradiction: Web Speech API used as fallback despite requirements rejecting it"
labels: ["cleanup", "requirements-gap"]
---

## Description

Requirement §5.1 explicitly explains why Web Speech API is **not** used:
> **矛盾**：需求要求"可离线运行"，但Speech API需要网络
> **可靠性**：儿童语音识别率低，发音质量参差不齐
> **解决方案**：预录音频 + Howler.js

However, `js/app.js:82-109` implements a `speak()` function using `window.speechSynthesis` and uses it as a fallback in `playAudioOrSpeak()` whenever the Howler audio file is not loaded.

## Current Behavior

`js/app.js:103-109`:
```js
function playAudioOrSpeak(audioKey, text, lang) {
  if (audioManager && audioManager.sounds && audioManager.sounds[audioKey]) {
    audioManager.play(audioKey);
  } else {
    speak(text, lang);  // Web Speech API fallback
  }
}
```

This means that since no audio files exist in the repo (see issue #002), **every interaction falls back to Web Speech API**, which:
1. Breaks offline usage (Speech API requires network)
2. Provides inconsistent voice quality across browsers/devices
3. Contradicts the stated technical decision

## Recommended Fix

Either remove the Web Speech API fallback entirely to match the requirements (audio should be pre-recorded only), or acknowledge the contradiction and update the requirements document to reflect the actual implementation approach.

## Files

- `js/app.js:82-109`
- `requirements.md:125-129` (§5.1)
