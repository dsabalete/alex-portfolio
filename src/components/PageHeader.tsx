const PageHeader = ({ onContactClick }: { onContactClick: (e: React.MouseEvent) => void }) => {
  return (
    <nav>
      <div className="nav-container">
        <div className="nav-links">
          <a href="/">Alex Sabalete</a>
          <a href="#inici">Inici</a>
          <a href="#projectes">Projectes</a>
          <a href="#contacte" onClick={onContactClick}>Contacte</a>
        </div>
      </div>
    </nav>
  );
};

export default PageHeader;
