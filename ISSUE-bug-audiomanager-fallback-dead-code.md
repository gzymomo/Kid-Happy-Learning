---
title: "Bug: AudioManager.play() fallback uses key as URL, which is incorrect"
labels: ["bug"]
---

## Description

In `js/app.js:137-146`, when `this.sounds[key]` is falsy, the fallback creates an `Audio` element using `key` as the source URL:

```js
AudioManager.prototype.play = function (key) {
    if (this.sounds[key]) {
        // ... normal Howler path
    } else {
        var src = key;  // ← key is something like "letter-A", not a URL!
        try {
            var audio = new Audio(src);  // ← creates "audio/letter-A" which doesn't exist
            audio.play().catch(function () {});
            this.currentAudio = audio;
        } catch (e) {
            console.warn('Failed to play audio:', src, e);
        }
    }
};
```

Since `loadSound()` is called for all items during init, this fallback path shouldn't be hit in normal operation. However, if a sound key is not found (edge case or future item added to JSON without audio), it would try to play a non-URL string as audio, silently failing.

## Impact

- Dead code that could mislead developers
- Silent failure if a content item lacks a preloaded sound
- Could mask configuration errors in content.json

## Suggested Fix

Either:
1. Remove the fallback and just log a warning, or
2. Pass the actual URL to the fallback (requires `play()` signature change to `play(key, url)`)
