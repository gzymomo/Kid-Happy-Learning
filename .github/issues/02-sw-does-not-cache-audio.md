---
title: "Service Worker does not pre-cache audio files — offline playback broken on first access"
labels: ["bug", "high"]
---

## Description

The Service Worker (`sw.js`) only pre-caches HTML/CSS/JS/JSON and the Howler.js CDN script during the `install` event. Audio files (`.mp3`, `.webm`) are NOT included in `ASSETS_TO_CACHE` and are only cached on-demand via the `fetch` handler.

## Impact

On first access without a network connection (or if the SW cache is cleared), audio playback will fail entirely. This contradicts requirement G-01 (§8) which mandates that all core functions work offline.

```
// sw.js line 2-9: audio files are not listed here
var ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/data/content.json',
  'https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.4/howler.min.js'
];
```

## Related Requirements

- §5: "Service Worker（Cache API）缓存HTML/CSS/JS/音频" (cache HTML/CSS/JS/audio)
- G-01: "断网后所有核心功能可用（音频需预录）" (all core functions available offline, audio must be pre-recorded)
- W-03: "断网后仍能播放所有音频" (all audio playable after disconnecting)

## Suggestion

Add all audio file paths to `ASSETS_TO_CACHE`, or generate the list dynamically from the content manifest. Use cache-first strategy for audio files specifically.

Alternatively, use a script to collect all audio paths from `data/content.json` at build time and inject them into the SW cache list.
