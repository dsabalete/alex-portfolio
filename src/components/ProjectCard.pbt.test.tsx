import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import fc from "fast-check";
import ProjectCard from "./ProjectCard";

vi.mock("../lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("ProjectCard Property-Based Tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  // Feature: mobile-video-interaction-fix
  // Property 2: Non-Video Card Never Plays Video or Renders Video Tag
  it("Property 2: cards without videoUrl never render video element or trigger play", () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 1 }),
          description: fc.string(),
          imageUrl: fc.webUrl(),
          link: fc.webUrl(),
          hasVideoUrl: fc.constant(false),
        }),
        (cardProps) => {
          const playMock = vi.fn().mockResolvedValue(undefined);
          window.HTMLMediaElement.prototype.play = playMock;

          const { container, unmount } = renderWithRouter(
            <ProjectCard
              title={cardProps.title}
              description={cardProps.description}
              imageUrl={cardProps.imageUrl}
              link={cardProps.link}
              videoUrl={cardProps.hasVideoUrl ? "https://example.com/video.mp4" : undefined}
            />
          );

          const video = container.querySelector("video");
          expect(video).toBeNull();

          const linkEl = container.querySelector("a");
          if (linkEl) {
            linkEl.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
            linkEl.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
          }

          expect(playMock).not.toHaveBeenCalled();

          unmount();
          cleanup();
        }
      ),
      { numRuns: 30 }
    );
  });

  // Feature: mobile-video-interaction-fix
  // Property 1 & 2: Cards with videoUrl render video tag and respond to interaction
  it("Property 2 (Video variant): cards with videoUrl always render video element", () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 1 }),
          description: fc.string(),
          imageUrl: fc.webUrl(),
          videoUrl: fc.webUrl(),
          link: fc.webUrl(),
        }),
        (cardProps) => {
          const { container, unmount } = renderWithRouter(
            <ProjectCard
              title={cardProps.title}
              description={cardProps.description}
              imageUrl={cardProps.imageUrl}
              link={cardProps.link}
              videoUrl={cardProps.videoUrl}
            />
          );

          const video = container.querySelector("video");
          expect(video).not.toBeNull();
          expect(video).toHaveAttribute("playsinline");

          unmount();
          cleanup();
        }
      ),
      { numRuns: 30 }
    );
  });

  // Feature: mobile-video-interaction-fix
  // Property 3: Rapid Play/Pause No Uncaught Errors
  it("Property 3: handles random sequences of rapid play/pause without uncaught errors on video cards", () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom("enter", "leave"), { minLength: 1, maxLength: 20 }),
        (actionSequence) => {
          const playMock = vi
            .fn()
            .mockRejectedValue(
              new DOMException("The play() request was interrupted by a call to pause().", "AbortError")
            );
          const pauseMock = vi.fn();
          window.HTMLMediaElement.prototype.play = playMock;
          window.HTMLMediaElement.prototype.pause = pauseMock;

          const { container, unmount } = renderWithRouter(
            <ProjectCard
              title="Test Project"
              description="Test Description"
              imageUrl="https://example.com/image.jpg"
              link="https://example.com"
              videoUrl="https://example.com/video.mp4"
            />
          );

          const linkEl = container.querySelector("a");
          expect(linkEl).not.toBeNull();

          if (linkEl) {
            expect(() => {
              actionSequence.forEach((action) => {
                if (action === "enter") {
                  linkEl.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
                } else if (action === "leave") {
                  linkEl.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
                }
              });
            }).not.toThrow();
          }

          unmount();
          cleanup();
        }
      ),
      { numRuns: 30 }
    );
  });
});
