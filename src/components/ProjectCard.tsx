export interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

import styles from "./ProjectCard.module.css";
import { trackEvent } from "../lib/analytics";

const ProjectCard = ({
  title,
  description,
  imageUrl,
  link,
}: ProjectCardProps) => {
  const target = link.startsWith("http") ? "_blank" : "_self";
  const rel = target === "_blank" ? "noopener noreferrer" : undefined;
  return (
    <div className={styles.projectCard}>
      <img src={imageUrl} alt={title} className={styles.projectCardImage} />
      <div className={styles.projectCardOverlay}>
        <h3>{title}</h3>
        <p>{description}</p>
        <a
          href={link}
          target={target}
          rel={rel}
          onClick={() => trackEvent("Project", "click", title)}
        >
          Veure el projecte
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
