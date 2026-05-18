---
title: "Service Worker does not cache audio files, breaking offline use"
labels: bug
---

## Description

The requirements specify that the app must support **full offline operation** (G-01, W-03), including audio playback. However, the Service Worker (`sw.js`) does not cache any audio files (`.mp3`/`.webm`), and the fetch handler returns an empty 204 response for failed audio requests instead of serving from cache.

## Requirements reference

- **Section 5 (Technical)**: "Service Worker（Cache API）缓存HTML/CSS/JS/音频"
- **G-01**: "断网后所有核心功能可用（音频需预录）"
- **W-03**: "断网后仍能播放所有音频"

## Current behavior

- `ASSETS_TO_CACHE` only includes: `/`, `index.html`, `css/styles.css`, `js/app.js`, `data/content.json`, Howler CDN (sw.js:2-9)
- No audio paths are added to pre-cache
- Audio file fetch failures return `new Response("", { status: 204 })` (sw.js:55) — silent failure, no sound

## Expected behavior

- All audio files referenced in `data/content.json` should be cached by the Service Worker
- Audio should be playable offline without network
- On cache miss, the SW should attempt network fetch and cache the result for future offline use

## Affected files

- `sw.js` — ASSETS_TO_CACHE missing audio paths, fetch handler silently swallows audio errors
- `js/app.js` — no runtime cache registration for audio

## Suggested fix

1. Dynamically add audio paths from `data/content.json` to cache during SW install, OR
2. Implement runtime caching in the SW fetch handler so audio files are cached on first access
3. Remove the silent-fail `204` for audio; if audio is uncached and offline, show a user-visible message
