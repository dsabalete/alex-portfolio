import { useEffect } from "react";

export interface SEOOptions {
  title?: string;
  description?: string;
}

export const DEFAULT_SEO = {
  title: "Àlex Sabalete — Director, Editor & DOP Portfolio",
  description:
    "Portfolio d'Àlex Sabalete — Director, Editor & DOP. Direcció, muntatge i cinematografia en videoclips, peces narratives i projectes audiovisuals.",
};

export function useSEO({ title, description }: SEOOptions = {}) {
  useEffect(() => {
    const activeTitle = title ? title : DEFAULT_SEO.title;
    const activeDesc = description ? description : DEFAULT_SEO.description;

    document.title = activeTitle;

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

    setMetaContent('meta[name="description"]', activeDesc, "name", "description");
    setMetaContent('meta[property="og:title"]', activeTitle, "property", "og:title");
    setMetaContent('meta[property="og:description"]', activeDesc, "property", "og:description");
    setMetaContent('meta[name="twitter:title"]', activeTitle, "name", "twitter:title");
    setMetaContent('meta[name="twitter:description"]', activeDesc, "name", "twitter:description");
  }, [title, description]);
}
