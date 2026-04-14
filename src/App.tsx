import { useState } from "react";
import "./index.css";
import PageHeader from "./components/PageHeader";
import PageFooter from "./components/PageFooter";
import HeroSection from "./components/HeroSection";
import ProjectCard, { type ProjectCardProps } from "./components/ProjectCard";
import projectsData from "./data/projects.json";

const projects: ProjectCardProps[] = projectsData;

function App() {
  const [showHero, setShowHero] = useState(false);

  return (
    <div className="app">
      <PageHeader onContactClick={() => setShowHero(true)} />

      {showHero && <HeroSection onEnter={() => setShowHero(false)} />}

      <main className="main-content">
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </main>

      <PageFooter />
    </div>
  );
}

export default App;
