import { ProjectItem } from "@/hooks/usePortfolioData";
import { Github, ExternalLink, ArrowUpRight } from "lucide-react";

const ProjectCard = ({ project }: { project: ProjectItem }) => {
  return (
    <div className="neon-card rounded-lg p-6 flex flex-col justify-between h-full group">
      <div>
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {project.name}
          </h3>
          <ArrowUpRight size={16} className="text-muted-foreground/30 group-hover:text-primary transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {project.tech_stack.map((tech) => (
            <span key={tech} className="tech-chip rounded-full border border-primary/20 bg-primary/5 px-3 py-0.5 font-mono text-xs text-primary">
              {tech}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4 pt-2 border-t border-primary/5">
        <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary">
          <Github size={15} /> GitHub
        </a>
        {project.live_url && (
          <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary">
            <ExternalLink size={15} /> Live Demo
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
