import { useEffect, useMemo, useState } from "react";
import { ProjectItem } from "@/hooks/usePortfolioData";
import { Github, ExternalLink, ArrowUpRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const ProjectCard = ({
  project,
  editable = false,
  onUpdate,
}: {
  project: ProjectItem;
  editable?: boolean;
  onUpdate?: (id: string, patch: Partial<ProjectItem>) => void;
}) => {
  const imageUrl = project.imageUrl || "/placeholder.svg";
  const [imgSrc, setImgSrc] = useState(imageUrl);
  const displayTech = useMemo(() => project.techStack.slice(0, 4), [project.techStack]);

  useEffect(() => {
    setImgSrc(imageUrl);
  }, [imageUrl]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="neon-card rounded-lg overflow-hidden flex flex-col justify-between h-full min-h-[420px] group text-left">
          <div className="relative h-44 w-full overflow-hidden border-b border-primary/10 bg-secondary/40">
            <img
              src={imgSrc}
              alt={project.name}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={() => setImgSrc("/placeholder.svg")}
            />
            {editable && (
              <div
                className="absolute right-3 top-3 rounded-md border border-primary/30 bg-background/80 px-2 py-1"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={project.featured}
                    onChange={(e) => onUpdate?.(project.id, { featured: e.target.checked })}
                  />
                  Home
                </label>
              </div>
            )}
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {project.name}
              </h3>
              <ArrowUpRight size={16} className="text-muted-foreground/30 group-hover:text-primary transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">{project.description}</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {displayTech.map((tech) => (
                <span key={tech} className="tech-chip rounded-full border border-primary/20 bg-primary/5 px-3 py-0.5 font-mono text-xs text-primary">
                  {tech}
                </span>
              ))}
              {project.techStack.length > displayTech.length && (
                <span className="text-[11px] text-muted-foreground">+{project.techStack.length - displayTech.length}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 pt-2 border-t border-primary/5 px-6 pb-5 text-xs">
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Github size={14} /> GitHub
            </span>
            {project.liveUrl && (
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <ExternalLink size={14} /> Live Demo
              </span>
            )}
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm text-primary">{project.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <img
            src={imgSrc}
            alt={project.name}
            className="h-52 w-full rounded-md object-cover"
            onError={() => setImgSrc("/placeholder.svg")}
          />
          {editable ? (
            <input
              className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-sm"
              value={project.name}
              onChange={(e) => onUpdate?.(project.id, { name: e.target.value })}
            />
          ) : (
            <h3 className="text-xl font-semibold text-foreground">{project.name}</h3>
          )}

          {editable ? (
            <textarea
              className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-sm"
              rows={2}
              value={project.description}
              onChange={(e) => onUpdate?.(project.id, { description: e.target.value })}
            />
          ) : (
            <p className="text-sm text-muted-foreground">{project.description}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span key={tech} className="tech-chip rounded-full border border-primary/20 bg-primary/5 px-3 py-0.5 font-mono text-xs text-primary">
                {tech}
              </span>
            ))}
          </div>

          {editable && (
            <input
              className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-sm"
              value={project.techStack.join(", ")}
              onChange={(e) => onUpdate?.(project.id, { techStack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
              placeholder="Tech stack (coma)"
            />
          )}

          {editable && (
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-sm"
                value={project.imageUrl ?? ""}
                onChange={(e) => onUpdate?.(project.id, { imageUrl: e.target.value })}
                placeholder="Image URL"
              />
              <input
                className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-sm"
                value={project.githubUrl}
                onChange={(e) => onUpdate?.(project.id, { githubUrl: e.target.value })}
                placeholder="GitHub URL"
              />
              <input
                className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-sm"
                value={project.liveUrl ?? ""}
                onChange={(e) => onUpdate?.(project.id, { liveUrl: e.target.value })}
                placeholder="Live URL"
              />
            </div>
          )}

          {editable ? (
            <textarea
              className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-sm"
              rows={3}
              value={project.longDescription ?? ""}
              onChange={(e) => onUpdate?.(project.id, { longDescription: e.target.value })}
              placeholder="Descripcion larga"
            />
          ) : (
            project.longDescription && (
              <p className="text-sm text-muted-foreground">{project.longDescription}</p>
            )
          )}

          {editable ? (
            <textarea
              className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-sm"
              rows={3}
              value={project.highlights.join("\n")}
              onChange={(e) => onUpdate?.(project.id, { highlights: e.target.value.split("\n").filter(Boolean) })}
              placeholder="Puntos clave (uno por linea)"
            />
          ) : (
            project.highlights.length > 0 && (
              <ul className="space-y-2">
                {project.highlights.map((h, i) => (
                  <li key={i} className="text-sm text-muted-foreground">• {h}</li>
                ))}
              </ul>
            )
          )}

          {editable && (
            <div className="flex items-center gap-3">
              <label className="text-xs text-muted-foreground">Mostrar en Home</label>
              <input type="checkbox" checked={project.featured} onChange={(e) => onUpdate?.(project.id, { featured: e.target.checked })} />
              <input
                className="w-24 rounded-md border border-primary/20 bg-secondary/50 px-3 py-2 text-sm"
                value={project.homeOrder}
                onChange={(e) => onUpdate?.(project.id, { homeOrder: Number(e.target.value) })}
                placeholder="Orden"
              />
            </div>
          )}

          <div className="flex items-center gap-4 pt-2 border-t border-primary/10">
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary">
              <Github size={15} /> GitHub
            </a>
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary">
                <ExternalLink size={15} /> Live Demo
              </a>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCard;
