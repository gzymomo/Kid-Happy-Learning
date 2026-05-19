# Project Review: Kid-Happy-Learning

## Overview
A single-page web app for 3-5 year old children to learn letters (A-G), English words, and Chinese characters. Built with vanilla JS, Howler.js, CSS Grid/Flexbox, and Service Worker.

---

## Bug 1: Service Worker doesn't cache audio files — offline audio silently fails

**File:** `sw.js:2-8`
**Acceptance Criteria violated:** G-01, W-03

The `ASSETS_TO_CACHE` array only caches:
- `/`, `/index.html`, `/css/styles.css`, `/js/app.js`, `/data/content.json`, Howler.js CDN

It does **not** include any audio files from `/audio/`. When offline:
- The fetch handler's `catch` returns `new Response('', { status: 204 })` for audio requests
- Audio playback silently fails (no sound, no user-visible error)

**Fix needed:** Cache audio files in the SW install step, or implement a runtime caching strategy for audio.

---

## Bug 2: Stars not displayed on home page

**File:** `index.html` (no star display in home view), `js/app.js:70-73`
**Requirement:** Section 3.1 — "星星展示：首页顶部显示当前星星总数"

The `#starsDisplay` element only exists inside the `.learning-view` header. When the user is on the home view (`#homeView`), there is no star counter visible. The `updateStarsDisplay()` function only updates `#starCount` text, but the home view has no element to display it.

**Fix needed:** Add a star display element to the home view section.

---

## Bug 3: Visited arrays accumulate duplicate entries, inflating parent zone stats

**File:** `js/app.js:228,249,270`
**Requirement:** Section 14.2 — parent zone progress stats

Every click on a card pushes the item ID into the visited array without deduplication:
```js
state.visitedLetters.push(letter.id);  // runs every click
```

This means clicking the same letter 5 times records 5 entries. The parent zone uses `.length` to compute progress:
```js
document.getElementById('statLetters').textContent = state.visitedLetters.length + '/7';
```

This reports inflated counts (e.g., "5/7" when only 1 letter was visited multiple times).

**Fix needed:** Check for duplicates before pushing, or use a `Set`-like structure.

---

## Bug 4: Web Speech API conflicts with offline requirement

**File:** `js/app.js:82-101, 462-465, 621-622`
**Requirement:** Section 5.1 — explicitly rejected Web Speech API because it requires network

The `speak()` function uses `window.speechSynthesis.speak()` for:
- Quiz encouragement phrases after correct answers
- Welcome messages when entering a learning module

Section 5.1 states: "矛盾：需求要求'可离线运行'，但Speech API需要网络". The decision was to use pre-recorded audio only.

**Fix needed:** Replace SpeechSynthesis calls with pre-recorded audio playback, or skip speech fallback entirely.

---

## Missing Feature 1: Long-press logo to enter parent zone not implemented

**File:** `index.html`, `js/app.js:545-554`
**Requirement:** Section 14.1 — "长按Logo 3秒 → 进入家长区（防止儿童误入）或连续点击右下角空白处5次"

The HTML has no logo element. Only the footer click trigger (5 consecutive clicks on `.footer-triggers` dots) is implemented. The long-press-on-logo method is completely missing.

**Fix needed:** Add a logo element (site title/icon) and implement a 3-second long-press/touch-hold handler.

---

## Missing Feature 2: Words and Chinese characters lack story functionality

**File:** `data/content.json`, `js/app.js:240-282`
**Requirement:** Section 2.1 — "每个字母/单词配一段1-2句话、20-40字的短故事"

The content model only includes `story` and `storyAudioFile` fields for letters. Word and Chinese character cards only play audio on click — they don't show a story modal.

Per Section 4.1 content model, stories are only defined for letters. However Section 2.1's text says "每个字母/**单词**配一段...短故事", implying words should also have stories. The content model and implementation don't match this.

**Fix needed:** Either add story fields to words/chinese in the content model, or update the requirement to clarify that stories are letters-only.

---

## Improvement: No error handling for content.json fetch

**File:** `js/app.js:660-669`

If the `data/content.json` fetch fails (network error, server error, file missing), the catch block only logs to console. The app remains in a broken state with no user-visible error message, no retry mechanism, and no fallback content.

**Suggestion:** Show a user-friendly retry/cancel dialog and attempt to reload from cache or retry.

---

## Improvement: Howler.js CDN dependency with no local fallback

**File:** `index.html:172`

Howler.js is loaded from `cdnjs.cloudflare.com`. The SW caches it after first load, but on the very first load (before SW is installed), if the CDN is unreachable, the entire audio system fails.

**Suggestion:** Bundle a local copy of Howler.js or add a `<script>` fallback.

---

## Improvement: No automated tests

No test files found in the repository. The acceptance criteria (Section 8) specify manual verification methods. Adding unit tests for quiz logic, storage, and content loading would improve reliability.

---

## Summary

| Severity | Issue |
|----------|-------|
| **Critical** | 🐛 SW doesn't cache audio → offline audio broken |
| **Critical** | 🐛 Stars not visible on home page |
| **High** | 🐛 Visited arrays accumulate duplicates (wrong stats) |
| **High** | 🐛 SpeechSynthesis used despite offline requirement |
| **Medium** | 🚫 Long-press logo for parent zone missing |
| **Medium** | 🚫 Words/chinese cards lack story modal |
| **Low** | 💡 No error handling for content fetch |
| **Low** | 💡 No local Howler.js fallback |
| **Low** | 💡 No automated tests |
