---
title: "Requirements gap: Stories only implemented for letters, not words/Chinese"
labels: ["enhancement", "requirements-gap"]
---

## Description

Requirement §2.1 states: "每个字母/单词配一段1-2句话、20-40字的短故事" (every letter/word gets a short story). However, only the Letters module has story content and story audio — Words and Chinese modules have no story support.

## Current Behavior

- `data/content.json`: Only `letters[]` items have `story` and `storyAudioFile` fields
- `js/app.js:302-310`: `showStory()` is only called from `renderLetters()` (line 231)
- Words and Chinese cards only play the word/character audio on click; no story modal is shown

## Requirements Reference

From §2.1:
> 每个字母/单词配一段 **1-2句话、20-40字** 的短故事
> 展示形式：文字弹窗 + 预录语音讲述
> 语言：与卡片语言一致（中文卡片中文故事，英文卡片英文故事）

## Required Fix

1. Add `story` and `storyAudioFile` fields to all `words[]` and `chinese[]` items in `data/content.json`
2. Extend `renderWords()` and `renderChinese()` in `js/app.js` to show the story modal after card click (similar to letters)
3. Ensure story audio files exist for the new entries

## Files

- `data/content.json`
- `js/app.js:240-282`
