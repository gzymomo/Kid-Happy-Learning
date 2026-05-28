---
title: "Critical: Service Worker does not cache audio files — offline audio broken"
labels: ["bug", "high-priority"]
---

## Description

The Service Worker (`sw.js`) does not cache any audio files. The `ASSETS_TO_CACHE` array only includes HTML/CSS/JS/JSON and the Howler.js CDN script — all `.mp3` and `.webm` files are missing.

## Requirements Impact

This breaks acceptance criteria **G-01** (offline operation) and **W-03** (offline audio availability). Requirement §5 explicitly states audio must be "100% offline可用".

## Current Behavior

- `sw.js:2-9`: `ASSETS_TO_CACHE` does not list any audio file paths
- `sw.js:54-56`: The fetch handler catches audio request failures and returns an empty 204 response (silent failure)
- `audio/` directory only contains a `.gitkeep` — no actual audio files exist

## Required Fix

1. Add all audio file patterns (or explicit paths) to `ASSETS_TO_CACHE`:
   - `audio/letters/*.mp3` / `.webm`
   - `audio/words/*.mp3` / `.webm`
   - `audio/chinese/*.mp3` / `.webm`
   - `audio/stories/*.mp3` / `.webm`
   - `audio/effects/*.mp3` / `.webm`
2. Ensure audio files exist in the repository (currently `audio/` is empty except `.gitkeep`)
3. Remove or fix the silent-204 fallback so failed playback is surfaced to the user

## Files

- `sw.js:2-9`
- `sw.js:54-56`
- `js/app.js:161-186` (audio loading expects these files)
- `data/content.json` (references audio paths)
