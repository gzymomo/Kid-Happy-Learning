---
title: "Bug & Feature Gap: Multiple discrepancies between requirements and implementation"
labels: bug
---

## Summary

After reviewing requirements.md against the current implementation, several discrepancies and issues were identified that should be addressed.

---

## 1. Missing Magic Challenge Entry Point (Critical)

**Requirement:** Section 3.2 describes "魔法挑战" (Magic Challenge) as a core quiz feature accessible from the home screen.
**Current state:** The quiz modal, logic, and event handlers all exist in `index.html` and `js/app.js`, but there is **no UI element** (card or button) to launch it.

**Files:**
- `index.html` — no quiz category card
- `js/app.js:332-447` — quiz logic fully implemented but unreachable

**Fix:** Add a "魔法挑战" category card on the home view alongside the 3 learning modules.

---

## 2. Missing "长按Logo 3秒" Parent Access (Medium)

**Requirement (Section 14.1):** "长按Logo 3秒 → 进入家长区" as the primary parent access method.
**Current state:** Only the footer 5-click method is implemented (`initFooterTriggers`). There is no logo element on the page.

**Files:**
- `js/app.js:545-554` — only footer triggers exist
- `index.html` — no logo element

**Fix:** Add a clickable logo element to the header/home view with a 3-second long-press handler.

---

## 3. Star Reward Audio Never Played (Medium)

**Requirement (Section 3.1):** "累计星星给予鼓励动画" with sound feedback.
**Current state:** `audio/effects/star.mp3` is loaded into the AudioManager but **never played**. Only `correct.mp3` fires on quiz success.

**Files:**
- `js/app.js:75-80` — `addStar()` increments counter but plays no sound
- `js/app.js:181-185` — star audio is loaded but unused

**Fix:** Call `audioManager.play('star')` in `addStar()` or when rewarding stars.

---

## 4. Privacy Modal Can Be Bypassed via Escape Key (Medium)

**Requirement (Section 11.2):** "首次打开显示隐私声明弹窗，点击'我知道了'关闭"
**Current state:** Pressing `Escape` closes the privacy modal via the global keydown handler, **without** setting `state.privacyAccepted = true`. The modal will reappear on next load, but it's a UX inconsistency.

**Files:**
- `js/app.js:636-646` — Escape handler closes modals unconditionally
- `js/app.js:510-514` — `acceptPrivacy()` is the only way to properly accept

**Fix:** Exclude `privacyModal` from the Escape-close behavior, or require explicit button click.

---

## 5. Visited Arrays Accumulate Duplicates (Bug)

**Current state:** Every card click pushes the item ID to `visitedLetters`/`visitedWords`/`visitedChinese` without checking for duplicates. This inflates the parent area progress stats.

**Files:**
- `js/app.js:228-229`, `js/app.js:249-250`, `js/app.js:270-271`
- `js/app.js:517-519` — parent modal shows inflated counts

**Fix:** Check `includes()` before pushing, or use a `Set`-based approach.

---

## 6. quizStats Loses consecutiveWrong Data (Bug)

**Current state:** In `handleQuizAnswer`, only `consecutiveCorrect` is saved to `state.quizStats`. The `consecutiveWrong` tracking (used for increasing difficulty) is lost on page reload.

**Files:**
- `js/app.js:488` — `state.quizStats = quizState.consecutiveCorrect`

**Fix:** Save both objects, e.g. `state.quizStats = { correct: ..., wrong: ... }`.

---

## 7. Missing PWA Icons (Minor)

**Current state:** `manifest.json` references `assets/icon-192.png` and `assets/icon-512.png` but the `assets/` directory is empty (only `.gitkeep`).

**Impact:** PWA install prompt will fail; Lighthouse will flag missing icons.

---

## 8. Missing Audio Files (Known Risk)

**Current state:** All audio files referenced in `data/content.json` (19+ MP3 files) don't exist. The app gracefully falls back to `speechSynthesis`, but offline mode won't work for audio.

**Mitigation:** The Service Worker should handle missing audio gracefully (currently returns 204 for audio requests that fail to cache).

---

## 9. Service Worker Assumes Root Deployment (Bug)

**Current state:** `sw.js` uses absolute paths (`/index.html`, `/css/styles.css`) and `app.js` registers `/sw.js`. If the app is deployed to a subdirectory (e.g., GitHub Pages with custom domain path), all caching will fail.

**Files:**
- `sw.js:2-9` — hardcoded absolute paths
- `js/app.js:649-652` — `/sw.js` registration

**Fix:** Use relative paths or detect the base URL dynamically.

---

## 10. Touch Target Size Violations (Accessibility)

**Requirement (Section 3.4):** "触控目标：最小 80×80px"
**Current state:**
- `.card-phrase span` — approximately 28×20px (phrase tags on Chinese cards)
- `.trigger-dot` — 8×8px (parent access dots, intentionally hidden but still clickable)

**Files:** `css/styles.css:443-456`, `css/styles.css:896-901`

---

## Suggested Enhancements

1. **"休息一下" reminder** — After 2-5 minutes of activity, suggest a break (per Section 7.1 best practices)
2. **Dynamic quiz difficulty persistence** — Save and restore consecutiveCorrect/consecutiveWrong across sessions
3. **Audio preloading strategy** — Lazy-load audio on first visit to each card rather than all at once
4. **Content validation** — Add a schema check for `content.json` to catch missing fields at startup
