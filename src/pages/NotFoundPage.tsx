import { useSEO, generateSEOOptions } from "../hooks/useSEO";
import { generateNotFoundPageSchema } from "../lib/structuredData";
import styles from "./NotFoundPage.module.css";

const NotFoundPage = () => {
  // Generate SEO options for the 404 route with noindex
  const seoOptions = generateSEOOptions("not-found", undefined, undefined, undefined, true);

  useSEO({
    title: seoOptions.title,
    description: seoOptions.description,
    ogImage: seoOptions.ogImage,
    canonicalPath: seoOptions.canonicalPath,
    noindex: seoOptions.noindex,
  });

  // Generate JSON-LD for 404 route (only Person and Website, no projects)
  const schema = generateNotFoundPageSchema();

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

      {/* SEO JSON-LD for 404 page - only Person and WebSite, no project data */}
      <script type="application/ld+json">
        {JSON.stringify(schema, null, 2)}
      </script>
    </main>
  );
};

export default NotFoundPage;