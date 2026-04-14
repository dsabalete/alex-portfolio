export interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

const ProjectCard = ({
  title,
  description,
  imageUrl,
  link,
}: ProjectCardProps) => {
  const target = link.startsWith("http") ? "_blank" : "_self";
  const rel = target === "_blank" ? "noopener noreferrer" : undefined;
  return (
    <div className="project-card">
      <img src={imageUrl} alt={title} className="project-card-image" />
      <div className="project-card-overlay">
        <h3>{title}</h3>
        <p>{description}</p>
        <a href={link} target={target} rel={rel}>
          Veure el projecte
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
