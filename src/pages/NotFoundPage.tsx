import { useSEO, generateSEOOptions } from "../hooks/useSEO";
import { generateAllSchemas } from "../lib/structuredData";
import styles from "./NotFoundPage.module.css";

const NotFoundPage = () => {
  // Generate SEO options for the 404 route with noindex
  const seoOptions = generateSEOOptions("not-found", undefined, undefined, undefined, true);

  // Generate JSON-LD schema objects for the 404 route (only Person and Website)
  const schemas = generateAllSchemas("not-found");

  useSEO({
    title: seoOptions.title,
    description: seoOptions.description,
    ogImage: seoOptions.ogImage,
    canonicalPath: seoOptions.canonicalPath,
    noindex: seoOptions.noindex,
    jsonLd: schemas,
  });

  return (
    <main className={styles.notFoundPage}>
      <div className={styles.content}>
        <h1 className={styles.statusCode}>404</h1>
        <h2 className={styles.title}>Pàgina no trobada</h2>
        <p className={styles.description}>
          La pàgina que cerques no existeix o ha estat moguda.
        </p>
        <a
          href="/"
          className={styles.homeLink}
          aria-label="Tornar a l'inici"
        >
          Tornar a l'inici
        </a>
      </div>
    </main>
  );
};

export default NotFoundPage;
