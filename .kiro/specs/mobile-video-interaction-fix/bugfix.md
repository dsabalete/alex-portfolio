# Bugfix Requirements Document

## Introduction

This document addresses four interconnected defects in the mobile and video interaction experience of the portfolio website. The bugs affect video playback on touch devices, iOS Safari inline playback, unhandled promise errors during rapid interaction, and the visibility of project titles during hover states. Together these issues degrade the user experience on mobile devices and introduce console errors on desktop. The fix spans two components (Presentation and ProjectCard) and their associated CSS modules.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the user is on a touch device (mobile or tablet) and interacts with a Presentation or ProjectCard video THEN the system does not play the video because playback depends exclusively on mouse hover events (onMouseEnter and onMouseLeave) and no touch-based or viewport-based activation mechanism exists.

1.2 WHEN a `<video>` element is rendered without the `playsInline` attribute and the user is on iOS Safari THEN the system forces the video to open in fullscreen mode or blocks inline playback entirely, preventing the video from playing within the page layout.

1.3 WHEN the user moves the cursor quickly, triggering `.play()` followed by `.pause()` before the play promise resolves THEN the system throws an uncaught "Uncaught (in promise) DOMException" error in the browser console because the promise returned by `.play()` is not handled.

1.4 WHEN the user hovers over a ProjectCard that contains a video THEN the system hides the project title and description by reducing the overlay content opacity to 0, making the project name completely disappear while the video plays.

### Expected Behavior (Correct)

2.1 WHEN the user is on a touch device and a Presentation or ProjectCard video enters or leaves the viewport THEN the system SHALL play or pause the video automatically using viewport detection (IntersectionObserver) or touch controls, ensuring smooth playback without requiring a mouse cursor.

2.2 WHEN a `<video>` element is rendered THEN the system SHALL include the `playsInline` attribute to ensure inline playback on iOS Safari without forced fullscreen or blocked playback.

2.3 WHEN `.play()` is called and subsequently interrupted by `.pause()` before the play promise resolves THEN the system SHALL handle the promise rejection gracefully using `.catch()` to prevent uncaught DOMException errors in the console.

2.4 WHEN the user hovers over a ProjectCard that contains a video THEN the system SHALL keep the project title visible by either maintaining its visibility or moving the content elegantly to the bottom of the card, rather than hiding it completely with opacity 0.

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the user hovers over a video on a desktop device with a mouse THEN the system SHALL CONTINUE TO play the video on mouse enter and pause on mouse leave.

3.2 WHEN a ProjectCard has no videoUrl THEN the system SHALL CONTINUE TO display only the static image with the title and description overlay without attempting to play a video.

3.3 WHEN the user clicks a ProjectCard link THEN the system SHALL CONTINUE TO navigate to the project URL and track the click event via analytics.

3.4 WHEN the user clicks the Presentation video on a desktop device THEN the system SHALL CONTINUE TO toggle between play and pause states.

3.5 WHEN a video is loaded THEN the system SHALL CONTINUE TO display the poster image, loop the video, and play it muted as configured by existing attributes.
