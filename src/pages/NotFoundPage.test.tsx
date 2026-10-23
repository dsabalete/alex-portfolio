import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("NotFoundPage", () => {
  it("should render 404 heading and title", () => {
    renderWithRouter(<NotFoundPage />);

    expect(screen.getByRole("heading", { level: 1, name: "404" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Pàgina no trobada" })).toBeInTheDocument();
  });

  it("should render explanation message", () => {
    renderWithRouter(<NotFoundPage />);

    expect(
      screen.getByText(/La pàgina que cerques no existeix o ha estat moguda\./i),
    ).toBeInTheDocument();
  });

  it("should render link to home", () => {
    renderWithRouter(<NotFoundPage />);

    const link = screen.getByRole("link", { name: "Tornar a l'inici" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });
});
