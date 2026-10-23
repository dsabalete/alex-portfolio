import styles from "./Presentation.module.css";
import { useRef, useEffect } from "react";

const Presentation = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  const playVideo = () => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Play was interrupted by pause() or blocked by browser policy
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
    playVideo();
  };

  const handleMouseLeave = () => {
    pauseVideo();
  };

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        playVideo();
      } else {
        pauseVideo();
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;
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
            } else if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
              video.pause();
            }
          }
        });
      },
      {
        threshold: [0.2, 0.5],
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className={styles.presentation}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTogglePlay}
      aria-label="Presentació"
    >
      <div className={styles.container}>
        <div className={styles.videoWrapper}>
          <video
            ref={videoRef}
            className={styles.video}
            poster="https://res.cloudinary.com/dnclrisd7/video/upload/so_0,w_1200,h_630,c_fill,q_auto,f_jpg/v1782407137/portadaportfolio_edi1pf.jpg"
            preload="metadata"
            loop
            muted
            playsInline
          >
            <source
              src="https://res.cloudinary.com/dnclrisd7/video/upload/v1782407137/portadaportfolio_edi1pf.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
};

export default Presentation;
