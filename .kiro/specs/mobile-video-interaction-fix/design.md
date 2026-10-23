# Mobile Video Interaction Fix Bugfix Design

## Overview

This design document addresses four interconnected defects in the mobile and video interaction experience of the portfolio website. The bugs affect video playback on touch devices, iOS Safari inline playback, unhandled promise errors during rapid interaction, and the visibility of project titles during hover states. The fix spans two components (`Presentation` and `ProjectCard`) and their associated CSS modules.

At the time of this design, the implementation has already been applied to the codebase. All four bug conditions are resolved in the current code, and unit tests exist covering the primary behaviors. This document formalizes the bug conditions, documents the architecture of the fixes, defines correctness properties for validation, and identifies the remaining work needed: primarily verification that the fixes are complete, edge-case coverage, and ensuring no regressions are introduced by the changes already in place.

The general strategy was to add viewport-based autoplay for touch devices via `IntersectionObserver`, add the `playsInline` attribute for iOS Safari compatibility, wrap `.play()` calls in `.catch()` handlers to suppress uncaught promise rejections, and redesign the `ProjectCard` overlay so content slides to the bottom with a gradient scrim instead of being hidden with `opacity: 0`.

## Glossary

- **Bug_Condition (C)**: The condition that triggers each of the four bugs - touch-device users unable to play videos, iOS Safari forcing fullscreen, uncaught DOMException on rapid play/pause, and project titles disappearing on hover.
- **Property (P)**: The desired behavior for each bug condition - videos auto-play on viewport entry for touch devices, inline playback on iOS Safari, graceful promise rejection handling, and project titles remaining visible during hover/active states.
- **Preservation**: Existing desktop mouse-hover behavior, non-video card display, click navigation with analytics, Presentation click toggle, and video poster/loop/muted configuration that must remain unchanged by the fixes.
- **IntersectionObserver**: A browser API that detects when an element enters or leaves the viewport, used here to trigger autoplay/pause on touch devices.
- **playPromise**: The `Promise` returned by `HTMLMediaElement.play()`, which rejects with a `DOMException` (AbortError) when interrupted by `pause()` before playback begins.
- **isTouchOrMobile()**: A helper function in both components that uses `window.matchMedia("(hover: none), (max-width: 768px)")` to detect touch-only or small-screen devices.
- **data-playing attribute**: A data attribute on the `ProjectCard` article element (`data-playing="true"|"false"`) that mirrors the `isPlaying` state, enabling CSS to style the active state for both hover and IntersectionObserver-driven playback.
- **Gradient scrim**: A `::after` pseudo-element on `.projectCardOverlay` using a `linear-gradient` from opaque black at the bottom to transparent at the top, providing high contrast behind text content when it slides to the bottom during playback.

## Bug Details

### Bug Condition

The bugs manifest across four distinct conditions, all related to the video interaction experience. Each condition involves a specific input type and component context.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type InteractionInput (with component, deviceType, interactionType, and action fields)
  OUTPUT: boolean

  // Bug 1.1: Touch device playback
  IF input.component IN ["Presentation", "ProjectCard"]
     AND input.deviceType IN ["touch", "mobile", "tablet"]
     AND input.interactionType IN ["viewportEnter", "viewportLeave"]
     AND NOT viewportBasedPlaybackImplemented(input.component)
    RETURN TRUE

  // Bug 1.2: iOS Safari inline playback
  IF input.component IN ["Presentation", "ProjectCard"]
     AND input.deviceType = "iOS Safari"
     AND NOT videoElementHasPlaysInline(input.component)
    RETURN TRUE

  // Bug 1.3: Unhandled play() promise rejection
  IF input.component IN ["Presentation", "ProjectCard"]
     AND input.action = "rapidPlayPause"
     AND NOT playPromiseHasCatchHandler(input.component)
    RETURN TRUE

  // Bug 1.4: Title hidden on hover
  IF input.component = "ProjectCard"
     AND input.componentHasVideo = TRUE
     AND input.interactionType = "hover"
     AND contentOverlayUsesOpacityZero(input.component)
    RETURN TRUE

  RETURN FALSE
END FUNCTION
```

### Examples

- **Example 1 (Touch device - Presentation)**: A mobile user scrolls and the Presentation video enters the viewport. Expected: video auto-plays. Actual (pre-fix): nothing happens because only `onMouseEnter`/`onMouseLeave` handlers exist, and touch devices do not fire mouse hover events.
- **Example 2 (iOS Safari - ProjectCard)**: An iPhone user views a project card with a video. Expected: video plays inline within the card. Actual (pre-fix): iOS Safari forces the video into fullscreen mode or blocks inline playback because the `playsInline` attribute is missing.
- **Example 3 (Rapid interaction - Presentation)**: A desktop user hovers over the Presentation video, then quickly moves the mouse away. The `play()` promise is still pending when `pause()` is called. Expected: the rejection is silently caught. Actual (pre-fix): browser console shows "Uncaught (in promise) DOMException: The play() request was interrupted by a call to pause()."
- **Example 4 (Hover title - ProjectCard)**: A user hovers over a ProjectCard with a video. Expected: project title and description remain visible (moved to bottom). Actual (pre-fix): the overlay content opacity drops to 0, making the title and description completely disappear while the video plays.
- **Edge case (Touch + rapid scroll)**: A mobile user scrolls rapidly past multiple ProjectCards. Each card's IntersectionObserver fires, calling `play()` then `pause()` in quick succession. Expected: all promise rejections are caught without console errors. Actual (pre-fix): multiple uncaught DOMException errors accumulate in the console.

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Mouse hover on desktop devices must continue to play the video on `onMouseEnter` and pause on `onMouseLeave` for both Presentation and ProjectCard components.
- ProjectCard instances without a `videoUrl` must continue to display only the static image with the title and description overlay, without rendering or attempting to play a video element.
- Clicking a ProjectCard link must continue to navigate to the project URL and track the click event via `trackEvent("Project", "click", title)`.
- Clicking the Presentation video on desktop must continue to toggle between play and pause states.
- Loaded videos must continue to display the poster image, loop, and play muted as configured by the existing `poster`, `loop`, and `muted` attributes.

**Scope:**
All inputs that do NOT involve the four bug conditions should be completely unaffected by these fixes. This includes:
- Desktop mouse hover interactions (already working, must be preserved)
- ProjectCards without video URLs (static image cards, no video logic)
- Click navigation and analytics tracking on ProjectCards
- Click-to-toggle on the Presentation video
- Video configuration attributes (poster, preload, loop, muted)

## Hypothesized Root Cause

Based on the bug description, the most likely causes for each defect were:

1. **Touch Device Playback (1.1)**: The original code relied exclusively on `onMouseEnter` and `onMouseLeave` event handlers for video activation. Touch devices (mobile phones, tablets) do not fire synthetic mouse hover events in the same way as desktop pointers, leaving touch users with no way to trigger video playback.
   - No viewport-based activation mechanism (e.g., `IntersectionObserver`) existed.
   - No touch event handlers (e.g., `onTouchStart`) were present as an alternative.

2. **iOS Safari Inline Playback (1.2)**: The `<video>` elements were missing the `playsInline` attribute. iOS Safari requires this attribute (or the older `webkit-playsinline` attribute) to allow videos to play inline within the page layout rather than forcing fullscreen mode.
   - Without `playsInline`, iOS Safari defaults to fullscreen-only playback.
   - This is a well-documented iOS Safari-specific requirement.

3. **Unhandled Promise Rejection (1.3)**: The `HTMLMediaElement.play()` method returns a `Promise` that resolves when playback begins or rejects if playback is interrupted (e.g., by a subsequent `pause()` call before playback starts). The original code did not attach a `.catch()` handler to this promise.
   - Rapid mouse movement causes `play()` to be called immediately followed by `pause()`.
   - The `pause()` call interrupts the pending `play()` promise, causing a `DOMException` with name `AbortError`.
   - Without a `.catch()` handler, this rejection becomes an uncaught error in the console.

4. **Title Hidden on Hover (1.4)**: The original `ProjectCard` CSS used `opacity: 0` on the overlay content during the hover/active state, which hid both the title and description completely while the video played.
   - The overlay content element was set to `opacity: 0` on `:hover`, removing all text visibility.
   - No alternative positioning (e.g., sliding to the bottom) was implemented to keep the title readable.

## Correctness Properties

Property 1: Bug Condition - Touch Device Viewport-Based Playback

_For any_ interaction where a touch or mobile device user scrolls and a Presentation or ProjectCard video enters the viewport at an intersection ratio of 0.5 or greater, the fixed code SHALL automatically play the video via IntersectionObserver, and SHALL automatically pause the video when it leaves the viewport at an intersection ratio below 0.2.

**Validates: Requirements 2.1**

Property 2: Bug Condition - iOS Safari Inline Playback

_For any_ video element rendered in the Presentation or ProjectCard component, the fixed code SHALL include the `playsInline` attribute, ensuring inline playback on iOS Safari without forced fullscreen or blocked playback.

**Validates: Requirements 2.2**

Property 3: Bug Condition - Graceful Play Promise Rejection Handling

_For any_ interaction where `.play()` is called and subsequently interrupted by `.pause()` before the play promise resolves, the fixed code SHALL handle the promise rejection gracefully using `.catch()`, preventing uncaught DOMException errors from appearing in the browser console.

**Validates: Requirements 2.3**

Property 4: Bug Condition - Project Title Visibility During Hover

_For any_ hover or active state on a ProjectCard containing a video, the fixed code SHALL keep the project title and description visible by sliding the content to the bottom of the card with a gradient scrim for contrast, rather than hiding it completely with opacity 0.

**Validates: Requirements 2.4**

Property 5: Preservation - Desktop Mouse Hover Behavior

_For any_ input where the user is on a desktop device with a mouse and hovers over a Presentation or ProjectCard video, the fixed code SHALL produce the same play-on-enter and pause-on-leave behavior as the original code, preserving desktop mouse interaction.

**Validates: Requirements 3.1**

Property 6: Preservation - Non-Video Card Display

_For any_ ProjectCard that has no videoUrl, the fixed code SHALL display only the static image with the title and description overlay without rendering a video element or attempting to play a video, preserving the non-video card display.

**Validates: Requirements 3.2**

Property 7: Preservation - Click Navigation and Analytics

_For any_ click on a ProjectCard link, the fixed code SHALL navigate to the project URL and track the click event via `trackEvent("Project", "click", title)`, preserving click navigation and analytics behavior.

**Validates: Requirements 3.3**

Property 8: Preservation - Presentation Click Toggle

_For any_ click on the Presentation video on a desktop device, the fixed code SHALL toggle between play and pause states, preserving the click-to-toggle interaction.

**Validates: Requirements 3.4**

Property 9: Preservation - Video Configuration Attributes

_For any_ video that is loaded in the Presentation or ProjectCard component, the fixed code SHALL display the poster image, loop the video, and play it muted as configured by the existing attributes, preserving video configuration.

**Validates: Requirements 3.5**

## Fix Implementation

### Changes Required

The following changes have been applied to the codebase to resolve all four bug conditions. Each change is documented below for traceability and to support verification.

**File**: `src/components/Presentation.tsx`

**Function**: `Presentation` component (including `playVideo`, `pauseVideo`, `handleMouseEnter`, `handleMouseLeave`, `handleTogglePlay`, and the `useEffect` hook)

**Specific Changes**:

1. **Touch Device Viewport Playback (resolves 1.1)**: Added a `useEffect` hook that creates an `IntersectionObserver` observing the container element. When `isTouchOrMobile()` returns true, the observer calls `video.play()` when `entry.isIntersecting && entry.intersectionRatio >= 0.5` and calls `video.pause()` when `!entry.isIntersecting || entry.intersectionRatio < 0.2`. The observer uses `threshold: [0.2, 0.5]` for hysteresis. The effect cleans up by calling `observer.disconnect()` on unmount.
   - The `isTouchOrMobile()` helper uses `window.matchMedia("(hover: none), (max-width: 768px)")` to detect touch-only or small-screen devices.
   - A guard `if (typeof IntersectionObserver === "undefined") return` provides a safe fallback for environments without IntersectionObserver support.

2. **iOS Safari Inline Playback (resolves 1.2)**: Added the `playsInline` attribute to the `<video>` element in the JSX.

3. **Graceful Promise Handling (resolves 1.3)**: The `playVideo()` function wraps `videoRef.current.play()` in a check for `playPromise !== undefined` and attaches a `.catch(() => {})` handler. The IntersectionObserver callback also wraps its `video.play()` call with a `.catch(() => {})` handler.
   - The `.catch()` handler silently swallows the `DOMException` (AbortError) that occurs when `pause()` interrupts a pending `play()`.

4. **Desktop Hover Preservation (preserves 3.1, 3.4)**: The `handleMouseEnter`, `handleMouseLeave`, and `handleTogglePlay` handlers remain unchanged, ensuring desktop mouse hover play/pause and click-to-toggle behavior are preserved.

**File**: `src/components/ProjectCard.tsx`

**Function**: `ProjectCard` component (including `playVideo`, `pauseVideo`, `handleMouseEnter`, `handleMouseLeave`, and the `useEffect` hook)

**Specific Changes**:

1. **Touch Device Viewport Playback (resolves 1.1)**: Added a `useEffect` hook (with `isVideo` in the dependency array) that creates an `IntersectionObserver` observing the card element. When `isTouchOrMobile()` returns true, the observer calls `video.play()` when intersecting at >=0.5 and calls `video.pause()` when leaving at <0.2. The `setIsPlaying(true)` / `setIsPlaying(false)` state updates are synchronized with playback to drive the CSS `data-playing` attribute.
   - The effect returns early (`if (!isVideo) return`) when the card has no video URL, preserving non-video card behavior.
   - The `isPlaying` state drives a `data-playing` attribute on the article element, enabling CSS to apply the active style for both mouse hover and IntersectionObserver-driven playback.

2. **iOS Safari Inline Playback (resolves 1.2)**: Added the `playsInline` attribute to the `<video>` element in the JSX.

3. **Graceful Promise Handling (resolves 1.3)**: The `playVideo()` function wraps `videoRef.current.play()` in a `playPromise !== undefined` check with `.catch(() => {})`. The IntersectionObserver callback also wraps its `video.play()` call with `.catch(() => {})`.

4. **Desktop Hover Preservation (preserves 3.1)**: The `handleMouseEnter` and `handleMouseLeave` handlers remain unchanged, calling `playVideo()`/`pauseVideo()` and updating `setIsPlaying`.

5. **Non-Video Card Preservation (preserves 3.2)**: The `isVideo` guard (`Boolean(videoUrl)`) controls whether the video element is rendered and whether the IntersectionObserver effect runs. Cards without `videoUrl` render only the image and overlay.

**File**: `src/components/ProjectCard.module.css`

**Function**: CSS rules for `.projectCardOverlay`, `.projectCardOverlay::after`, and `.projectCardContent`

**Specific Changes**:

1. **Title Visibility on Hover (resolves 1.4)**: Replaced the `opacity: 0` hide behavior with a slide-to-bottom animation. The `.projectCardContent` element transitions from `top: 50%; transform: translateY(-50%)` (centered) to `top: 100%; transform: translateY(-100%)` (bottom-aligned) on `:hover`, `:focus-visible`, `:focus-within`, and `[data-playing="true"]` states.
   - The content uses `transition: top 0.35s cubic-bezier(0.25, 1, 0.5, 1), transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)` for smooth animation.

2. **Gradient Scrim for Contrast**: Added a `.projectCardOverlay::after` pseudo-element with a `linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.5) 35%, transparent 70%)` that fades in (`opacity: 0` to `opacity: 1`) during the active state, providing high contrast behind the text content when it slides to the bottom.

3. **Active State Selectors**: The active state is triggered by four selector groups: `.projectCard:hover`, `.projectCardLink:focus-visible`, `.projectCardLink:focus-within`, and `.projectCard[data-playing="true"]`. The `data-playing` selector ensures the visual state is consistent for both mouse hover and IntersectionObserver-driven playback on touch devices.

**File**: `src/components/Presentation.module.css`

No changes were required beyond the component-level fixes. The Presentation component does not have a title overlay to preserve.

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate each bug on unfixed code (or confirm the bug is already resolved on the current code), then verify the fix works correctly and preserves existing behavior. Since the fixes are already applied to the codebase, the primary goal is verification that the current implementation satisfies all correctness properties and that no regressions exist.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate each bug condition. Since the fixes are already in place, this phase confirms whether the current code resolves each bug condition. If any test fails, it indicates the fix is incomplete and the root cause hypothesis needs revisiting.

**Test Plan**: Write tests that simulate each bug condition and assert the expected correct behavior. Run these tests on the current (fixed) code to confirm they pass.

**Test Cases**:
1. **Touch Device Presentation Test**: Simulate `IntersectionObserver` entry with `intersectionRatio: 0.6` on a touch device (`matchMedia` returns `matches: true`) and assert `video.play()` is called. Then simulate exit with `intersectionRatio: 0.1` and assert `video.pause()` is called. (Already implemented in `Presentation.test.tsx`)
2. **Touch Device ProjectCard Test**: Same as above for ProjectCard with a `videoUrl`. (Already implemented in `ProjectCard.test.tsx`)
3. **iOS Safari playsInline Test**: Assert the `<video>` element has the `playsinline` attribute in both Presentation and ProjectCard. (Already implemented in both test files)
4. **Promise Rejection Test**: Mock `play()` to reject with `DOMException` AbortError and assert no uncaught exception is thrown on mouse enter. (Already implemented in both test files)
5. **Title Visibility Test**: Assert that the ProjectCard content element does not use `opacity: 0` in the active state CSS. This requires inspecting computed styles or verifying the CSS module rules. (Not yet covered - remaining work)

**Expected Counterexamples**:
- If the IntersectionObserver is not properly guarded for environments without support, tests may fail in non-browser environments.
- If the `data-playing` attribute is not synchronized with the `isPlaying` state, the CSS active state for touch-device playback may not trigger.

### Fix Checking

**Goal**: Verify that for all inputs where each bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := fixedFunction(input)
  ASSERT expectedBehavior(result)
END FOR
```

**Verification Status**:
- Bug 1.1 (Touch playback): Verified by existing IntersectionObserver tests in both `Presentation.test.tsx` and `ProjectCard.test.tsx`.
- Bug 1.2 (playsInline): Verified by attribute assertion tests in both test files.
- Bug 1.3 (Promise rejection): Verified by promise rejection tests in both test files.
- Bug 1.4 (Title visibility): Requires additional CSS verification - remaining work needed.

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT originalFunction(input) = fixedFunction(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on the current (fixed) code for desktop mouse interactions, non-video cards, click navigation, and video configuration, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Desktop Mouse Hover Preservation**: Verify `onMouseEnter` plays and `onMouseLeave` pauses on both Presentation and ProjectCard. (Already implemented in both test files)
2. **Click Toggle Preservation**: Verify clicking the Presentation video toggles play/pause. (Already implemented in `Presentation.test.tsx`)
3. **Non-Video Card Preservation**: Verify ProjectCard without `videoUrl` renders only image and overlay, no video element. (Partially implemented - rendering tests exist, but no explicit "no video element" assertion for non-video cards)
4. **Click Navigation and Analytics Preservation**: Verify clicking a ProjectCard calls `trackEvent` with correct arguments. (Already implemented in `ProjectCard.test.tsx`)
5. **Video Configuration Preservation**: Verify `poster`, `loop`, `muted` attributes are present. (Partially implemented - `playsInline`, `loop`, `muted` checked in Presentation test; `poster` and `playsinline` checked in ProjectCard test)

### Unit Tests

- Test keyboard event handling for each UI context (not applicable - these components use mouse and touch interactions, not keyboard number shortcuts)
- Test edge cases: IntersectionObserver unavailable, video element not present, rapid play/pause sequences
- Test that mouse clicks continue to work (Presentation toggle, ProjectCard analytics)
- Test that non-video ProjectCards render without video elements
- Test the `data-playing` attribute synchronization between React state and CSS

**Remaining Unit Test Work**:
- Add an explicit test asserting that a ProjectCard without `videoUrl` does NOT render a `<video>` element
- Add a test for the `data-playing` attribute toggling to `"true"` and `"false"` during IntersectionObserver-driven playback
- Add a test verifying the Presentation `poster` attribute value matches the expected Cloudinary URL

### Property-Based Tests

- Generate random intersection ratios (0.0 to 1.0) and verify play is called only when ratio >= 0.5 on touch devices, pause when ratio < 0.2
- Generate random ProjectCard configurations (with and without videoUrl) and verify non-video cards never call `play()` or render a video element
- Generate random play/pause sequences (rapid hover/leave cycles) and verify no uncaught exceptions occur
- Generate random device types (desktop vs touch) and verify the correct activation mechanism is used for each

**Remaining Property-Based Test Work**:
- No property-based tests currently exist in the test suite. The existing tests are example-based. Adding property-based tests with a library like `fast-check` would strengthen preservation guarantees.

### Integration Tests

- Test full page flow with keyboard shortcuts in each context (not applicable to this bugfix)
- Test full scroll flow on a simulated mobile device with multiple ProjectCards entering and leaving the viewport
- Test switching between Presentation video and ProjectCard videos in a single page
- Test that visual feedback (content slide, gradient scrim) occurs when videos play via IntersectionObserver on touch devices
- Test that the build passes (`npm run build`) and lint passes (`npm run lint`) with all changes

**Remaining Integration Test Work**:
- No integration tests exist that verify the full page flow with multiple ProjectCards on a simulated mobile viewport. This would require a more comprehensive test setup or end-to-end testing.
