---
title: "Optimization: Audio files not pre-cached in Service Worker"
labels: ["enhancement", "performance", "offline"]
---

## Description

**Requirements.md §5** specifies that the Service Worker should cache "HTML/CSS/JS/音频".

The `ASSETS_TO_CACHE` array in `sw.js:2-9` only includes HTML, CSS, JS, and content.json — **no audio files**. Audio files are cached lazily via the fetch handler (cache-first), meaning they require a successful online fetch before they're available offline.

```js
var ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/data/content.json',
  'https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.4/howler.min.js'
];
```

## Impact

- First-time offline use will fail for audio if the files haven't been fetched before
- Audio is a critical feature (every card click triggers audio playback)
- Pre-caching 20+ audio files could be significant (though they could be cached on first visit)

## Suggested Fix

Either:
1. Add audio file paths to `ASSETS_TO_CACHE` (may increase install time but guarantees offline availability)
2. During `initAudio()`, explicitly fetch audio files to warm the cache
3. Document that audio files are lazy-cached via the fetch handler

## Files Affected

- `sw.js` — optionally add audio file paths to pre-cache
