import styles from "./Presentation.module.css";
import { useRef } from "react";

const Presentation = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <section
      className={styles.presentation}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.container}>
        <div className={styles.videoWrapper}>
          <video
            ref={videoRef}
            className={styles.video}
            preload="metadata"
            loop
            muted
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
