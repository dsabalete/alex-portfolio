import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
import Presentation from "./Presentation";

describe("Presentation", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should render video element with playsInline, muted, and loop attributes", () => {
    render(<Presentation />);

    const video = document.querySelector("video");
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveAttribute("loop");
    expect(video).toHaveProperty("muted", true);
  });

  it("should trigger play on mouse enter and pause on mouse leave", () => {
    const playMock = vi.fn().mockResolvedValue(undefined);
    const pauseMock = vi.fn();
    window.HTMLMediaElement.prototype.play = playMock;
    window.HTMLMediaElement.prototype.pause = pauseMock;

    render(<Presentation />);

    const section = document.querySelector("section");
    expect(section).toBeInTheDocument();

    if (section) {
      fireEvent.mouseEnter(section);
      expect(playMock).toHaveBeenCalledTimes(1);

      fireEvent.mouseLeave(section);
      expect(pauseMock).toHaveBeenCalledTimes(1);
    }
  });

  it("should handle play promise rejection gracefully without uncaught exceptions", () => {
    const playMock = vi
      .fn()
      .mockRejectedValue(new DOMException("The play() request was interrupted", "AbortError"));
    const pauseMock = vi.fn();
    window.HTMLMediaElement.prototype.play = playMock;
    window.HTMLMediaElement.prototype.pause = pauseMock;

    render(<Presentation />);

    const section = document.querySelector("section");
    expect(section).toBeInTheDocument();

    if (section) {
      expect(() => fireEvent.mouseEnter(section)).not.toThrow();
      expect(playMock).toHaveBeenCalled();
    }
  });

  it("should toggle play and pause on click", () => {
    const playMock = vi.fn().mockResolvedValue(undefined);
    const pauseMock = vi.fn();
    window.HTMLMediaElement.prototype.play = playMock;
    window.HTMLMediaElement.prototype.pause = pauseMock;

    render(<Presentation />);

    const section = document.querySelector("section");
    expect(section).toBeInTheDocument();

    const video = document.querySelector("video");
    expect(video).toBeInTheDocument();

    if (section && video) {
      // Initially paused
      Object.defineProperty(video, "paused", { value: true, configurable: true, writable: true });
      fireEvent.click(section);
      expect(playMock).toHaveBeenCalled();

      // Now set paused to false to simulate playing state
      Object.defineProperty(video, "paused", { value: false, configurable: true, writable: true });
      fireEvent.click(section);
      expect(pauseMock).toHaveBeenCalled();
    }
  });

  it("should play and pause video via IntersectionObserver on mobile", () => {
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

    render(<Presentation />);

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
});