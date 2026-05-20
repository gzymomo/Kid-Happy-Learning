---
title: "No confirmation dialogs for child operations (risk register)"
labels: enhancement
---

## Requirement

`requirements.md` §9 (Risk Register) — Mitigation for "3-5岁儿童误操作频繁":
> 所有操作有确认弹窗，误触可撤销

## Implementation

The only confirmation dialog is for "清除所有数据" (`clearAllData` at `js/app.js:528-529` `confirm()`). All other operations (entering categories, clicking cards, starting quiz, answering questions) have no confirmation step.

## Impact

Young children can accidentally navigate away from a category, close modals, or trigger quiz answers without any confirmation, which can be frustrating.

## Suggested Fix

Add lightweight confirmation for destructive or irreversible actions, particularly:
1. Back button from a learning module (with a "are you sure?" prompt)
2. Closing quiz mid-way
Consider using a child-friendly "确认吗？" dialog with emoji buttons.
