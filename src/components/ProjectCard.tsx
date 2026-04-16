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
    <a
      href={link}
      target={target}
      rel={rel}
      onClick={() => trackEvent("Project", "click", title)}
      className={styles.projectCardLink}
    >
      <article className={styles.projectCard}>
        <img 
          src={imageUrl} 
          alt={title} 
          className={styles.projectCardImage}
          loading="lazy"
        />
        <div className={styles.projectCardOverlay}>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </article>
    </a>
  );
};

export default ProjectCard;
