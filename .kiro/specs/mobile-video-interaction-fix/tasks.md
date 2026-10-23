# Implementation Plan

## Overview

All four bug fixes described in the bugfix requirements are **already applied** to the codebase. The implementation spans `src/components/Presentation.tsx`, `src/components/ProjectCard.tsx`, `src/components/ProjectCard.module.css`, and `src/components/Presentation.module.css`. Existing unit tests in `Presentation.test.tsx` and `ProjectCard.test.tsx` cover the primary behaviors.

The remaining work is verification and filling test coverage gaps identified in the design document:

- CSS title visibility test (Property 4 — not yet covered)
- Explicit non-video card test (Property 6 — partially covered)
- Poster attribute verification (Property 9 — partially covered)
- data-playing attribute synchronization test
- Property-based tests with fast-check
- Integration test for full mobile scroll flow
- Build and lint verification

The tasks follow a linear sequence: exploration tests first (verify bug conditions are resolved), preservation tests next (verify no regressions), implementation verification (confirm the already-applied fixes are complete), then additional test coverage (property-based and integration tests), and finally a checkpoint.

## Tasks

- [x] 1. Write bug condition exploration tests
  - **Property 1: Bug Condition** - Touch Device Viewport-Based Playback
  - **Property 2: Bug Condition** - iOS Safari Inline Playback
  - **Property 3: Bug Condition** - Graceful Play Promise Rejection Handling
  - **Property 4: Bug Condition** - Project Title Visibility During Hover
  - **NOTE**: The implementation is already applied to the codebase. These tests verify the current (fixed) code resolves each bug condition. If any test fails, it indicates the fix is incomplete and the root cause hypothesis needs revisiting.
  - **Property 1 (Touch Device Viewport-Based Playback)**: Existing tests in `Presentation.test.tsx` and `ProjectCard.test.tsx` already simulate IntersectionObserver entries with `intersectionRatio: 0.6` (entering) and `0.1` (leaving) on a mocked touch device and assert `play()` / `pause()` are called. Verify these tests pass on the current code.
  - **Property 1 (data-playing attribute synchronization)**: Add a new test in `ProjectCard.test.tsx` that asserts the `data-playing` attribute on the article element toggles to `"true"` when IntersectionObserver fires an intersecting entry (ratio >= 0.5) on a touch device, and toggles to `"false"` when a non-intersecting entry fires (ratio < 0.2). This verifies the React state (`isPlaying`) is synchronized with the CSS-driven visual state for both mouse hover and IntersectionObserver-driven playback.
  - **Property 2 (iOS Safari Inline Playback)**: Existing tests in both test files already assert the `<video>` element has the `playsinline` attribute. Verify these tests pass on the current code.
  - **Property 3 (Graceful Play Promise Rejection Handling)**: Existing tests in both test files mock `play()` to reject with `DOMException` (AbortError) and assert no uncaught exception is thrown on mouse enter. Verify these tests pass on the current code.
  - **Property 4 (Project Title Visibility During Hover)**: Add a new test that verifies the ProjectCard CSS does not use `opacity: 0` on `.projectCardContent` in the active/hover state. Since jsdom does not compute CSS module styles, read the CSS file content directly (e.g., `fs.readFileSync(path.resolve(__dirname, "./ProjectCard.module.css"), "utf-8")`) and assert that the active-state rules for `.projectCardContent` use `top` and `transform` transitions rather than `opacity: 0`. Also assert that the gradient scrim (`.projectCardOverlay::after`) fades in during the active state. The pre-fix code set `opacity: 0` on the overlay content during hover; the fixed code slides content to the bottom instead.
  - Run all exploration tests on the current (fixed) code
  - **EXPECTED OUTCOME**: Tests PASS (confirms the bugs are resolved in the current implementation)
  - If any test fails, document the failure and revisit the root cause hypothesis from the design document
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 2. Write preservation property tests
  - **Property 5: Preservation** - Desktop Mouse Hover Behavior
  - **Property 6: Preservation** - Non-Video Card Display
  - **Property 7: Preservation** - Click Navigation and Analytics
  - **Property 8: Preservation** - Presentation Click Toggle
  - **Property 9: Preservation** - Video Configuration Attributes
  - **IMPORTANT**: Follow observation-first methodology. Observe behavior on the current (fixed) code for non-bug-condition inputs, then write tests capturing observed behavior patterns.
  - **Property 5 (Desktop Mouse Hover Behavior)**: Existing tests in both test files assert `onMouseEnter` calls `play()` and `onMouseLeave` calls `pause()`. Verify these tests pass on the current code.
  - **Property 6 (Non-Video Card Display)**: Add a new test in `ProjectCard.test.tsx` that renders a ProjectCard **without** a `videoUrl` prop and asserts that no `<video>` element is present in the DOM. Existing rendering tests render non-video cards but do not explicitly assert the absence of a video element. This confirms cards without video URLs do not render or attempt to play a video.
  - **Property 7 (Click Navigation and Analytics)**: Existing test in `ProjectCard.test.tsx` asserts `trackEvent("Project", "click", title)` is called on card click. Verify this test passes on the current code.
  - **Property 8 (Presentation Click Toggle)**: Existing test in `Presentation.test.tsx` asserts clicking the video toggles between play and pause states. Verify this test passes on the current code.
  - **Property 9 (Video Configuration Attributes)**: Existing tests check `loop`, `muted`, and `playsInline` on the Presentation video, and `poster` and `playsinline` on the ProjectCard video. Add a test in `Presentation.test.tsx` that verifies the `poster` attribute value matches the expected Cloudinary URL (`https://res.cloudinary.com/dnclrisd7/video/upload/so_0,w_1200,h_630,c_fill,q_auto,f_jpg/v1782407137/portadaportfolio_edi1pf.jpg`). This confirms the poster image configuration is preserved.
  - Run all preservation tests on the current (fixed) code
  - **EXPECTED OUTCOME**: Tests PASS (confirms baseline behavior is preserved with no regressions)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 3. Verify implementation completeness
  - The implementation is already applied to the codebase. This task verifies the fixes are complete and correct against the design specifications.
  - [x] 3.1 Verify the Presentation component implementation
    - Confirm `IntersectionObserver` is set up in the `useEffect` hook with `threshold: [0.2, 0.5]`
    - Confirm `isTouchOrMobile()` helper uses `window.matchMedia("(hover: none), (max-width: 768px)")`
    - Confirm `playsInline` attribute is present on the `<video>` element
    - Confirm `playVideo()` wraps `play()` in a `playPromise !== undefined` check with `.catch(() => {})`
    - Confirm IntersectionObserver callback wraps `video.play()` with `.catch(() => {})`
    - Confirm `handleMouseEnter`, `handleMouseLeave`, and `handleTogglePlay` handlers are unchanged from the original desktop behavior
    - Confirm the `useEffect` cleanup calls `observer.disconnect()`
    - Confirm guard `if (typeof IntersectionObserver === "undefined") return` is present
    - _Bug_Condition: isBugCondition(input) from design — touch device playback, iOS Safari inline playback, unhandled promise rejection_
    - _Expected_Behavior: expectedBehavior(result) from design — viewport-based playback, inline playback, graceful promise handling_
    - _Preservation: Desktop mouse hover play/pause, click toggle, video config attributes_
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.4, 3.5_

  - [x] 3.2 Verify the ProjectCard component implementation
    - Confirm `IntersectionObserver` is set up in the `useEffect` hook (with `isVideo` in dependency array) using `threshold: [0.2, 0.5]`
    - Confirm `isTouchOrMobile()` helper uses `window.matchMedia("(hover: none), (max-width: 768px)")`
    - Confirm `playsInline` attribute is present on the `<video>` element
    - Confirm `playVideo()` wraps `play()` in a `playPromise !== undefined` check with `.catch(() => {})`
    - Confirm IntersectionObserver callback wraps `video.play()` with `.catch(() => {})`
    - Confirm `setIsPlaying(true)` / `setIsPlaying(false)` are called in sync with play/pause in the IntersectionObserver callback
    - Confirm `data-playing={isPlaying ? "true" : "false"}` attribute is set on the `<article>` element
    - Confirm `handleMouseEnter` / `handleMouseLeave` handlers remain unchanged (call `playVideo()` / `pauseVideo()` and `setIsPlaying`)
    - Confirm `isVideo` guard (`Boolean(videoUrl)`) controls video rendering and IntersectionObserver effect execution
    - Confirm the `useEffect` returns early when `!isVideo` and cleanup calls `observer.disconnect()`
    - _Bug_Condition: isBugCondition(input) from design — touch device playback, iOS Safari inline playback, unhandled promise rejection, title hidden on hover_
    - _Expected_Behavior: expectedBehavior(result) from design — viewport-based playback, inline playback, graceful promise handling, title visible during hover_
    - _Preservation: Desktop mouse hover play/pause, non-video card display, click navigation and analytics_
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3_

  - [x] 3.3 Verify the ProjectCard CSS implementation
    - Confirm `.projectCardContent` uses `top` and `transform` transitions (not `opacity: 0`) for the active state
    - Confirm the active state selectors include `.projectCard:hover`, `.projectCardLink:focus-visible`, `.projectCardLink:focus-within`, and `.projectCard[data-playing="true"]`
    - Confirm `.projectCardOverlay::after` gradient scrim pseudo-element exists with `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 35%, transparent 70%)` and fades in during active state
    - Confirm `.projectCardVideo` opacity transitions from 0 to 1 during active state
    - _Bug_Condition: isBugCondition(input) from design — title hidden on hover (opacity: 0 overlay)_
    - _Expected_Behavior: Content slides to bottom with gradient scrim, title remains visible_
    - _Requirements: 2.4_

  - [x] 3.4 Verify bug condition exploration tests pass
    - **Property 1: Expected Behavior** - Touch Device Viewport-Based Playback
    - **Property 2: Expected Behavior** - iOS Safari Inline Playback
    - **Property 3: Expected Behavior** - Graceful Play Promise Rejection Handling
    - **Property 4: Expected Behavior** - Project Title Visibility During Hover
    - **IMPORTANT**: Re-run the SAME tests from task 1 — do NOT write new tests
    - The tests from task 1 encode the expected behavior for each bug condition
    - When these tests pass, it confirms the expected behavior is satisfied
    - Run all bug condition exploration tests from task 1
    - **EXPECTED OUTCOME**: Tests PASS (confirms all four bugs are fixed)
    - _Requirements: Expected Behavior Properties 2.1, 2.2, 2.3, 2.4 from design_

  - [x] 3.5 Verify preservation tests still pass
    - **Property 5: Preservation** - Desktop Mouse Hover Behavior
    - **Property 6: Preservation** - Non-Video Card Display
    - **Property 7: Preservation** - Click Navigation and Analytics
    - **Property 8: Preservation** - Presentation Click Toggle
    - **Property 9: Preservation** - Video Configuration Attributes
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - Run all preservation property tests from task 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions introduced)
    - Confirm all tests still pass after verification (no regressions)
    - _Requirements: Preservation Requirements 3.1, 3.2, 3.3, 3.4, 3.5 from design_

- [x] 4. Add property-based tests
  - **Property 1: Bug Condition** - Intersection Ratio Threshold Behavior
  - **Property 2: Preservation** - Non-Video Card Never Plays Video
  - Install `fast-check` as a dev dependency: `npm install --save-dev fast-check`
  - **Property 1 (Intersection Ratio Thresholds)**: Write a property-based test in a new file `src/components/Presentation.pbt.test.tsx` (or extend the existing test file) that generates random intersection ratios between 0.0 and 1.0. For each ratio, simulate an IntersectionObserver entry on a mocked touch device and assert: `play()` is called when `intersectionRatio >= 0.5` and `isIntersecting` is true; `pause()` is called when `intersectionRatio < 0.2` or `isIntersecting` is false. Use `fc.float({ min: 0, max: 1, maxExcluded: true })` or `fc.record` to generate the ratio values. **Important**: Account for the hysteresis zone — when `0.2 <= intersectionRatio < 0.5` and `isIntersecting` is true, neither `play()` nor `pause()` is called (the video state is unchanged). The property test must verify this three-way behavior: play at >= 0.5, pause at < 0.2 (or not intersecting), and no action in the [0.2, 0.5) zone.
  - **Property 2 (Non-Video Card Preservation)**: Write a property-based test in `src/components/ProjectCard.pbt.test.tsx` that generates random ProjectCard configurations with and without `videoUrl`. For configurations without `videoUrl`, assert that no `<video>` element is rendered and `play()` is never called regardless of mouse enter, mouse leave, or IntersectionObserver events. For configurations with `videoUrl`, assert the video element is present.
  - **Property 3 (Rapid Play/Pause No Uncaught Errors)**: Write a property-based test that generates random sequences of play/pause actions (rapid hover/leave cycles) and asserts no uncaught exceptions occur. Mock `play()` to return a promise that rejects with `DOMException` (AbortError) and verify all rejections are caught by the `.catch()` handler.
  - Run property-based tests: `npm test -- --run`
  - **EXPECTED OUTCOME**: All property-based tests pass, providing stronger guarantees across the input domain
  - _Requirements: 2.1, 2.3, 3.2_

- [x] 5. Add integration tests
  - Write an integration test in a new file `src/components/MobileScrollFlow.test.tsx` (keeping it alongside the existing component tests, consistent with the project structure)
  - **Mobile Scroll Flow Test**: Render multiple ProjectCards (some with `videoUrl`, some without) inside a BrowserRouter. Mock `matchMedia` to return `matches: true` for touch device detection. Simulate a scroll sequence by firing IntersectionObserver entries for each card in order (entering viewport, then leaving). Assert that:
    - Cards with `videoUrl` call `play()` when entering and `pause()` when leaving
    - Cards without `videoUrl` never call `play()` and never render a `<video>` element
    - The `data-playing` attribute on each video card toggles correctly during the scroll sequence
    - No uncaught promise rejections occur during rapid scroll past multiple cards
  - **Mixed Component Test**: Render both a `Presentation` component and multiple `ProjectCard` components on the same page. Simulate IntersectionObserver entries for each and verify each component's video plays and pauses independently without interference.
  - **Visual Feedback Test**: Verify that when a ProjectCard enters the viewport on a touch device, the `data-playing` attribute is set to `"true"` (which drives the CSS slide-to-bottom animation and gradient scrim visibility). This can be verified by asserting the attribute value changes.
  - Run integration tests: `npm test -- --run`
  - **EXPECTED OUTCOME**: Integration tests pass, confirming the full mobile scroll flow works correctly with multiple cards
  - _Requirements: 2.1, 2.4, 3.2_

- [x] 6. Checkpoint - Ensure all tests pass
  - Run the full test suite: `npm test` (which runs `vitest run`)
  - Run the build: `npm run build` (which runs `tsc -b && vite build`)
  - Run the linter: `npm run lint` (which runs `eslint .`)
  - Verify all tests pass, the build succeeds, and lint produces no errors
  - If any test fails or the build/lint produces errors, fix the issue and re-run
  - Ask the user if questions arise during verification
  - _Requirements: All requirements (2.1-2.4, 3.1-3.5)_

## Notes

- The implementation for all four bug fixes is already complete in the codebase. Tasks 1-3 focus on verification of the existing implementation, while tasks 4-6 add additional test coverage and final verification.
- **Exploration tests** (task 1) are expected to PASS on the current code since the fixes are already applied. This is different from the standard bugfix workflow where exploration tests fail on unfixed code. If any exploration test fails, it means the fix is incomplete and the root cause hypothesis from the design document should be revisited.
- **Preservation tests** (task 2) follow the observation-first methodology: observe the current (fixed) behavior for non-bug-condition inputs, then write tests capturing that behavior.
- **Property-based tests** (task 4) are now implemented in `src/components/Presentation.pbt.test.tsx` and `src/components/ProjectCard.pbt.test.tsx` using `fast-check`, which is installed as a dev dependency. The property tests verify the three-way intersection ratio threshold behavior (play at >= 0.5, pause at < 0.2, no action in the [0.2, 0.5) hysteresis zone), non-video card preservation, and rapid play/pause sequences without uncaught errors.
- **Integration tests** (task 5) are now implemented in `src/components/MobileScrollFlow.test.tsx`. They verify the full mobile scroll flow with multiple mixed ProjectCards (with and without videoUrl), mixed component interaction between Presentation and ProjectCards, and visual feedback via the `data-playing` attribute.
- **Checkpoint** (task 6): All 70 tests pass (15 test files), `npm run build` succeeds, and `npm run lint` produces 0 errors.
- The `data-playing` attribute on the ProjectCard article element is the bridge between React state (`isPlaying`) and CSS visual state, enabling consistent styling for both mouse hover and IntersectionObserver-driven playback on touch devices.
- The `isTouchOrMobile()` helper in both components uses `window.matchMedia("(hover: none), (max-width: 768px)")` to detect touch-only or small-screen devices.
- The IntersectionObserver uses `threshold: [0.2, 0.5]` for hysteresis: play at >= 0.5 intersection ratio, pause at < 0.2, preventing flicker during scroll.
