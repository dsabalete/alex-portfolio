import { useEffect } from "react";

/**
 * SEO options that can be passed to the useSEO hook.
 * All fields are optional; defaults will be used when not specified.
 */
export interface SEOOptions {
  title?: string;
  description?: string;
  ogImage?: string; // Open Graph image per route
  canonicalPath?: string; // Path to append to site URL for canonical/og:url
  noindex?: boolean; // Whether to add noindex robots directive
}

/**
 * Default SEO configuration shared across all routes.
 * These values are preserved from the static index.html and used as fallbacks.
 */
export const DEFAULT_SEO = {
  title: "Àlex Sabalete — Director, Editor & DOP Portfolio",
  description:
    "Portfolio d'Àlex Sabalete — Director, Editor & DOP. Direcció, muntatge i cinematografia en videoclips, peces narratives i projectes audiovisuals.",
  ogImage:
    "https://res.cloudinary.com/dnclrisd7/video/upload/so_0,w_1200,h_630,c_fill,q_auto,f_jpg/v1782407137/portadaportfolio_edi1pf.jpg",
  ogWidth: 1200,
  ogHeight: 630,
};

/**
 * Generates SEO options for a given route, combining route-specific values
 * with defaults. Used by page components to compute what to pass to useSEO.
 *
 * @param route The route path ("/", "/about", "/contacte", "not-found")
 * @param customTitle Optional custom title override
 * @param customDescription Optional custom description override
 * @param ogImageOverride Optional override for the Open Graph image (e.g., about page profile photo)
 * @param noindex Whether to add noindex robots directive (for 404 pages)
 * @returns SEO options object with title, description, ogImage, canonicalPath, and noindex flag
 */
export function generateSEOOptions(
  route: "/" | "/about" | "/contacte" | "not-found",
  customTitle?: string,
  customDescription?: string,
  ogImageOverride?: string | null,
  noindex?: boolean,
): {
  title: string;
  description: string;
  ogImage: string;
  canonicalPath: string;
  noindex: boolean;
} {
  // Determine OG image per route
  let ogImage: string;
  if (ogImageOverride) {
    ogImage = ogImageOverride;
  } else if (route === "/about") {
    // About page uses the profile photo
    ogImage =
      "https://res.cloudinary.com/dnclrisd7/image/upload/v1782419405/730570102_1006243568702507_7690870770292074438_n_znmxji.jpg";
  } else {
    // Default: the reel poster
    ogImage = DEFAULT_SEO.ogImage;
  }

  // Determine canonical path per route
  let canonicalPath: string;
  if (route === "/") {
    canonicalPath = "";
  } else if (route === "/about") {
    canonicalPath = "/about";
  } else if (route === "/contacte") {
    canonicalPath = "/contacte";
  } else {
    canonicalPath = "/not-found";
  }

  return {
    title: customTitle || DEFAULT_SEO.title,
    description:
      customDescription ||
      DEFAULT_SEO.description ||
      "Portfolio d'Àlex Sabalete — Director, Editor & DOP",
    ogImage,
    canonicalPath,
    noindex: noindex || route === "not-found", // auto-set noindex for 404 routes
  };
}

/**
 * React hook that updates document head metadata dynamically per route.
 * Manages:
 * - document.title
 * - meta[name="description"]
 * - meta[property="og:title"]
 * - meta[property="og:description"]
 * - meta[name="twitter:title"]
 * - meta[name="twitter:description"]
 * - meta[property="og:image"] and meta[name="twitter:image"]
 * - meta[property="og:image:width"] and meta[property="og:image:height"]
 * - <link rel="canonical"> (only if VITE_SITE_URL is set)
 * - meta[property="og:url"] (only if VITE_SITE_URL is set)
 * - <meta name="robots" content="noindex"> (for 404 or specific pages)
 *
 * Preserves static tags from index.html: og:type, og:site_name, og:locale,
 * og:locale:alternate, twitter:card.
 *
 * @param options Partial SEO options; defaults are filled from DEFAULT_SEO
 * and route-specific generation.
 */
export function useSEO(options: SEOOptions = {}) {
  const {
    title,
    description,
    ogImage,
    canonicalPath,
    noindex,
  } = options;

  useEffect(() => {
    // Determine site URL from environment variable
    const siteUrl =
      typeof window !== "undefined" ? import.meta.env.VITE_SITE_URL : undefined;
    const baseSiteUrl = siteUrl || "";

    // --- Title & document.title ---
    const activeTitle = title || DEFAULT_SEO.title;
    document.title = activeTitle;

    // --- Helper to set or update a meta tag ---
    const setMetaContent = (
      selector: string,
      content: string,
      attrName?: string,
      attrVal?: string,
    ) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el && attrName && attrVal) {
        el = document.createElement("meta");
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      if (el) {
        el.setAttribute("content", content);
      }
    };

    // 1. Meta description
    setMetaContent('meta[name="description"]', description ?? "", "name", "description");

    // 2. og:title
    setMetaContent('meta[property="og:title"]', activeTitle, "property", "og:title");

    // 3. og:description
    setMetaContent(
      "meta[property='og:description']",
      description ?? "",
      "property",
      "og:description"
    );

    // 4. twitter:title
    setMetaContent('meta[name="twitter:title"]', activeTitle, "name", "twitter:title");

    // 5. twitter:description
    setMetaContent(
      "meta[name='twitter:description']",
      description ?? "",
      "name",
      "twitter:description"
    );

    // 6. og:image
    setMetaContent('meta[property="og:image"]', ogImage || "", "property", "og:image");

    // 7. twitter:image (same as og:image)
    setMetaContent('meta[name="twitter:image"]', ogImage || "", "name", "twitter:image");

    // 8. og:image:width and og:image:height
    setMetaContent('meta[property="og:image:width"]', String(1200), "property", "og:image:width");
    setMetaContent('meta[property="og:image:height"]', String(630), "property", "og:image:height");

    // 9. Canonical URL - only if VITE_SITE_URL is configured
    if (baseSiteUrl && canonicalPath) {
      const canonicalUrl = baseSiteUrl + canonicalPath;
      let canonEl = document.querySelector('link[rel="canonical"]');
      if (!canonEl) {
        canonEl = document.createElement("link");
        canonEl.setAttribute("rel", "canonical");
        document.head.appendChild(canonEl);
      }
      canonEl.setAttribute("href", canonicalUrl);
    }

    // 10. og:url - only if VITE_SITE_URL is configured
    if (baseSiteUrl && canonicalPath) {
      const url = baseSiteUrl + canonicalPath;
      setMetaContent('meta[property="og:url"]', url, "property", "og:url");
    }

    // 11. noindex directive
    if (noindex) {
      let robotsEl = document.querySelector('meta[name="robots"]');
      if (!robotsEl) {
        robotsEl = document.createElement("meta");
        robotsEl.setAttribute("name", "robots");
        document.head.appendChild(robotsEl);
      }
      robotsEl.setAttribute("content", "noindex");
    } else {
      // Remove noindex when leaving the 404 page so other pages remain indexable
      const existing = document.querySelector('meta[name="robots"]');
      if (existing) {
        existing.remove();
      }
    }

    // 12. Preserve static tags from index.html (og:type, og:site_name, etc.)
    // The hook does not touch these; they remain as defined in index.html.

  }, [title, description, ogImage, canonicalPath, noindex]);
}