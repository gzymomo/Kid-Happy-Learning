---
title: "Audio files missing entirely — all .mp3/.webm files referenced in content.json do not exist"
labels: ["bug", "critical"]
---

## Description

All audio files referenced in `data/content.json` are missing. The `audio/` directory contains only a `.gitkeep` placeholder file. This affects all 19+ audio files across all modules:

- **Letters (x7):** `audio/letters/{A,B,C,D,E,F,G}.mp3`
- **Letter stories (x7):** `audio/stories/{A,B,C,D,E,F,G}.mp3`
- **Words (x6):** `audio/words/{cat,dog,sun,apple,bird,fish}.mp3`
- **Chinese (x6):** `audio/chinese/{人,口,日,月,水,火}.mp3`
- **Effects (x3):** `audio/effects/{star,correct,wrong}.mp3`

## Impact

- The core learning feature (click-to-pronounce) silently fails
- `app.js:playAudioOrSpeak()` falls back to Web Speech API (`speak()`), which requires network — violating the offline requirement (G-01, §5.1)
- The entire app's educational value is compromised

## Evidence

- `data/content.json` lines 14-15, 78-85, etc. reference these files
- `audio/` only contains `.gitkeep` (confirmed by glob)
- `js/app.js:103-109` shows the fallback logic: missing audio → `speak()` via Web Speech API

## Acceptance Criteria (§8)

- L-01: Click card → plays letter audio within 300ms
- W-01: Click word → plays English pronunciation
- C-01: Click Chinese character → plays Mandarin pronunciation
- G-01: All core functions work offline

## Suggested Fix

Generate placeholder audio files using a TTS tool (e.g., Google TTS, AWS Polly, or browser `SpeechSynthesis` recorded to blob), or provide instructions for recording. Per §9 Risk Register: "先用TTS生成占位音频，后续替换为专业录音" (use TTS for placeholder audio, replace with professional recordings later).
