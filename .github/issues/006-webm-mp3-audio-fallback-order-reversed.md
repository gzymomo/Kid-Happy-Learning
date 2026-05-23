---
title: Audio format preference order reversed (WebM before MP3)
labels: bug
---

## Description

Requirements section 5.1 states: **"MP3（主）+ WebM（备用）"** — MP3 should be the primary format with WebM as fallback.

However, in `js/app.js:120`, the Howler.js source array specifies WebM first:

```js
src: [src.replace('.mp3', '.webm'), src],
```

This means WebM is tried first, and MP3 is the fallback — the opposite of the requirement.

## Impact

- WebM audio may not be supported on all target devices (older smart TVs, some tablets)
- The specified MP3-primary format is not honored

## Location

`js/app.js` line 120

## Suggested Fix

Swap the order so MP3 is first:

```js
src: [src, src.replace('.mp3', '.webm')],
```

This also ensures that if no WebM file exists (only MP3 is provided), playback still works on the first attempt.
