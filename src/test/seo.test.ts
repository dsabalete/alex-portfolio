import { describe, it, expect } from "vitest";
import html from "../../index.html?raw";

describe("index.html SEO and Metadata", () => {
  it("contains lang attribute on html tag", () => {
    expect(html).toMatch(/<html lang="ca">/);
  });

  it("contains primary meta tags (title, description, author)", () => {
    expect(html).toContain(
      "<title>Àlex Sabalete — Director, Editor &amp; DOP Portfolio</title>",
    );
    expect(html).toMatch(/<meta\s+name="description"\s+content="[^"]+"/);
    expect(html).toMatch(/<meta\s+name="author"\s+content="Àlex Sabalete"/);
    expect(html).toMatch(/<meta\s+name="keywords"\s+content="[^"]+"/);
  });

  it("contains Open Graph meta tags", () => {
    expect(html).toMatch(/<meta\s+property="og:type"\s+content="website"/);
    expect(html).toMatch(/<meta\s+property="og:site_name"\s+content="[^"]+"/);
    expect(html).toMatch(/<meta\s+property="og:title"\s+content="[^"]+"/);
    expect(html).toMatch(/<meta\s+property="og:description"\s+content="[^"]+"/);
    expect(html).toMatch(
      /<meta\s+property="og:image"\s+content="https:\/\/res\.cloudinary\.com\/[^"]+\.jpg"/,
    );
    expect(html).toMatch(/<meta\s+property="og:image:width"\s+content="1200"/);
    expect(html).toMatch(/<meta\s+property="og:image:height"\s+content="630"/);
    expect(html).toMatch(/<meta\s+property="og:locale"\s+content="ca_ES"/);
  });

  it("contains Twitter Card meta tags", () => {
    expect(html).toMatch(
      /<meta\s+name="twitter:card"\s+content="summary_large_image"/,
    );
    expect(html).toMatch(/<meta\s+name="twitter:title"\s+content="[^"]+"/);
    expect(html).toMatch(
      /<meta\s+name="twitter:description"\s+content="[^"]+"/,
    );
    expect(html).toMatch(
      /<meta\s+name="twitter:image"\s+content="https:\/\/res\.cloudinary\.com\/[^"]+\.jpg"/,
    );
  });

  it("contains valid Schema.org JSON-LD structured data with Person and CreativeWork", () => {
    const jsonLdMatch = html.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
    );
    expect(jsonLdMatch).toBeTruthy();

    const jsonContent = jsonLdMatch![1];
    const data = JSON.parse(jsonContent);

    expect(data["@context"]).toBe("https://schema.org");
    expect(Array.isArray(data["@graph"])).toBe(true);

    const person = data["@graph"].find(
      (item: { "@type": string }) => item["@type"] === "Person",
    );
    expect(person).toBeDefined();
    expect(person.name).toBe("Àlex Sabalete");
    expect(person.jobTitle).toContain("Director");
    expect(person.jobTitle).toContain("Editor");
    expect(person.jobTitle).toContain("DOP");

    const website = data["@graph"].find(
      (item: { "@type": string }) => item["@type"] === "WebSite",
    );
    expect(website).toBeDefined();
    expect(website.name).toContain("Àlex Sabalete");

    const itemList = data["@graph"].find(
      (item: { "@type": string }) => item["@type"] === "ItemList",
    );
    expect(itemList).toBeDefined();
    expect(itemList.itemListElement.length).toBeGreaterThan(0);
    const creativeWork = itemList.itemListElement[0].item;
    expect(creativeWork["@type"]).toBe("CreativeWork");
    expect(creativeWork.name).toBe("OF");
  });
});
