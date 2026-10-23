import { useSEO } from "../hooks/useSEO";
import styles from "./AboutPage.module.css";

const AboutPage = () => {
  useSEO({
    title: "Sobre mi — Àlex Sabalete | Director, Editor & DOP",
    description:
      "Sobre Àlex Sabalete — Director, Editor i Director de Fotografia (DOP). Passió per explicar històries a través del rodatge, el muntatge i la llum.",
  });

  return (
    <main className={styles.aboutPage}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarImages}>
          <img
            src="https://res.cloudinary.com/dnclrisd7/image/upload/v1782419405/730570102_1006243568702507_7690870770292074438_n_znmxji.jpg"
            alt="About me image"
          />
        </div>
      </aside>
      <section className={styles.mainContent}>
        <h1>Jo</h1>
        <p>
          Entusiasta de l’audivisual amb ganes de treballar amb tot allò que
          implica contar històries dirigint, rodant i editant vídeos. Pura
          velocitat, sensibilitat visual i la il·lusió de fer una bona feina.
        </p>
        <p>
          Estic per pujar-me a totes les aventures possibles i per aprendre
          creixent dels errors, de les victòries, dels artistes, de la moda,
          dels companys que m’han rodejat i sobretot, de la llum.
        </p>

        <p>
          Sempre que pugui, m’embrutaré les mans. Mentre els valors, la visió i
          l'economia caminin junts, dic que sí i a fer que les coses passin.
          Amor pel treball, honestitat i sempre intentant fer-ho bé.
        </p>
      </section>
    </main>
  );
};

export default AboutPage;
