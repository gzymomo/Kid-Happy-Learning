---
title: Missing audio files break core audio functionality
labels: bug
---

## Summary

All audio directories (`audio/letters/`, `audio/words/`, `audio/chinese/`, `audio/stories/`, `audio/effects/`) contain only `.gitkeep` placeholders. No actual audio files (MP3/WebM) are committed. This breaks the core "point-and-read" feature and quiz sound effects.

## Impact

1. **Letters/Words/Chinese cards**: `playAudioOrSpeak()` tries `audioManager.play()` → Howler.js loads fail silently → falls back to Web Speech API TTS. Speech output works but audio quality is poor and inconsistent across browsers.
2. **Quiz effects**: `audioManager.play('correct')`, `audioManager.play('wrong')`, `audioManager.play('star')` are called **without** TTS fallback — completely silent.
3. **Story audio**: Story audio button uses `audioManager.play(currentStoryLetterId + '-story')` directly with no TTS fallback — silent.
4. **Offline**: SW returns 204 (empty response) for failed audio fetches, so audio is broken offline too.

## Locations

- `js/app.js:103-109` — `playAudioOrSpeak` only falls back for item audio, not effects
- `js/app.js:460-461` — `audioManager.play('correct')` with no fallback
- `js/app.js:471` — `audioManager.play('wrong')` with no fallback
- `sw.js:2-8` — No audio files in ASSETS_TO_CACHE
- `sw.js:54` — Returns 204 for failed audio fetches instead of serving cached fallback

## Suggested Fix

1. Generate placeholder audio via TTS or pre-record for all 19 items + stories + 3 effects
2. Add TTS fallback for quiz effect sounds
3. Add audio files to SW `ASSETS_TO_CACHE` pre-cache
