---
title: "Critical: Audio files and PWA icons missing from repository"
labels: ["bug", "high-priority"]
---

## Description

Both the `audio/` and `assets/` directories contain only `.gitkeep` placeholder files. No actual `.mp3`/`.webm` audio files or PWA icon PNGs exist in the repository.

## Impact

- **Audio system is non-functional**: All 19+ audio references in `data/content.json` (letters, words, chinese, stories, effects) point to files that do not exist. The fallback to Web Speech API (§5.1 explicitly rejects this approach) is unreliable offline.
- **PWA installation broken**: `manifest.json:12-21` references `assets/icon-192.png` and `assets/icon-512.png` which are missing. Browsers will reject the manifest, preventing "Add to Home Screen" functionality.

## Required Fix

1. Generate or add placeholder audio files for all paths referenced in `data/content.json`
2. Add proper 192×192 and 512×512 PNG icons to `assets/`
3. Update `.gitkeep` pattern or add build scripts to ensure assets are tracked

## Files

- `audio/` (empty)
- `assets/` (empty)
- `data/content.json` (references audio paths)
- `manifest.json:10-23` (references icon paths)
