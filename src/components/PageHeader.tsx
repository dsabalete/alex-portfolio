import { Link } from "react-router-dom";

const PageHeader = () => {
  return (
    <nav>
      <div className="nav-container">
        <div className="nav-links">
          <Link to="/">Alex Sabalete</Link>
          {/* <a href="#projectes">Projectes</a> */}
          <Link to="/about">Sobre mi</Link>
          <Link to="/contacte">Contacte</Link>
        </div>
      </div>
    </nav>
  );
};

export default PageHeader;
