import { Link } from "react-router-dom";
import styles from "./PageHeader.module.css";

const PageHeader = () => {
  return (
    <header>
      <nav aria-label="Principal">
        <div className={styles.navContainer}>
          <div className={styles.navLinks}>
            <Link to="/" aria-current="page">
              Alex Sabalete
            </Link>
            <Link to="/about">Sobre mi</Link>
            <Link to="/contacte">Contacte</Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default PageHeader;
