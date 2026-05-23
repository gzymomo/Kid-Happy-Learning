---
title: Letter (English) module stories are written in Chinese, not English
labels: bug, requirements-gap
---

## Description

Requirements section 2.1 specifies: **"语言：与卡片语言一致（中文卡片中文故事，英文卡片英文故事）"** — The story language should match the card language. Chinese cards get Chinese stories, English cards get English stories.

The Letters (字母乐园) module teaches English letters (A-G) and English words (Apple, Bird, Cat, etc.), so it's an "English card" — its stories should be in English. However, all stories in `content.json` lines 13-70 are written in Chinese:

```json
{
  "story": "小A发现了一颗红红的苹果，咬一口，脆甜脆甜的！"
}
```

## Impact

- Inconsistent with the stated language policy
- Children learning English letters hear Chinese stories, mixing language immersion

## Location

`data/content.json` lines 13, 23, 33, 43, 53, 63, 73 — all letter stories are in Chinese

## Suggested Fix

Translate letter stories to English, e.g.:
- "Little A found a red, red apple. One bite — crisp and sweet!"
- "Little bird B flies freely in the sky, singing a happy song."

Or, if the intent is bilingual, clarify the requirement and update the documentation.
