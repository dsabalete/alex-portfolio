const PageFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div>© {currentYear} Alex Sabalete. Tots els drets reservats.</div>
    </footer>
  );
};

export default PageFooter;
