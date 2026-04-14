const PageHeader = ({
  onContactClick,
  onAboutClick,
}: {
  onContactClick: (e: React.MouseEvent) => void;
  onAboutClick: (e: React.MouseEvent) => void;
}) => {
  return (
    <nav>
      <div className="nav-container">
        <div className="nav-links">
          <a href="">Alex Sabalete</a>
          {/* <a href="#projectes">Projectes</a> */}
          <a href="#about" onClick={onAboutClick}>
            About Me
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
