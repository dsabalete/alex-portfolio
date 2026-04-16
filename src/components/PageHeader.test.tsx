import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PageHeader from "./PageHeader";

const renderWithRouter = (
  component: React.ReactNode,
  initialEntries: string[] = ["/"],
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>,
  );
};

describe("PageHeader", () => {
  it("should render navigation links correctly", () => {
    renderWithRouter(<PageHeader />);

    expect(screen.getByText("Alex Sabalete")).toBeInTheDocument();
    expect(screen.getByText("Sobre mi")).toBeInTheDocument();
    expect(screen.getByText("Contacte")).toBeInTheDocument();
  });

  it("should have correct navigation structure", () => {
    renderWithRouter(<PageHeader />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);

    const homeLink = screen.getByText("Alex Sabalete").closest("a");
    expect(homeLink).toHaveAttribute("href", "/");

    const aboutLink = screen.getByText("Sobre mi").closest("a");
    expect(aboutLink).toHaveAttribute("href", "/about");

    const contactLink = screen.getByText("Contacte").closest("a");
    expect(contactLink).toHaveAttribute("href", "/contacte");
  });

  it("should render the header in a semantic nav element", () => {
    renderWithRouter(<PageHeader />);

    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
  });

  it("should set aria-current dynamically based on current route", () => {
    renderWithRouter(<PageHeader />, ["/about"]);

    const homeLink = screen.getByText("Alex Sabalete").closest("a");
    const aboutLink = screen.getByText("Sobre mi").closest("a");
    const contactLink = screen.getByText("Contacte").closest("a");

    expect(aboutLink).toHaveAttribute("aria-current", "page");
    expect(homeLink).not.toHaveAttribute("aria-current");
    expect(contactLink).not.toHaveAttribute("aria-current");
  });
});
