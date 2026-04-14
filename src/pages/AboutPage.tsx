import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <main
      className="main-content"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <section className="hero-section">
        <h1>Sobre mi</h1>
        <p>Soc jo.</p>
        <button className="close-hero" onClick={handleBack}>
          Enrere
        </button>
      </section>
    </main>
  );
};

export default AboutPage;
