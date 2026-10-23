import Presentation from "../components/Presentation";
import ProjectCard, { type ProjectCardProps } from "../components/ProjectCard";
import projectsData from "../data/projects.json";
import { useSEO, generateSEOOptions } from "../hooks/useSEO";
import { generateAllSchemas } from "../lib/structuredData";
import styles from "./HomePage.module.css";

const projects: ProjectCardProps[] = projectsData;

const HomePage = () => {
  // Generate SEO options for the home route
  const seoOptions = generateSEOOptions("/", undefined, undefined, undefined);

  // Generate JSON-LD schema objects for the home page
  const schemas = generateAllSchemas("/");

  useSEO({
    title: seoOptions.title,
    description: seoOptions.description,
    ogImage: seoOptions.ogImage,
    canonicalPath: seoOptions.canonicalPath,
    jsonLd: schemas,
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
