import Presentation from "../components/Presentation";
import ProjectCard, { type ProjectCardProps } from "../components/ProjectCard";
import projectsData from "../data/projects.json";
import styles from "./HomePage.module.css";

const projects: ProjectCardProps[] = projectsData;

const HomePage = () => {
  return (
    <main className={styles.mainContent}>
      <Presentation />
      <div className={styles.projectsContainer}>
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </main>
  );
};

export default HomePage;
