import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";
import ProjectCard from "./ProjectCard";

const mockEvent = vi.fn();

vi.mock("../lib/analytics", () => ({
  trackEvent: (...args: unknown[]) => mockEvent(...args),
}));

const mockProject = {
  title: "Test Project",
  description: "This is a test project description",
  imageUrl: "/test-image.jpg",
  link: "https://example.com/project",
};

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("ProjectCard", () => {
  beforeEach(() => {
    mockEvent.mockClear();
    vi.restoreAllMocks();
  });

  it("should render project with correct image and content", () => {
    renderWithRouter(<ProjectCard {...mockProject} />);

    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test project description"),
    ).toBeInTheDocument();
  });

  it("should render project image with alt text", () => {
    renderWithRouter(<ProjectCard {...mockProject} />);

    const image = screen.getByAltText("Test Project");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/test-image.jpg");
  });

  // Validates: Requirements 3.2 (Property 6: Preservation - Non-Video Card Display)
  it("should not render a video element when no videoUrl is provided", () => {
    renderWithRouter(<ProjectCard {...mockProject} />);

    // Existing rendering tests render non-video cards but do not explicitly
    // assert the absence of a video element. This confirms cards without a
    // videoUrl do not render or attempt to play a video.
    const video = document.querySelector("video");
    expect(video).not.toBeInTheDocument();
  });

  it("should link to external project correctly", () => {
    renderWithRouter(<ProjectCard {...mockProject} />);

    const link = screen.getByText("Test Project").closest("a");
    expect(link).toHaveAttribute("href", mockProject.link);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should track event on card click", () => {
    renderWithRouter(<ProjectCard {...mockProject} />);

    const cardElement = screen.getByText("Test Project");
    fireEvent.click(cardElement);

    expect(mockEvent).toHaveBeenCalledWith(
      "Project",
      "click",
      "Test Project",
    );
  });

  it("should render video element with playsInline when videoUrl is provided and trigger play/pause on hover", () => {
    const playMock = vi.fn().mockResolvedValue(undefined);
    const pauseMock = vi.fn();
    window.HTMLMediaElement.prototype.play = playMock;
    window.HTMLMediaElement.prototype.pause = pauseMock;

    const projectWithVideo = {
      ...mockProject,
      videoUrl: "/test-video.mp4",
    };

    renderWithRouter(<ProjectCard {...projectWithVideo} />);

    const link = screen.getByText("Test Project").closest("a");
    expect(link).toBeInTheDocument();

    const video = document.querySelector("video");
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute("poster", "/test-image.jpg");
    expect(video).toHaveAttribute("playsinline");

    if (link) {
      fireEvent.mouseEnter(link);
      expect(playMock).toHaveBeenCalled();

      fireEvent.mouseLeave(link);
      expect(pauseMock).toHaveBeenCalled();
    }
  });

  it("should handle play promise rejection without throwing uncaught errors", async () => {
    const playMock = vi.fn().mockRejectedValue(new DOMException("Aborted", "AbortError"));
    const pauseMock = vi.fn();
    window.HTMLMediaElement.prototype.play = playMock;
    window.HTMLMediaElement.prototype.pause = pauseMock;

    const projectWithVideo = {
      ...mockProject,
      videoUrl: "/test-video.mp4",
    };

    renderWithRouter(<ProjectCard {...projectWithVideo} />);

    const link = screen.getByText("Test Project").closest("a");
    expect(link).toBeInTheDocument();

    if (link) {
      expect(() => fireEvent.mouseEnter(link)).not.toThrow();
      expect(playMock).toHaveBeenCalled();
    }
  });

  it("should play and pause video via IntersectionObserver on mobile devices", () => {
    let observerCallback: (entries: IntersectionObserverEntry[]) => void = () => {};
    const observeMock = vi.fn();
    const disconnectMock = vi.fn();

    class MockIntersectionObserver {
      constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
        observerCallback = callback;
      }
      observe = observeMock;
      disconnect = disconnectMock;
      unobserve = vi.fn();
    }

    window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes("hover: none") || query.includes("max-width: 768px"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const playMock = vi.fn().mockResolvedValue(undefined);
    const pauseMock = vi.fn();
    window.HTMLMediaElement.prototype.play = playMock;
    window.HTMLMediaElement.prototype.pause = pauseMock;

    renderWithRouter(
      <ProjectCard {...mockProject} videoUrl="/test-video.mp4" />
    );

    expect(observeMock).toHaveBeenCalled();

    // Entering viewport
    act(() => {
      observerCallback([
        {
          isIntersecting: true,
          intersectionRatio: 0.6,
        } as unknown as IntersectionObserverEntry,
      ]);
    });

    expect(playMock).toHaveBeenCalled();

    // Leaving viewport
    act(() => {
      observerCallback([
        {
          isIntersecting: false,
          intersectionRatio: 0.1,
        } as unknown as IntersectionObserverEntry,
      ]);
    });

    expect(pauseMock).toHaveBeenCalled();
  });

  it("should toggle the data-playing attribute during IntersectionObserver playback on touch devices", () => {
    let observerCallback: (entries: IntersectionObserverEntry[]) => void =
      () => {};
    const observeMock = vi.fn();
    const disconnectMock = vi.fn();

    class MockIntersectionObserver {
      constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
        observerCallback = callback;
      }
      observe = observeMock;
      disconnect = disconnectMock;
      unobserve = vi.fn();
    }

    window.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;

    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches:
        query.includes("hover: none") || query.includes("max-width: 768px"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const playMock = vi.fn().mockResolvedValue(undefined);
    const pauseMock = vi.fn();
    window.HTMLMediaElement.prototype.play = playMock;
    window.HTMLMediaElement.prototype.pause = pauseMock;

    renderWithRouter(
      <ProjectCard {...mockProject} videoUrl="/test-video.mp4" />,
    );

    const article = document.querySelector("article");
    expect(article).toBeInTheDocument();

    // Initially not playing
    expect(article).toHaveAttribute("data-playing", "false");

    // Entering viewport at intersection ratio >= 0.5
    act(() => {
      observerCallback([
        {
          isIntersecting: true,
          intersectionRatio: 0.6,
        } as unknown as IntersectionObserverEntry,
      ]);
    });

    expect(article).toHaveAttribute("data-playing", "true");

    // Leaving viewport at intersection ratio < 0.2
    act(() => {
      observerCallback([
        {
          isIntersecting: false,
          intersectionRatio: 0.1,
        } as unknown as IntersectionObserverEntry,
      ]);
    });

    expect(article).toHaveAttribute("data-playing", "false");
  });
});

describe("ProjectCard CSS - Bug Condition: Title Visibility During Hover (Property 4)", () => {
  // jsdom does not compute CSS module styles, so read the source CSS directly
  // to verify the fixed overlay behavior.
  const cssPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "./ProjectCard.module.css",
  );
  const cssContent = fs.readFileSync(cssPath, "utf-8");

  // Validates: Requirements 2.4
  it("should slide projectCardContent to the bottom on active state instead of hiding with opacity: 0", () => {
    // Locate the active-state declaration block for .projectCardContent
    // (hover / focus-visible / focus-within / data-playing selectors).
    const contentActiveMatch = cssContent.match(
      /\.projectCard:hover \.projectCardContent[\s\S]*?\{([^}]*)\}/,
    );
    expect(contentActiveMatch).not.toBeNull();

    const contentActiveBody = contentActiveMatch?.[1] ?? "";
    // Fixed code slides content to the bottom using top + transform
    expect(contentActiveBody).toContain("top: 100%");
    expect(contentActiveBody).toContain("transform: translateY(-100%)");
    // Pre-fix code hid content with opacity: 0 — must not be present
    expect(contentActiveBody).not.toContain("opacity: 0");
  });

  // Validates: Requirements 2.4
  it("should fade in the gradient scrim (.projectCardOverlay::after) during the active state", () => {
    const overlayAfterActiveMatch = cssContent.match(
      /\.projectCard:hover \.projectCardOverlay::after[\s\S]*?\{([^}]*)\}/,
    );
    expect(overlayAfterActiveMatch).not.toBeNull();

    const overlayAfterActiveBody = overlayAfterActiveMatch?.[1] ?? "";
    // Gradient scrim fades in to full opacity during active state
    expect(overlayAfterActiveBody).toContain("opacity: 1");
  });

  // Validates: Requirements 2.4
  it("should declare top and transform transitions on projectCardContent, not opacity", () => {
    const contentBaseMatch = cssContent.match(
      /\.projectCardContent\s*\{([^}]*)\}/,
    );
    expect(contentBaseMatch).not.toBeNull();

    const contentBaseBody = contentBaseMatch?.[1] ?? "";
    expect(contentBaseBody).toContain("top");
    expect(contentBaseBody).toContain("transform");
    // Transition must not be driven by opacity
    expect(contentBaseBody).not.toMatch(/transition:[^;]*opacity/);
  });
});
