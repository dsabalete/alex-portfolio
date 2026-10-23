# Spec Delta

## Purpose

Defines video playback behavior for Presentation and ProjectCard components on touch devices, including viewport-based autoplay, iOS Safari inline playback, graceful promise rejection handling, and overlay visibility during active states.

## ADDED Requirements

### Requirement: Touch device viewport-based playback

WHEN the user is on a touch device and a Presentation or ProjectCard video enters or leaves the viewport THEN the system SHALL play or pause the video automatically using viewport detection (IntersectionObserver).

#### Scenario: Video plays on viewport entry
- **WHEN** a touch device user scrolls and a Presentation or ProjectCard video enters the viewport at an intersection ratio of 0.5 or greater
- **THEN** the system SHALL automatically play the video via IntersectionObserver

#### Scenario: Video pauses on viewport exit
- **WHEN** a touch device user scrolls and a Presentation or ProjectCard video leaves the viewport at an intersection ratio below 0.2
- **THEN** the system SHALL automatically pause the video via IntersectionObserver

#### Scenario: No action in hysteresis zone
- **WHEN** a touch device user scrolls and a Presentation or ProjectCard video is at an intersection ratio between 0.2 (inclusive) and 0.5 (exclusive)
- **THEN** the system SHALL leave the video in its current playing state (no play or pause call)

### Requirement: iOS Safari inline playback

WHEN a `<video>` element is rendered THEN the system SHALL include the `playsInline` attribute to ensure inline playback on iOS Safari without forced fullscreen or blocked playback.

#### Scenario: playsInline attribute present
- **WHEN** a Presentation or ProjectCard component renders a `<video>` element
- **THEN** the `<video>` element SHALL have the `playsInline` attribute

### Requirement: Graceful play promise rejection handling

WHEN `.play()` is called and subsequently interrupted by `.pause()` before the play promise resolves THEN the system SHALL handle the promise rejection gracefully using `.catch()` to prevent uncaught DOMException errors in the console.

#### Scenario: Rapid play/pause does not throw
- **WHEN** the user moves the cursor quickly, triggering `.play()` followed by `.pause()` before the play promise resolves
- **THEN** the system SHALL silently catch the resulting DOMException (AbortError) without logging an uncaught error

#### Scenario: Rapid scroll past multiple cards
- **WHEN** a mobile user scrolls rapidly past multiple ProjectCards, causing each card's IntersectionObserver to fire play() then pause() in quick succession
- **THEN** all promise rejections SHALL be caught without console errors

### Requirement: Project title visibility during hover

WHEN the user hovers over a ProjectCard that contains a video THEN the system SHALL keep the project title visible by moving the content elegantly to the bottom of the card with a gradient scrim, rather than hiding it completely with opacity 0.

#### Scenario: Content slides to bottom with scrim
- **WHEN** a user hovers over a ProjectCard that contains a video
- **THEN** the overlay content SHALL slide to the bottom of the card and a gradient scrim SHALL fade in behind the text

#### Scenario: Title remains readable
- **WHEN** a ProjectCard with a video is in an active state (hover, focus, or `data-playing="true"`)
- **THEN** the project title and description SHALL remain visible

### Requirement: Desktop mouse hover preservation

WHEN the user hovers over a video on a desktop device with a mouse THEN the system SHALL CONTINUE TO play the video on mouse enter and pause on mouse leave.

#### Scenario: Mouse enter plays video
- **WHEN** a desktop user hovers the mouse over a Presentation or ProjectCard video
- **THEN** the system SHALL call play() on mouse enter

#### Scenario: Mouse leave pauses video
- **WHEN** a desktop user moves the mouse away from a Presentation or ProjectCard video
- **THEN** the system SHALL call pause() on mouse leave

### Requirement: Non-video card display preservation

WHEN a ProjectCard has no `videoUrl` THEN the system SHALL CONTINUE TO display only the static image with the title and description overlay without attempting to play a video.

#### Scenario: No video element rendered
- **WHEN** a ProjectCard is rendered without a `videoUrl`
- **THEN** no `<video>` element SHALL be rendered and play() SHALL never be called

#### Scenario: IntersectionObserver does not run
- **WHEN** a ProjectCard is rendered without a `videoUrl`
- **THEN** the IntersectionObserver effect SHALL return early and not observe the card

### Requirement: Click navigation and analytics preservation

WHEN the user clicks a ProjectCard link THEN the system SHALL CONTINUE TO navigate to the project URL and track the click event via analytics.

#### Scenario: Click navigates and tracks
- **WHEN** a user clicks a ProjectCard link
- **THEN** the system SHALL navigate to the project URL and call trackEvent("Project", "click", title)

### Requirement: Presentation click toggle preservation

WHEN the user clicks the Presentation video on a desktop device THEN the system SHALL CONTINUE TO toggle between play and pause states.

#### Scenario: Click toggles play/pause
- **WHEN** a desktop user clicks the Presentation video
- **THEN** the system SHALL toggle between play and pause states

### Requirement: Video configuration attributes preservation

WHEN a video is loaded THEN the system SHALL CONTINUE TO display the poster image, loop the video, and play it muted as configured by existing attributes.

#### Scenario: Poster, loop, and muted present
- **WHEN** a Presentation or ProjectCard video is loaded
- **THEN** the `<video>` element SHALL have the `poster`, `loop`, and `muted` attributes as configured