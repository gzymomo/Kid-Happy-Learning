---
title: "Story functionality only implemented for letters — words and Chinese characters lack story popups"
labels: ["enhancement", "medium"]
---

## Description

Per §2.1 (Story Function), every letter and word card should have a 1-2 sentence short story displayed in a text popup with pre-recorded narration. However, the story feature is only implemented for **letters**.

- `data/content.json`: Only letter objects have `story` and `storyAudioFile` fields
- `js/app.js:showStory()`: Only called from `renderLetters()` (line 231)
- `renderWords()` and `renderChinese()`: No story trigger

## Requirements Affected

- §2.1: "每个字母/单词配一段 1-2句话、20-40字 的短故事" (each letter/word gets a short story)
- §2.1: "展示形式：文字弹窗 + 预录语音讲述" (display: text popup + pre-recorded narration)
- L-02: "点击后显示故事文字+播放故事语音" (click → show story text + play story audio)

## Suggested Fix

1. Add `story` and `storyAudioFile` (optional) fields to word and chinese content items in `content.json`
2. Add story trigger to `renderWords()` and `renderChinese()` — e.g., show story after audio plays, or on a separate button
3. Consider whether stories should auto-play (as with letters, 1s delay) or be triggered by a dedicated button
