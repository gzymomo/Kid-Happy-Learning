---
title: "Additional improvements and minor issues uncovered during review"
labels: enhancement
---

This issue aggregates several smaller findings from a comprehensive audit.

## 1. No "take a break" screen (requirements §7.1)

The requirements reference a "时间分块" pattern — after 2-5 minutes, show a "休息一下" (take a rest) page. Not implemented.

## 2. High contrast mode doesn't override background gradient

`css/styles.css:29-38` — `.high-contrast` overrides colors but the sky background gradient at line 49 remains unchanged. May not meet WCAG AA contrast against the sky colors.

**Location**: `css/styles.css:49` — `background: linear-gradient(180deg, #87CEEB 0%, ...)`

## 3. `meta.totalStars` in content.json is unused

`data/content.json:5` — `"totalStars": 0` exists in the meta object but is never read by the code. Stars are tracked entirely in localStorage.

## 4. SW does not cache manifest.json

`sw.js:2-8` — `manifest.json` is missing from `ASSETS_TO_CACHE`. When offline, the PWA install prompt will not work.

## 5. Font stack may render poorly on some devices

`css/styles.css:47` — The font stack `'Comic Sans MS', 'Chalkboard SE', '幼圆', '圆体', sans-serif` relies on Chinese fonts that may be unavailable on non-Chinese systems. Consider adding `'Noto Sans SC'` or a web-safe CJK fallback.

## 6. Quiz difficulty state persists across sessions

`state.quizStats` stores `consecutiveCorrect` data but this is never reset or expired. A child who was doing well a week ago will still have reduced frequency on those questions.
