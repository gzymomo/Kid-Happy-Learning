---
title: "Text-light color (#7F8C8D) fails WCAG AA contrast requirement"
labels: bug
---

## Description

The `--text-light` CSS variable is set to `#7F8C8D`. On the card background (`#FFFFFF`), this yields a contrast ratio of approximately **4.1:1**, which is below the WCAG AA requirement of **4.5:1** for normal text (Section 12, G-06).

## Requirements reference

- **G-06**: "文字与背景对比度≥4.5:1（WCAG AA）"
- **Section 12 (Accessibility)**: "对比度：文字与背景≥4.5:1"

## Affected elements

| Element | Text color | Background | Ratio | Required |
|---------|-----------|------------|-------|----------|
| `.card-sub` | #7F8C8D | #FFFFFF (or gradient) | ~4.1:1 | 4.5:1 |
| `.stat-label` | #7F8C8D | #FFF8E7 | ~3.9:1 | 4.5:1 |
| `.card-phrase span` | #7F8C8D | rgba(0,0,0,0.05) | ~4.0:1 | 4.5:1 |
| `.about-info`, `.version` | #7F8C8D | rgba(255,255,255,0.8) | varies | 4.5:1 |

## Fix

Darken `--text-light` to at least `#6B7B8D` (or darker) to achieve ≥4.5:1 contrast on white backgrounds.
