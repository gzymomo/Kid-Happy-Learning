---
title: "Take a break" page and activity timer not implemented
labels: enhancement, requirements-gap
---

## Description

Requirements section 7.1 (Design Principles) specifies:

> **时间分块**：每次活动2-5分钟，之后可显示"休息一下"页面
> (Time chunking: each activity lasts 2-5 minutes, after which a "take a break" page should be shown)

This feature is not implemented anywhere in the codebase. There is no activity timer, no break prompt, and no "rest" page/screen.

## Impact

- Children may spend excessive time on the app without breaks
- Missing an important child-safe design pattern recommended by early childhood education research
- No eye-strain or screen-time management

## Location

Not implemented. Would require:
- A timer mechanism in `js/app.js`
- A break page/section in `index.html`
- Break styling in `css/styles.css`

## Suggested Implementation

Add a 5-minute timer (configurable) that shows a break overlay:

1. Track session start time in `state`
2. After 5 minutes of continuous use, show a break overlay with fun animation
3. Include a "I've rested, let's go!" button to resume
4. Reset the timer after the break

```html
<div class="modal-overlay" id="breakModal" aria-hidden="true">
  <div class="modal break-modal" role="dialog">
    <div class="break-emoji">😴</div>
    <h2>休息一下吧！</h2>
    <p>眼睛累了？起来活动一下！</p>
    <button class="break-btn">我休息好了 ✨</button>
  </div>
</div>
```
