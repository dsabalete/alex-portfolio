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

    const link = screen.getByText("Veure el projecte").closest("a");
    expect(link).toHaveAttribute("href", mockProject.link);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should track event on button click", () => {
    renderWithRouter(<ProjectCard {...mockProject} />);

    const clickButton = screen.getByText("Veure el projecte");
    fireEvent.click(clickButton);

    expect(mockEvent).toHaveBeenCalledWith(
      "Project",
      "click",
      "Test Project",
    );
  });
});
