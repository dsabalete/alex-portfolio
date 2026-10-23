import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, act, cleanup } from "@testing-library/react";
import fc from "fast-check";
import Presentation from "./Presentation";

describe("Presentation Property-Based Tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  // Feature: mobile-video-interaction-fix
  // Property 1: Intersection Ratio Threshold Behavior
  it("Property 1: respects intersection ratio thresholds (play >= 0.5, pause < 0.2, hysteresis in [0.2, 0.5))", () => {
    fc.assert(
      fc.property(
        fc.record({
          intersectionRatio: fc.float({ min: 0, max: 1, noNaN: true }),
          isIntersecting: fc.boolean(),
        }),
        ({ intersectionRatio, isIntersecting }) => {
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

          const playMock = vi.fn().mockResolvedValue(undefined);
          const pauseMock = vi.fn();
          window.HTMLMediaElement.prototype.play = playMock;
          window.HTMLMediaElement.prototype.pause = pauseMock;

          const { unmount } = render(<Presentation />);

          act(() => {
            observerCallback([
              {
                isIntersecting,
                intersectionRatio,
              } as unknown as IntersectionObserverEntry,
            ]);
          });

          if (isIntersecting && intersectionRatio >= 0.5) {
            expect(playMock).toHaveBeenCalledTimes(1);
            expect(pauseMock).not.toHaveBeenCalled();
          } else if (!isIntersecting || intersectionRatio < 0.2) {
            expect(pauseMock).toHaveBeenCalledTimes(1);
            expect(playMock).not.toHaveBeenCalled();
          } else {
            // Hysteresis zone [0.2, 0.5) when intersecting: no state change
            expect(playMock).not.toHaveBeenCalled();
            expect(pauseMock).not.toHaveBeenCalled();
          }

          unmount();
          cleanup();
        }
      ),
      { numRuns: 50 }
    );
  });

  // Feature: mobile-video-interaction-fix
  // Property 3: Rapid Play/Pause No Uncaught Errors
  it("Property 3: handles random sequences of rapid play/pause without uncaught errors", () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom("enter", "leave", "click"), { minLength: 1, maxLength: 20 }),
        (actionSequence) => {
          const playMock = vi
            .fn()
            .mockRejectedValue(
              new DOMException("The play() request was interrupted by a call to pause().", "AbortError")
            );
          const pauseMock = vi.fn();
          window.HTMLMediaElement.prototype.play = playMock;
          window.HTMLMediaElement.prototype.pause = pauseMock;

          const { container, unmount } = render(<Presentation />);
          const section = container.querySelector("section");
          expect(section).not.toBeNull();

          if (section) {
            expect(() => {
              actionSequence.forEach((action) => {
                if (action === "enter") {
                  section.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
                } else if (action === "leave") {
                  section.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
                } else if (action === "click") {
                  section.dispatchEvent(new MouseEvent("click", { bubbles: true }));
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
