import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
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

    window.IntersectionObserver = vi.fn().mockImplementation((callback) => {
      observerCallback = callback;
      return {
        observe: observeMock,
        disconnect: disconnectMock,
        unobserve: vi.fn(),
      };
    });

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
    observerCallback([
      {
        isIntersecting: true,
        intersectionRatio: 0.6,
      } as unknown as IntersectionObserverEntry,
    ]);

    expect(playMock).toHaveBeenCalled();

    // Leaving viewport
    observerCallback([
      {
        isIntersecting: false,
        intersectionRatio: 0.1,
      } as unknown as IntersectionObserverEntry,
    ]);

    expect(pauseMock).toHaveBeenCalled();
  });
});