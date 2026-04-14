import { useState } from "react";
import "./index.css";
import PageHeader from "./components/PageHeader";
import PageFooter from "./components/PageFooter";
import ContacteSection from "./components/ContacteSection";
import About from "./components/About";
import ProjectCard, { type ProjectCardProps } from "./components/ProjectCard";
import projectsData from "./data/projects.json";

const projects: ProjectCardProps[] = projectsData;

function App() {
  const [showContact, setShowContact] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className="app">
      <PageHeader
        onContactClick={() => setShowContact(true)}
        onAboutClick={() => setShowAbout(true)}
      />

      {showContact && <ContacteSection onEnter={() => setShowContact(false)} />}

      {showAbout && <About onBackClick={() => setShowAbout(false)} />}

      {!showAbout && (
        <main className="main-content">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </main>
      )}

      <PageFooter />
    </div>
  );
}

export default App;
