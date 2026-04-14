const PageFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div>© {currentYear} Alex Portfolio. All rights reserved.</div>
    </footer>
  );
};

export default PageFooter;
