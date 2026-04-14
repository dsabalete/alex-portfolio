import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <main className="about-page">
      <div className="hero-section">
        <h1>Sobre mi</h1>
        <p>Soc jo.</p>
        <button className="close-hero" onClick={handleBack}>
          Enrere
        </button>
      </div>
    </main>
  );
};

export default AboutPage;
