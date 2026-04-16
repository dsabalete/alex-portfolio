import { NavLink } from "react-router-dom";
import styles from "./PageHeader.module.css";

const PageHeader = () => {
  return (
    <header>
      <nav aria-label="Principal">
        <div className={styles.navContainer}>
          <div className={styles.navLinks}>
            <NavLink to="/" end>
              Alex Sabalete
            </NavLink>
            <NavLink to="/about">Sobre mi</NavLink>
            <NavLink to="/contacte">Contacte</NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default PageHeader;
