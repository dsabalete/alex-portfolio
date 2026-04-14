import styles from "./PageFooter.module.css";

const PageFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div>© {currentYear} Alex Sabalete. Tots els drets reservats.</div>
    </footer>
  );
};

export default PageFooter;
