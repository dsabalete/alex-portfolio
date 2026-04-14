import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ContactePage.module.css";

const MailIcon = () => (
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
);

const InstagramIcon = () => (
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
);

const ContactePage = () => {
  const navigate = useNavigate();
  const email = "a.sabalete.p@gmail.com";
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copyEmailToClipboard = async () => {
    if (window.isSecureContext && navigator.clipboard) {
      await navigator.clipboard.writeText(email);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = email;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);

    if (!success) {
      throw new Error("Copy failed");
    }
  };

  const showNotification = (message: string) => {
    setCopyMessage(message);

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setCopyMessage(null);
    }, 2000);
  };

  const handleEmailClick = async (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();

    try {
      await copyEmailToClipboard();
      showNotification("Correu copiat al porta-papers");
    } catch {
      showNotification("No s'ha pogut copiar el correu");
    }
  };

  return (
    <section className={styles.heroOverlay}>
      <div className={styles.heroContent}>
        <h1>ALEX SABALETE</h1>
        <h2>Director · Editor · DOP</h2>
        <p>Creant històries visualment atractives que captiven l'audiència.</p>
        <div className={styles.contactLinks}>
          <a
            href="https://www.instagram.com/alexsabalete/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram d'Alex Sabalete"
            title="Instagram"
          >
            <InstagramIcon />
            @alexsabalete
          </a>
          <div className={styles.emailCopyGroup}>
            <a
              href={`mailto:${email}`}
              aria-label="Enviar correu a Alex Sabalete"
              title="Correu"
              onClick={handleEmailClick}
            >
              <MailIcon />
              {email}
            </a>
            {copyMessage && (
              <p
                className={styles.copyNotification}
                role="status"
                aria-live="polite"
              >
                {copyMessage}
              </p>
            )}
          </div>
        </div>
        <button className={styles.closeHero} onClick={() => navigate("/")}>
          tancar
        </button>
      </div>
    </section>
  );
};

export default ContactePage;
