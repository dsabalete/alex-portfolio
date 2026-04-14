const PageHeader = ({
  onContactClick,
}: {
  onContactClick: (e: React.MouseEvent) => void;
}) => {
  return (
    <nav>
      <div className="nav-container">
        <div className="nav-links">
          <a href="#inici">Alex Sabalete</a>
          {/* <a href="#projectes">Projectes</a> */}
          <a
            href="https://tercerespai.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tercer Espai
          </a>
          <a href="#contacte" onClick={onContactClick}>
            Contacte
          </a>
        </div>
      </div>
    </nav>
  );
};

export default PageHeader;
