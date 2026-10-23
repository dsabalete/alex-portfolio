import { useRef, useEffect, useState } from "react";
import styles from "./ProjectCard.module.css";
import { trackEvent } from "../lib/analytics";

export interface ProjectCardProps {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  link: string;
}

const ProjectCard = ({
  title,
  description,
  imageUrl,
  videoUrl,
  link,
}: ProjectCardProps) => {
  const target = link.startsWith("http") ? "_blank" : "_self";
  const rel = target === "_blank" ? "noopener noreferrer" : undefined;
  const cardRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = Boolean(videoUrl);
  const [isPlaying, setIsPlaying] = useState(false);

  const playVideo = () => {
    if (videoRef.current && isVideo) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Play request was interrupted by pause() or blocked by autoplay policies
        });
      }
    }
  };

  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleMouseEnter = () => {
    if (isVideo) {
      playVideo();
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    if (isVideo) {
      pauseVideo();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (!isVideo) return;
    const element = cardRef.current;
    const video = videoRef.current;
    if (!element || !video) return;
    if (typeof IntersectionObserver === "undefined") return;

    const isTouchOrMobile = () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none), (max-width: 768px)").matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (isTouchOrMobile()) {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
              const promise = video.play();
              if (promise !== undefined) {
                promise.catch(() => {});
              }
              setIsPlaying(true);
            } else if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
              video.pause();
              setIsPlaying(false);
            }
          }
        });
      },
      {
        threshold: [0.2, 0.5],
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isVideo]);

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
      <article
        ref={cardRef}
        className={styles.projectCard}
        data-playing={isPlaying ? "true" : "false"}
      >
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
            playsInline
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        <div className={styles.projectCardOverlay}>
          <div className={styles.projectCardContent}>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        </div>
      </article>
    </a>
  );
};

export default ProjectCard;