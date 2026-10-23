import Presentation from "../components/Presentation";
import ProjectCard, { type ProjectCardProps } from "../components/ProjectCard";
import projectsData from "../data/projects.json";
import { useSEO } from "../hooks/useSEO";
import styles from "./HomePage.module.css";

const projects: ProjectCardProps[] = projectsData;

const HomePage = () => {
  useSEO({
    title: "Àlex Sabalete — Director, Editor & DOP Portfolio",
    description:
      "Portfolio d'Àlex Sabalete — Director, Editor & DOP. Direcció, muntatge i cinematografia en videoclips, peces narratives i projectes audiovisuals.",
  });

  return (
    <main className={styles.mainContent}>
      <Presentation />
      <div className={styles.projectsContainer}>
        {projects.map((project) => (
          <ProjectCard key={project.id || project.title} {...project} />
        ))}
      </div>
    </main>
  );
};

export default HomePage;
