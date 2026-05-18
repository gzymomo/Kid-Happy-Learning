---
title: "Multiple elements use font sizes below 18px minimum"
labels: bug
---

## Description

The requirements specify a minimum font size of **18px** for children's learning content (Section 3.4, Section 12). Several elements in the CSS use smaller font sizes, which may be difficult for 3-5 year old children to read.

## Requirements reference

- **Section 3.4**: "字体：18-19px，儿童友好字体"
- **Section 12**: "字体大小：最小18px"

## Elements below 18px

| Element | Current size | Required | File:line |
|---------|-------------|----------|-----------|
| `.card-phrase` | **14px** | 18px | styles.css:444 |
| `.stat-label` | **14px** | 18px | styles.css:732 |
| `.about-info` | **14px** | 18px | styles.css:812-816 |
| `.version` | **14px** | 18px | styles.css:881 |

## Note

The `.card-phrase`, `.stat-label`, `.about-info`, and `.version` elements contain secondary information, but per the requirements all visible text should be at minimum 18px in this children's application.
