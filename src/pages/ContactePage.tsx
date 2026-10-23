import { useNavigate } from "react-router-dom";
import { useSEO, generateSEOOptions } from "../hooks/useSEO";
import { generateAllSchemas } from "../lib/structuredData";
import styles from "./ContactePage.module.css";

const ContactePage = () => {
  const navigate = useNavigate();
  // Generate SEO options for the /contacte route
  const seoOptions = generateSEOOptions("/contacte", undefined, undefined, undefined);

  useSEO({
    title: seoOptions.title,
    description: seoOptions.description,
    ogImage: seoOptions.ogImage,
    canonicalPath: seoOptions.canonicalPath,
  });

  // Generate JSON-LD for /contacte route (Person + Website + ContactPage schema)
  const { mainScript, fallback } = generateAllSchemas("/contacte");

  return (
    <section className={styles.heroOverlay}>
      <div className={styles.heroContent}>
        <h1>ÀLEX SABALETE</h1>
        <h2>Director · Editor · DOP</h2>
        <div className={styles.contactLinks}>
          <a
            href="https://www.instagram.com/alexsabalete/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram d'Alex Sabalete"
            title="Instagram"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
              className={styles.icon}
            >
              <path
                d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm11.25 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
                fill="currentColor"
              />
            </svg>
            @alexsabalete
          </a>
          <div className={styles.emailCopyGroup}>
            <a
              href={`mailto:a.sabalete.p@gmail.com`}
              aria-label="Enviar correu a Alex Sabalete"
              title="Correu"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
                className={styles.icon}
              >
                <path
                  d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm0 2v.5l8 5.2 8-5.2V8l-8 5.2L4 8z"
                  fill="currentColor"
                />
              </svg>
              {`a.sabalete.p@gmail.com`}
            </a>
            <button
              type="button"
              className={styles.copyButton}
              onClick={() => {
                navigator.clipboard.writeText("a.sabalete.p@gmail.com");
                alert("Copiat!");
              }}
              aria-label="Copiar correu al porta-papers"
              title="Copiar correu"
            >
              Copiar
            </button>
          </div>
        </div>
        <button className={styles.closeHero} onClick={() => navigate("/")}>
          tancar
        </button>
      </div>

      {/* SEO JSON-LD for Contact page */}
      {mainScript}
      {fallback}
    </section>
  );
};

export default ContactePage;