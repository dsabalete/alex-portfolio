import ProjectCard, { type ProjectCardProps } from "../components/ProjectCard";
import projectsData from "../data/projects.json";

const projects: ProjectCardProps[] = projectsData;

const HomePage = () => {
  return (
    <main className="main-content">
      {projects.map((project, index) => (
        <ProjectCard key={index} {...project} />
      ))}
    </main>
  );
};

export default HomePage;
