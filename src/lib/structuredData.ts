import projectsData from "../data/projects.json";

/**
 * Types for Schema.org JSON-LD generation from Project_Data.
 */

export interface ProjectSchema {
  "@type": "CreativeWork";
  name: string;
  description: string;
  image: string;
  url: string;
  creator: {
    "@type": "Person";
    name: string;
  };
}

export interface PersonSchema {
  "@type": "Person";
  name: string;
  givenName?: string;
  familyName?: string;
  jobTitle?: string[];
  description: string;
  image: string;
  email: string;
  sameAs?: string[];
  knowsAbout?: string[];
}

export interface WebsiteSchema {
  "@type": "WebSite";
  name: string;
  description: string;
  author: {
    "@id": string;
  };
  publisher: {
    "@id": string;
  };
  image: string;
}

export interface ItemListSchema {
  "@type": "ItemList";
  name: string;
  itemListElement: ListItemSchema[];
}

export interface ListItemSchema {
  "@type": "ListItem";
  position: number;
  item: ProjectSchema;
  url: string;
}

/**
 * Generates the Person schema used on every route.
 * Based on Àlex Sabalete's profile data.
 */
export function generatePersonSchema(): PersonSchema {
  return {
    "@type": "Person",
    name: "Àlex Sabalete",
    givenName: "Àlex",
    familyName: "Sabalete",
    jobTitle: ["Director", "Editor", "Director of Photography", "DOP"],
    description:
      "Entusiasta de l'audiovisual amb ganes de treballar amb tot allò que implica contar històries dirigint, rodant i editant vídeos.",
    image:
      "https://res.cloudinary.com/dnclrisd7/image/upload/v1782419405/730570102_1006243568702507_7690870770292074438_n_znmxji.jpg",
    email: "a.sabalete.p@gmail.com",
    sameAs: ["https://www.instagram.com/alexsabalete/"],
    knowsAbout: [
      "Film Direction",
      "Video Editing",
      "Cinematography",
      "Music Videos",
      "Audiovisual Production",
    ],
  };
}

/**
 * Generates the Website schema used on every route.
 */
export function generateWebsiteSchema(siteName: string = "Àlex Sabalete Portfolio"): WebsiteSchema {
  const personId = "#alex-sabalete";
  return {
    "@type": "WebSite",
    name: siteName,
    description: "Portfolio professional d'Àlex Sabalete — Director, Editor & DOP.",
    author: {
      "@id": personId,
    },
    publisher: {
      "@id": personId,
    },
    image:
      "https://res.cloudinary.com/dnclrisd7/video/upload/so_0,w_1200,h_630,c_fill,q_auto,f_jpg/v1782407137/portadaportfolio_edi1pf.jpg",
  };
}

/**
 * Generates the ItemList schema for the Home page, derived from Project_Data.
 */
export function generateItemListSchema(): ItemListSchema {
  const items = projectsData.map(
    (project, index): ListItemSchema => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: project.title,
        description: project.description || "",
        image: project.imageUrl,
        url: project.link,
        creator: {
          "@type": "Person",
          name: "Àlex Sabalete",
        },
      },
      url: project.link,
    })
  );

  return {
    "@type": "ItemList",
    name: "Projectes Destacats",
    itemListElement: items,
  };
}

/**
 * Generates the AboutPage/ProfilePage schema for the /about route.
 */
export function generateAboutPageSchema() {
  const person = generatePersonSchema();
  return {
    "@type": "ProfilePage",
    person,
  };
}

/**
 * Generates the ContactPage schema for the /contacte route.
 */
export function generateContactPageSchema() {
  const person = generatePersonSchema();
  return {
    "@type": "ContactPage",
    person,
    contactPoint: {
      "@type": "ContactPoint",
      email: "a.sabalete.p@gmail.com",
      contactType: "email",
    },
  };
}

/**
 * Generates the NotFoundPage schema - only Person and Website, no project data.
 */
export function generateNotFoundPageSchema() {
  const person = generatePersonSchema();
  const website = generateWebsiteSchema();
  return {
    "@type": "ItemList",
    name: "Portfolio",
    itemListElement: [],
    person,
    website,
  };
}

/**
 * Main generator: returns all JSON-LD script content for a given route.
 * Returns an object with mainScript and fallback script content strings.
 *
 * The mainScript includes Person + Website + route-specific ItemList (or About/Contact/NotFound).
 * The fallback includes the route-specific supplementary schema (ItemList for home,
 * AboutPage for /about, ContactPage for /contacte, empty for not-found).
 */
export function generateAllSchemas(
  route: "/" | "/about" | "/contacte" | "not-found"
) {
  const person = generatePersonSchema();
  const website = generateWebsiteSchema();

  let itemListContent = "";
  let aboutContent = "";
  let contactContent = "";
  let notFoundContent = "";

  switch (route) {
    case "/":
      itemListContent = JSON.stringify(generateItemListSchema(), null, 2);
      break;

    case "/about":
      aboutContent = JSON.stringify(generateAboutPageSchema(), null, 2);
      break;

    case "/contacte":
      contactContent = JSON.stringify(generateContactPageSchema(), null, 2);
      break;

    case "not-found":
      notFoundContent = JSON.stringify(generateNotFoundPageSchema(), null, 2);
      break;
  }

  // Build the main @graph script - includes person + website + (route-specific) item
  const mainGraph =
    route === "/"
      ? [person, website, { "@type": "ItemList", itemListElement: [] }]
      : route === "/about"
      ? [person, website, { "@type": "ProfilePage" }]
      : route === "/contacte"
      ? [person, website, { "@type": "ContactPage" }]
      : [person, website];

  const mainScript = `<script type="application/ld+json">${JSON.stringify(
    { "@graph": mainGraph },
    null,
    2
  )}</script>`;

  // Return main script + the route-specific supplementary schema content
  return {
    mainScript,
    fallback:
      route === "/"
        ? `<script type="application/ld+json">${itemListContent}</script>`
        : route === "/about"
        ? `<script type="application/ld+json">${aboutContent}</script>`
        : route === "/contacte"
        ? `<script type="application/ld+json">${contactContent}</script>`
        : route === "not-found"
        ? `<script type="application/ld+json">${notFoundContent}</script>`
        : "",
  };
}