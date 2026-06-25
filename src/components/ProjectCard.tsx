export interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

import styles from "./ProjectCard.module.css";
import { trackEvent } from "../lib/analytics";
import { useRef } from "react";

const ProjectCard = ({
  title,
  description,
  imageUrl,
  videoUrl,
  link,
}: ProjectCardProps & { videoUrl?: string }) => {
  const target = link.startsWith("http") ? "_blank" : "_self";
  const rel = target === "_blank" ? "noopener noreferrer" : undefined;
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = Boolean(videoUrl);
  
  const handleMouseEnter = () => {
    if (videoRef.current && isVideo) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };
  
  return (
    <a
      href={link}
      target={target}
      rel={rel}
      onClick={() => trackEvent("Project", "click", title)}
      className={styles.projectCardLink}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <article className={styles.projectCard}>
        <img
          src={imageUrl}
          alt={title}
          className={styles.projectCardImage}
          loading="lazy"
        />
        {isVideo && (
          <video
            ref={videoRef}
            className={styles.projectCardVideo}
            poster={imageUrl}
            preload="metadata"
            loop
            muted
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        <div className={styles.projectCardOverlay}>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </article>
    </a>
  );
};

export default ProjectCard;
