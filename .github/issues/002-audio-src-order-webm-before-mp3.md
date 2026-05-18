---
title: "Howler.js audio src order puts WebM before MP3 (contradicting requirements)"
labels: bug
---

## Description

In `js/app.js:120`, the Howler.js sound source array has WebM before MP3:

```js
src: [src.replace('.mp3', '.webm'), src],
```

The requirements explicitly state **MP3（主）+ WebM（备用）** (Section 3.3). The order should have MP3 first since it is the primary format.

## Impact

In browsers that support both formats, WebM will be preferred over MP3, which contradicts the design decision. MP3 generally has broader browser support and smaller file sizes for speech content.

## Affected file

- `js/app.js:120` in `AudioManager.prototype.loadSound`

## Fix

Swap the order to: `[src, src.replace('.mp3', '.webm')]`
