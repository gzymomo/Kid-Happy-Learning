---
title: "No arrow key navigation for keyboard/TV mode (G-04 partial)"
labels: enhancement
---

## Requirement

`requirements.md` §1 and §8 (G-04):
> 电视端无触控时，自动降级为方向键+Enter键盘导航
> 支持Tab/方向键+Enter，适用于无触控电视

## Implementation

`js/app.js:189-193` detects `maxTouchPoints === 0` and adds `.no-touch` class. Card click handlers support Enter/Space. However, there is **no arrow key navigation** — users cannot navigate the card grid using arrow keys. Focus management between grid cells is entirely dependent on native Tab order.

## Impact

On TV devices without touch, children must Tab through all elements sequentially rather than using intuitive arrow keys to navigate the grid.

## Suggested Fix

Add a `keydown` listener on the card grid container that handles ArrowUp/ArrowDown/ArrowLeft/ArrowRight to move focus between adjacent cards in the grid.
