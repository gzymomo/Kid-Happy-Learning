---
title: "30-day localStorage expiry only applies to stars — other data persists indefinitely"
labels: ["bug", "low"]
---

## Description

§11.3 states: "localStorage数据30天自动过期（通过版本号检测清除旧数据）" (localStorage data auto-expires after 30 days via version check). However, the expiry logic in `js/app.js:33-36` only resets the `stars` count:

```js
if (data.starsTimestamp && Date.now() - data.starsTimestamp > STARS_EXPIRY_MS) {
  data.stars = 0;
  data.starsTimestamp = Date.now();
}
```

Other stored data (`visitedLetters`, `visitedWords`, `visitedChinese`, `quizStats`, `quizHistory`, `privacyAccepted`, `highContrast`) persists indefinitely.

## Requirements Affected

- §3.1: "星星用 localStorage 持久化存储（30天自动过期）" — only mentions stars
- §11.3: broader "localStorage数据30天自动过期" suggests all data should expire
- Q4: "localStorage，30天过期" — mentions all stored data

## Suggested Fix

Either:
1. Clear all localStorage data if the timestamp exceeds 30 days (clear the entire store)
2. Or reset all fields to defaults when stars expire
3. Add a `lastCleanup` timestamp to track global data expiry

Both approaches should also respect version changes (already handled via `STORAGE_VERSION` check).
