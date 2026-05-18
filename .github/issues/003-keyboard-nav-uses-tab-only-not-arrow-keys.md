---
title: "Keyboard navigation uses Tab only, not arrow keys as required"
labels: enhancement
---

## Description

The requirements specify that for non-touch/TV devices, the app should support **方向键+Enter键盘导航** (arrow key + Enter navigation). The current implementation only supports Tab key navigation with Enter/Space activation.

## Requirements reference

- **Section 1**: "电视端若检测到无触控（navigator.maxTouchPoints === 0），自动降级为方向键+Enter键盘导航"
- **G-04**: "支持Tab/方向键+Enter，适用于无触控电视"
- **Section 3.4**: "触控为主；电视端若检测到无触控..."

## Current behavior

- Cards have `tabindex="0"` and keydown handlers for Enter/Space (app.js:273-278, 292-298, 431-437)
- No arrow key (ArrowLeft, ArrowRight, ArrowUp, ArrowDown) navigation between sibling elements
- No "roving tabindex" pattern for grid layouts (hard to navigate a grid with Tab alone)
- `no-touch` class only adds focus-visible outlines; no behavioral change to navigation semantics

## Expected behavior

- When `no-touch` class is present, users should navigate between cards in the grid using arrow keys
- Home page category cards should support left/right arrow navigation
- Learning view cards should support arrow key grid navigation
- Quiz options should support arrow key navigation

## Affected files

- `js/app.js` — keydown handlers missing arrow key support
- `css/styles.css` — no arrow-key focus management styles

## Suggested approach

Implement a roving tabindex pattern: one element in each group is focusable via Tab, and arrow keys move focus between siblings. This is the WAI-ARIA Authoring Practices recommended pattern for grid widgets.
