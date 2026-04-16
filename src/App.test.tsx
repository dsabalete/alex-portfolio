import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

describe("App", () => {
  it("applies a transition wrapper to routed content", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/about"]}>
        <App />
      </MemoryRouter>,
    );

    const transitionWrapper = container.querySelector(
      'div[class*="routeTransition"]',
    );

    expect(transitionWrapper).toBeInTheDocument();
  });

  it("keeps navigation working across routes", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Tercerespai" })).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Sobre mi" }));

    expect(screen.getByRole("heading", { name: /Hola! Soc Alex!/ })).toBeInTheDocument();
  });
});
