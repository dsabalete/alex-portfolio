const About = ({
  onBackClick,
}: {
  onBackClick: (e: React.MouseEvent) => void;
}) => {
  return (
    <main className="main-content">
      <section className="hero-section">
        <h1>About Me</h1>
        <p>
          I'm a passionate developer and designer crafting digital experiences
          that combine creativity with functionality.
        </p>
        <p>
          With a focus on clean code and user-centered design, I love building
          things that make a difference.
        </p>
        <button className="close-hero" onClick={onBackClick}>
          Back
        </button>
      </section>
    </main>
  );
};

export default About;
