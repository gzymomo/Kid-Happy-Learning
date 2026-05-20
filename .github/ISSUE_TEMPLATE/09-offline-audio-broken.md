---
title: "Audio not pre-cached in Service Worker; offline audio broken (G-01)"
labels: bug
---

## Requirement

Acceptance criterion G-01:
> 离线运行：断网后所有核心功能可用（音频需预录）

## Implementation

`sw.js:2-8` — `ASSETS_TO_CACHE` does not include any audio files. The fetch handler at line 54 returns a **204 empty response** when audio fetches fail offline:

```js
if (event.request.destination === 'audio' || ...) {
  return new Response('', { status: 204 });
}
```

## Impact

When offline:
1. Audio files are not in the pre-cache, so they are never available on first load
2. Even after caching via network-first fetch, the 204 fallback means audio silently fails
3. The parent zone and quiz become partially broken (no audio feedback)

## Suggested Fix

1. Add audio files to `ASSETS_TO_CACHE` (or use a separate audio cache)
2. On fetch failure, try serving from cache first before returning 204
3. Consider a "cache-on-first-access" strategy that logs which files are cached
