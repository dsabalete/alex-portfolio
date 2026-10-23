import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Presentation from "./Presentation";
import ProjectCard, { type ProjectCardProps } from "./ProjectCard";

vi.mock("../lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

const mockProjects: ProjectCardProps[] = [
  {
    id: "1",
    title: "Video Project 1",
    description: "Description 1",
    imageUrl: "https://example.com/img1.jpg",
    videoUrl: "https://example.com/video1.mp4",
    link: "https://example.com/1",
  },
  {
    id: "2",
    title: "Static Project 2",
    description: "Description 2",
    imageUrl: "https://example.com/img2.jpg",
    link: "https://example.com/2",
  },
  {
    id: "3",
    title: "Video Project 3",
    description: "Description 3",
    imageUrl: "https://example.com/img3.jpg",
    videoUrl: "https://example.com/video3.mp4",
    link: "https://example.com/3",
  },
];

describe("Mobile Scroll Flow Integration Tests", () => {
  let observerCallbacks: Map<Element, (entries: IntersectionObserverEntry[]) => void>;
  let observedElements: Element[];

  beforeEach(() => {
    vi.restoreAllMocks();
    cleanup();

    observerCallbacks = new Map();
    observedElements = [];

    class MockIntersectionObserver {
      private callback: (entries: IntersectionObserverEntry[]) => void;

      constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
        this.callback = callback;
      }

      observe(element: Element) {
        observedElements.push(element);
        observerCallbacks.set(element, this.callback);
      }

      unobserve = vi.fn();
      disconnect = vi.fn();
    }

    window.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;

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
  });

  // Feature: mobile-video-interaction-fix
  // Requirement 2.1, 2.4, 3.2
  it("Mobile Scroll Flow Test: handles scrolling past multiple mixed ProjectCards on touch devices", () => {
    const playMock = vi.fn().mockResolvedValue(undefined);
    const pauseMock = vi.fn();
    window.HTMLMediaElement.prototype.play = playMock;
    window.HTMLMediaElement.prototype.pause = pauseMock;

    render(
      <BrowserRouter>
        <div>
          {mockProjects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </BrowserRouter>
    );

    const articles = document.querySelectorAll("article");
    expect(articles).toHaveLength(3);

    // Verify non-video card (index 1) does not render a video tag
    expect(articles[0].querySelector("video")).not.toBeNull();
    expect(articles[1].querySelector("video")).toBeNull();
    expect(articles[2].querySelector("video")).not.toBeNull();

    // Verify initial data-playing attribute state
    expect(articles[0]).toHaveAttribute("data-playing", "false");
    expect(articles[1]).toHaveAttribute("data-playing", "false");
    expect(articles[2]).toHaveAttribute("data-playing", "false");

    // Simulate scrolling: Video Project 1 enters viewport
    const elem1 = articles[0];
    const callback1 = observerCallbacks.get(elem1);
    expect(callback1).toBeDefined();

    act(() => {
      callback1?.([
        {
          target: elem1,
          isIntersecting: true,
          intersectionRatio: 0.7,
        } as unknown as IntersectionObserverEntry,
      ]);
    });

    expect(playMock).toHaveBeenCalledTimes(1);
    expect(elem1).toHaveAttribute("data-playing", "true");

    // Scroll further: Video Project 1 leaves, Static Project 2 enters
    act(() => {
      callback1?.([
        {
          target: elem1,
          isIntersecting: false,
          intersectionRatio: 0.1,
        } as unknown as IntersectionObserverEntry,
      ]);
    });

    expect(pauseMock).toHaveBeenCalledTimes(1);
    expect(elem1).toHaveAttribute("data-playing", "false");

    // Scroll further: Video Project 3 enters
    const elem3 = articles[2];
    const callback3 = observerCallbacks.get(elem3);
    expect(callback3).toBeDefined();

    act(() => {
      callback3?.([
        {
          target: elem3,
          isIntersecting: true,
          intersectionRatio: 0.8,
        } as unknown as IntersectionObserverEntry,
      ]);
    });

    expect(playMock).toHaveBeenCalledTimes(2);
    expect(elem3).toHaveAttribute("data-playing", "true");
  });

  // Feature: mobile-video-interaction-fix
  // Requirement 2.1, 2.3
  it("Rapid Scroll Test: handles rapid scrolling past multiple cards with rejecting play promises without errors", () => {
    const playMock = vi
      .fn()
      .mockRejectedValue(
        new DOMException("The play() request was interrupted by a call to pause().", "AbortError")
      );
    const pauseMock = vi.fn();
    window.HTMLMediaElement.prototype.play = playMock;
    window.HTMLMediaElement.prototype.pause = pauseMock;

    render(
      <BrowserRouter>
        <div>
          {mockProjects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </BrowserRouter>
    );

    const articles = document.querySelectorAll("article");

    // Rapidly trigger enter and exit on all cards
    expect(() => {
      articles.forEach((article) => {
        const callback = observerCallbacks.get(article);
        if (callback) {
          act(() => {
            callback([
              {
                target: article,
                isIntersecting: true,
                intersectionRatio: 0.6,
              } as unknown as IntersectionObserverEntry,
            ]);
            callback([
              {
                target: article,
                isIntersecting: false,
                intersectionRatio: 0.1,
              } as unknown as IntersectionObserverEntry,
            ]);
          });
        }
      });
    }).not.toThrow();
  });

  // Feature: mobile-video-interaction-fix
  // Requirement 2.1
  it("Mixed Component Test: Presentation and ProjectCards play/pause independently on scroll", () => {
    const playMock = vi.fn().mockResolvedValue(undefined);
    const pauseMock = vi.fn();
    window.HTMLMediaElement.prototype.play = playMock;
    window.HTMLMediaElement.prototype.pause = pauseMock;

    render(
      <BrowserRouter>
        <main>
          <Presentation />
          <div>
            {mockProjects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        </main>
      </BrowserRouter>
    );

    const presentationSection = document.querySelector("section");
    const projectArticles = document.querySelectorAll("article");

    expect(presentationSection).not.toBeNull();
    expect(projectArticles).toHaveLength(3);

    // Observe Presentation entry
    if (presentationSection) {
      const presCallback = observerCallbacks.get(presentationSection);
      expect(presCallback).toBeDefined();

      act(() => {
        presCallback?.([
          {
            target: presentationSection,
            isIntersecting: true,
            intersectionRatio: 0.6,
          } as unknown as IntersectionObserverEntry,
        ]);
      });

      expect(playMock).toHaveBeenCalledTimes(1);

      act(() => {
        presCallback?.([
          {
            target: presentationSection,
            isIntersecting: false,
            intersectionRatio: 0.1,
          } as unknown as IntersectionObserverEntry,
        ]);
      });

      expect(pauseMock).toHaveBeenCalledTimes(1);
    }

    // Observe ProjectCard entry independently
    const card1 = projectArticles[0];
    const card1Callback = observerCallbacks.get(card1);
    expect(card1Callback).toBeDefined();

    act(() => {
      card1Callback?.([
        {
          target: card1,
          isIntersecting: true,
          intersectionRatio: 0.6,
        } as unknown as IntersectionObserverEntry,
      ]);
    });

    expect(playMock).toHaveBeenCalledTimes(2);
    expect(card1).toHaveAttribute("data-playing", "true");
  });

  // Feature: mobile-video-interaction-fix
  // Requirement 2.4
  it("Visual Feedback Test: setting data-playing='true' drives visual active state", () => {
    const playMock = vi.fn().mockResolvedValue(undefined);
    window.HTMLMediaElement.prototype.play = playMock;

    render(
      <BrowserRouter>
        <ProjectCard {...mockProjects[0]} />
      </BrowserRouter>
    );

    const article = screen.getByRole("article");
    expect(article).toHaveAttribute("data-playing", "false");

    const callback = observerCallbacks.get(article);
    expect(callback).toBeDefined();

    act(() => {
      callback?.([
        {
          target: article,
          isIntersecting: true,
          intersectionRatio: 0.6,
        } as unknown as IntersectionObserverEntry,
      ]);
    });

    // data-playing="true" activates CSS selectors .projectCard[data-playing="true"] .projectCardContent
    expect(article).toHaveAttribute("data-playing", "true");
  });
});
