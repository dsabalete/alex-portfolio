import { Link } from "react-router-dom";
import styles from "./PageHeader.module.css";

const PageHeader = () => {
  return (
    <nav>
      <div className={styles.navContainer}>
        <div className={styles.navLinks}>
          <Link to="/">Alex Sabalete</Link>
          <Link to="/about">Sobre mi</Link>
          <Link to="/contacte">Contacte</Link>
        </div>
      </div>
    </nav>
  );
};

export default PageHeader;
