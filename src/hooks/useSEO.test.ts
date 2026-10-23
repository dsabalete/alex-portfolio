import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSEO, DEFAULT_SEO } from "./useSEO";

describe("useSEO hook", () => {
  beforeEach(() => {
    document.title = "";
    document.head.innerHTML = "";
  });

  it("sets default title and description when no options provided", () => {
    renderHook(() => useSEO());

    expect(document.title).toBe(DEFAULT_SEO.title);

    const descMeta = document.querySelector('meta[name="description"]');
    expect(descMeta).toBeInTheDocument();
    expect(descMeta?.getAttribute("content")).toBe(DEFAULT_SEO.description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    expect(ogTitle?.getAttribute("content")).toBe(DEFAULT_SEO.title);

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    expect(twitterTitle?.getAttribute("content")).toBe(DEFAULT_SEO.title);
  });

  it("updates title and description to custom values", () => {
    const customTitle = "Sobre mi — Àlex Sabalete | Director, Editor & DOP";
    const customDesc = "Descripció personalitzada de prova.";

    renderHook(() =>
      useSEO({
        title: customTitle,
        description: customDesc,
      }),
    );

    expect(document.title).toBe(customTitle);

    const descMeta = document.querySelector('meta[name="description"]');
    expect(descMeta?.getAttribute("content")).toBe(customDesc);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    expect(ogTitle?.getAttribute("content")).toBe(customTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    expect(ogDesc?.getAttribute("content")).toBe(customDesc);

    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    expect(twitterDesc?.getAttribute("content")).toBe(customDesc);
  });

  it("updates existing meta tags if already present in DOM", () => {
    const existingMeta = document.createElement("meta");
    existingMeta.setAttribute("name", "description");
    existingMeta.setAttribute("content", "Old description");
    document.head.appendChild(existingMeta);

    renderHook(() =>
      useSEO({
        title: "Nou Títol",
        description: "Nova descripció",
      }),
    );

    expect(existingMeta.getAttribute("content")).toBe("Nova descripció");
  });
});
