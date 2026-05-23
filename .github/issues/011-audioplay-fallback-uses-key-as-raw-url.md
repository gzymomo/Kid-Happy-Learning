---
title: AudioManager.play fallback treats sound keys as raw URLs
labels: bug
---

## Description

In `js/app.js:138`, the `AudioManager.prototype.play` method has a fallback path when a sound key is not found in the loaded sounds:

```js
AudioManager.prototype.play = function (key) {
  if (this.sounds[key]) {
    // ... play via Howler
  } else {
    const src = key;  // Uses 'key' directly as a URL!
    try {
      const audio = new Audio(src);
      audio.play().catch(function () {});
    } catch (e) { }
  }
};
```

If `key` is a sound identifier like `"star"`, `"correct"`, or `"wrong"` that failed to load (Howler.js unavailable or load error), the code attempts `new Audio("star")`, which is an invalid URL that will fail silently.

## Impact

- Silent failures when Howler.js fails to load (CDN down, offline first visit)
- No useful console error for debugging
- Child gets no audio feedback

## Location

`js/app.js` line 138

## Suggested Fix

Only attempt direct `Audio` playback if `key` looks like a URL (starts with `audio/` or ends with `.mp3` or `.webm`):

```js
AudioManager.prototype.play = function (key) {
  if (this.sounds[key]) {
    // ... play via Howler
  } else if (key.match(/^audio\//) || key.match(/\.(mp3|webm)$/i)) {
    // Fallback to HTML5 Audio for valid audio paths
    try {
      const audio = new Audio(key);
      audio.play().catch(function () {});
    } catch (e) { }
  }
};
```
