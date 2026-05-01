# Code Review: Requirements vs Implementation Discrepancies

## 🔴 Critical Issues

### 1. Missing "Magic Challenge" Entry Point
- **Requirement**: Section 3.2 specifies a "魔法挑战" (Magic Challenge) quiz feature accessible to users
- **Implementation**: Quiz modal, logic, and state management are fully implemented (`js/app.js:332-492`), but there is **no UI button or entry point** to launch the quiz from the home or learning views
- **Impact**: Users cannot access the quiz feature at all
- **Fix**: Add a "🎮 魔法挑战" button in the learning view header or home view

### 2. Long-Press Logo Entry to Parent Area Not Implemented
- **Requirement**: Section 14.1 specifies two entry methods:
  1. Long-press Logo for 3 seconds
  2. Click bottom-right blank area 5 times
- **Implementation**: Only the footer dot 5-click trigger is implemented (`js/app.js:545-554`). There is no logo element with a long-press handler
- **Impact**: One of two specified parent access methods is missing
- **Fix**: Add a logo element to the home view with a 3-second long-press handler

## 🟡 Medium Issues

### 3. Hardcoded Content Counts in Parent Area
- **Location**: `js/app.js:518-520` and `index.html:134-144`
- **Problem**: Stats display `0/7`, `0/6`, `0/6` hardcoded instead of reading from `content.letters.length`, etc.
- **Impact**: If content is extended via JSON (as per Section 4.2), the parent stats will show incorrect totals
- **Fix**: Dynamically compute totals from loaded content

### 4. Card Phrase Font Size Violates WCAG Requirement
- **Requirement**: Section 12 specifies minimum 18px font size
- **Implementation**: `.card-phrase span` uses `14px` (`css/styles.css:444`)
- **Impact**: Fails WCAG AA for children accessibility
- **Fix**: Increase to `18px` minimum

### 5. Star Expiry Only Resets Star Count
- **Requirement**: Section 11.3 says "localStorage数据30天自动过期"
- **Implementation**: `js/app.js:33-35` only resets `stars` to 0, but `visitedLetters`, `visitedWords`, `visitedChinese`, `quizHistory`, and `quizStats` persist indefinitely
- **Impact**: Inconsistent data lifecycle; progress data never expires
- **Fix**: Reset all state data on expiry, not just stars

### 6. Service Worker Registration Uses Absolute Path
- **Location**: `js/app.js:651`
- **Problem**: `navigator.serviceWorker.register('/sw.js')` uses absolute path
- **Impact**: Will fail if deployed to a subdirectory (e.g., GitHub Pages with custom base path)
- **Fix**: Use relative path `new URL('./sw.js', import.meta.url).href` or `'./sw.js'`

## 🔵 Minor Issues / Suggestions

### 7. Duplicate Visited Entries Not Prevented
- **Location**: `js/app.js:228, 248, 270`
- **Problem**: `state.visitedLetters.push(letter.id)` is called on every click without checking if already visited
- **Impact**: Array grows with duplicates, making progress tracking inaccurate
- **Fix**: Check `includes()` before push, or use a Set

### 8. Howler.js preload: false Defeats Offline Purpose
- **Location**: `js/app.js:122`
- **Problem**: `preload: false` means audio is not preloaded, contradicting the offline-first architecture
- **Suggestion**: Set `preload: true` or preload on-demand after first user interaction

### 9. No Content JSON Fetch Error Handling UI
- **Location**: `js/app.js:667-669`
- **Problem**: If `data/content.json` fails to load, the app silently fails with no user feedback
- **Suggestion**: Show a friendly error message

### 10. "Take a Break" Screen Not Implemented
- **Requirement**: Section 7.1 mentions "时间分块：每次活动2-5分钟，之后可显示'休息一下'页面"
- **Implementation**: No session timer or break screen exists
- **Suggestion**: Future enhancement, not critical for MVP

### 11. Missing Audio Files and PWA Icons
- `audio/` directory only contains `.gitkeep` — no actual MP3/WebM files
- `assets/` directory only contains `.gitkeep` — no PWA icons (manifest references `icon-192.png` and `icon-512.png`)
- The app gracefully falls back to Web Speech API, but offline audio won't work
- **Suggestion**: Add placeholder audio or document how to generate them

### 12. `quizStats` Overwrites Consecutive Wrong Data
- **Location**: `js/app.js:488`
- **Problem**: `state.quizStats = quizState.consecutiveCorrect` only saves consecutive correct, discarding `consecutiveWrong`
- **Impact**: The frequency adjustment system (`pickQuestion`) works in-session but wrong-streak data is lost between sessions
- **Fix**: Save both consecutiveCorrect and consecutiveWrong
