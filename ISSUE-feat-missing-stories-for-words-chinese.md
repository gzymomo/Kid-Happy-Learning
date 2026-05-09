---
title: "Missing Feature: Stories only implemented for letters, not for words/chinese"
labels: ["enhancement", "requirements-gap"]
---

## Description

**Requirements.md §2.1** states:

> 每个字母/单词配一段 **1-2句话、20-40字** 的短故事

Currently only letter items have `story` and `storyAudioFile` fields in `data/content.json`, and only letter cards trigger the story modal (`js/app.js:230-232`). Words and Chinese characters play audio on click but never show a story.

The requirements are somewhat ambiguous (the "/" could mean "and" or "or"), but the **risk register** mentions "19个音频+故事" suggesting all 19 items should have stories.

## Impact

- Words (cat, dog, sun, etc.) and Chinese characters (人, 口, 日, etc.) lack the story enrichment feature
- Reduced engagement compared to the Alphabet Park module
- Content model does not include story fields for these categories

## Suggested Fix

1. Add `story` and `storyAudioFile` fields to word and chinese entries in `data/content.json`
2. Extend `showStory()` to accept any content type (not just letters), or create separate render/trigger paths for word and chinese stories
3. Trigger story modal after audio playback for words and chinese (similar to letter behavior)

## Files Affected

- `data/content.json` — add story fields to words[] and chinese[]
- `js/app.js` — extend story modal to support words and chinese
