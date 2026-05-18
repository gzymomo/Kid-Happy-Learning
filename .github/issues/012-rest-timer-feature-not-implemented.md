---
title: "Rest timer / break reminder feature not implemented"
labels: enhancement
---

## Description

Section 7.1 (Industry Best Practices) recommends showing a "休息一下" (take a rest) page after 2-5 minutes of activity. This feature is not implemented.

## Requirements reference

- **Section 7.1**: "时间分块：每次活动2-5分钟，之后可显示'休息一下'页面"

## Suggested implementation

- Track time spent in learning views using a timer
- After configurable duration (e.g., 5 minutes), show a friendly modal suggesting the child take a break
- Include a fun animation and a "继续学习" (continue learning) button
- Reset the timer when switching categories or after the break
