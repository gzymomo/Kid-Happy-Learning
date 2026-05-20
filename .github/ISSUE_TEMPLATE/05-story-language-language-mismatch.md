---
title: "Letter story content language does not match card language (requirements §2.1)"
labels: bug
---

## Requirement

`requirements.md` §2.1 states:
> 语言：与卡片语言一致（中文卡片中文故事，英文卡片英文故事）

English cards should have English stories; Chinese cards should have Chinese stories.

## Implementation

Letter cards teach English letters/words but their stories in `data/content.json` are written in **Chinese** (e.g., `"story": "小A发现了一颗红红的苹果，咬一口，脆甜脆甜的！"`).

## Impact

Children learning English letters are presented with Chinese text in the story modal, contradicting the immersion goal stated in the requirements. The story audio files would logically also be in Chinese, further diverging from the spec.

## Suggested Fix

Either:
1. Translate letter stories to English to match the spec, or
2. Update the `requirements.md` to document the intentional bilingual story approach (Chinese stories aid comprehension for young Chinese-speaking learners)
