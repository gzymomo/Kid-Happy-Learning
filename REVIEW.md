# Code Review: Kid Happy Learning

## Critical Issues (Must Fix)

### 1. Missing Audio Files
**Files**: `audio/` and `assets/` contain only `.gitkeep` — no actual audio files.
**Impact**: Breaks all sound playback, offline functionality, and core acceptance criteria (L-01, W-01, C-01, Q-02, Q-03). The `speak()` Web Speech API fallback cannot work offline.
**Fix**: Generate placeholder audio files via TTS as noted in Risk Register (Section 9).

### 2. localStorage Expiry Only Applies to Stars
**File**: `js/app.js:33-36`
**Issue**: `getStorage()` only checks 30-day expiry for `stars`. Other data (`visitedLetters`, `visitedWords`, `visitedChinese`, `quizHistory`) never expires.
**Fix**: Add a global `expiresAt` timestamp and expire all data together, or increment `STORAGE_VERSION` on a schedule.

### 3. No Magic Challenge Entry Point on Home Page
**Issue**: The quiz system is fully implemented but has **no UI trigger** on the home page. Users cannot discover or launch the quiz.
**Fix**: Add a "魔法挑战" card/button on the home page that calls the quiz system.

### 4. Missing Long-Press Entry for Parent Area
**Requirement** (Section 14.1): "长按Logo 3秒进入家长区"
**Issue**: Only the 5-click footer method is implemented. No long-press handler exists.
**Fix**: Add `touchstart`/`mousedown` + `setTimeout(3000)` on the home title or logo.

### 5. Stars Not Shown on Home Page
**Requirement** (Section 3.1): "星星展示：首页顶部显示当前星星总数"
**Issue**: `#starsDisplay` only appears in the learning-view header, not on the home page.
**Fix**: Move or duplicate stars display into the home view.

---

## Medium-Priority Issues

### 6. Duplicate Visited Entries on Repeated Card Clicks
**File**: `js/app.js:228, 249, 270`
**Issue**: `state.visitedLetters/Words/Chinese.push()` runs every click with no dedup check. Repeated clicks create duplicates in the arrays. Parent area stats will be misleading.

### 7. Service Worker Doesn't Pre-cache Audio
**File**: `sw.js:2-9`
**Issue**: `ASSETS_TO_CACHE` includes HTML/CSS/JS/Howler CDN but no audio files. The SW fetch handler caches on first access, but audio won't be available on first offline load.
**Fix**: Add audio file paths to `ASSETS_TO_CACHE`, or implement a separate audio caching strategy.

### 8. Hardcoded Progress Denominators
**File**: `js/app.js:518-520`
**Issue**: `state.visitedLetters.length + '/7'` — denominators are hardcoded. When content is extended (requirement says up to A-Z = 26 letters), these will be wrong.
**Fix**: Derive denominators from `content.letters.length`, etc.

### 9. No Story for Words/Chinese Characters
**Requirement** (Section 2.1): "每个字母/单词配一段 1-2句话的短故事" — also implies words and Chinese characters should have stories.
**Issue**: Only letters have `story` and `storyAudioFile` fields.

### 10. Quiz Exit Doesn't Save Progress
**File**: `js/app.js:578-584`
**Issue**: Closing the quiz modal via Escape/X discards the current unsaved question state. `quizState` resets to last saved state from `state.quizHistory` on next open.

---

## Low-Priority Issues

### 11. WebM/MP3 Priority Reversed
**File**: `js/app.js:120`
**Issue**: `src: [src.replace('.mp3', '.webm'), src]` — WebM listed first (primary), MP3 second (fallback). Requirement says "MP3（主）+ WebM（备用）".

### 12. Consecutive Correct/Wrong Tracking Not Persisted
**File**: `js/app.js:339-340`
**Issue**: `quizState.consecutiveCorrect/Wrong` are initialized fresh per session. The adaptive difficulty (reduced frequency after 3 consecutive correct, increased after 2 wrong) resets on page reload.

### 13. Story Appears After Fixed 1s Delay, Not After Audio
**File**: `js/app.js:230-232`
**Issue**: `setTimeout(showStory, 1000)` — story shows 1s after click, regardless of when audio finishes. Should chain on audio `onend` event.

### 14. No Error State for Content Loading Failure
**File**: `js/app.js:667-669`
**Issue**: If `content.json` fails to load, the app silently shows a blank learning view with no user feedback.

### 15. High Contrast Mode Incomplete
**File**: `css/styles.css:29-38`
**Issue**: Only color variables are overridden. Some elements use hardcoded colors that aren't affected (e.g., `.card-phrase span` background at line 453, `.modal-close` background at line 499).

### 16. Footer Trigger Dots Hard to Discover
**File**: `css/styles.css:887-893`, `index.html:63-69`
**Issue**: Parent area entry dots have `opacity: 0` (hidden), appear at only `opacity: 0.3` on hover. Extremely hard to discover.

### 17. Keyboard Navigation Lacks Arrow Key Support
**Issue**: `no-touch` mode adds focus styles but uses only Tab for navigation. Requirement mentions "方向键+Enter键盘导航" (arrow keys + Enter), which would need a roving tabindex pattern.

### 18. Missing Touch Event Optimizations
**Issue**: All interactions use `click` events. On touch devices this adds ~300ms latency. Using `touchstart` would feel more responsive for the "300ms内给出反馈" requirement.

---

## Optimizations & Suggestions

- Consider adding `prefers-color-scheme: dark` media query support
- Add a "rest reminder" screen after 2-5 minutes of activity (Section 7.1)
- Add `.webp` icon support in manifest for better compression
- Consider lazy-loading audio with `preload: true` for faster playback
- Add `will-change: transform` to animated elements for GPU acceleration
