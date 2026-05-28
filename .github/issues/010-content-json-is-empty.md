---
title: "Bug: content.json meta.version and content mismatch"
labels: ["bug"]
---

## Description

`data/content.json` has `"meta.version": "1.0.0"` but `index.html` shows `v2.0.0` and `requirements.md` shows `v2.0（优化版）`. The version strings are inconsistent across the project.

## Current State

- `data/content.json:3`: `"version": "1.0.0"`
- `index.html:62`: `v2.0.0`
- `requirements.md:338`: `版本：v2.0（优化版）`

## Required Fix

Align version strings across all files.

## Files

- `data/content.json:3`
- `index.html:62`
- `requirements.md:338`
