interface HeroSectionProps {
  onEnter: () => void;
}

const HeroSection = ({ onEnter }: HeroSectionProps) => {
  return (
    <section className="hero-overlay">
      <div className="hero-content">
        <h1>ALEX SABALETE</h1>
        <h2>Director · Editor · DOP</h2>
        <p>Creant històries visuals atractives que captiven l'audiència.</p>
        <p>
          <a href="mailto:a.sabalete.p@gmail.com">a.sabalete.p@gmail.com</a>
        </p>
        <button className="close-hero" onClick={onEnter}>
          tancar
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
