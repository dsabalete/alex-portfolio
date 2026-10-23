import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

const NotFoundPage = () => {
  return (
    <main className={styles.notFoundPage}>
      <div className={styles.content}>
        <h1 className={styles.statusCode}>404</h1>
        <h2 className={styles.title}>Pàgina no trobada</h2>
        <p className={styles.description}>
          La pàgina que cerques no existeix o ha estat moguda.
        </p>
        <Link to="/" className={styles.homeLink}>
          Tornar a l'inici
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;
