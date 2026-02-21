import { useCallback, useEffect, useRef, useState } from "react";
import Section from "@/components/Section";
import ProjectCard from "@/components/ProjectCard";
import { useHomeGithubRepos, useProjects } from "@/hooks/usePortfolioData";
import type { ProjectItem } from "@/hooks/usePortfolioData";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useAdminView } from "@/context/AdminViewContext";
import { useAdminActions } from "@/context/AdminActionsContext";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const ProjectsSection = () => {
  const { ref, isVisible } = useScrollReveal(0.05);
  const { data: projectsData, isLoading } = useProjects();
  const { data: homeGithubRepos } = useHomeGithubRepos();
  const { user } = useAuth();
  const isAdminView = useAdminView();
  const canEdit = Boolean(isAdminView && user);
  const [items, setItems] = useState<(ProjectItem & { __isNew?: boolean })[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const itemsRef = useRef(items);
  const deletedIdsRef = useRef(deletedIds);
  const { toast } = useToast();
  const qc = useQueryClient();
  const { registerHandler } = useAdminActions();

  useEffect(() => {
    if (projectsData) setItems(projectsData);
  }, [projectsData]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    deletedIdsRef.current = deletedIds;
  }, [deletedIds]);

  const ready = !isLoading && Boolean(projectsData);

  const update = (i: number, key: string, val: any) => {
    const copy = [...items];
    (copy[i] as any)[key] = val;
    setItems(copy);
  };

  const add = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        name: "Nuevo proyecto",
        description: "Descripcion",
        techStack: ["React"],
        githubUrl: "https://github.com",
        liveUrl: null,
        imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
        githubOwner: null,
        githubRepo: null,
        sortOrder: prev.length,
        featured: false,
        homeOrder: 0,
        longDescription: "",
        highlights: [],
        __isNew: true,
      },
    ]);
  };

  const remove = (id: string) => {
    const target = items.find((item) => item.id === id);
    if (target?.__isNew) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setDeletedIds((prev) => [...prev, id]);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const save = useCallback(async () => {
    try {
      const currentItems = itemsRef.current;
      const currentDeleted = deletedIdsRef.current;
      const creates = currentItems.filter((item) => item.__isNew);
      const updates = currentItems.filter((item) => !item.__isNew);

      await Promise.all([
        ...creates.map((item, index) =>
          apiFetch("/projects", {
            method: "POST",
            body: JSON.stringify({
              name: item.name,
              description: item.description,
              techStack: item.techStack,
              githubUrl: item.githubUrl,
              liveUrl: item.liveUrl || null,
              imageUrl: item.imageUrl || null,
              sortOrder: index,
              githubOwner: item.githubOwner || null,
              githubRepo: item.githubRepo || null,
              featured: item.featured,
              homeOrder: item.homeOrder,
              longDescription: item.longDescription || null,
              highlights: item.highlights || [],
            }),
          })
        ),
        ...updates.map((item, index) =>
          apiFetch(`/projects/${item.id}`, {
            method: "PUT",
            body: JSON.stringify({
              name: item.name,
              description: item.description,
              techStack: item.techStack,
              githubUrl: item.githubUrl,
              liveUrl: item.liveUrl || null,
              imageUrl: item.imageUrl || null,
              sortOrder: index,
              githubOwner: item.githubOwner || null,
              githubRepo: item.githubRepo || null,
              featured: item.featured,
              homeOrder: item.homeOrder,
              longDescription: item.longDescription || null,
              highlights: item.highlights || [],
            }),
          })
        ),
        ...currentDeleted.map((id) => apiFetch(`/projects/${id}`, { method: "DELETE" })),
      ]);

      setDeletedIds([]);
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast({ title: "Proyectos actualizados" });
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
      throw error;
    }
  }, [qc, toast]);

  useEffect(() => {
    if (!canEdit) return;
    registerHandler("projects", save);
    return () => registerHandler("projects", null);
  }, [canEdit, registerHandler, save]);

  if (!ready) return null;

  const featured = projectsData.filter((project) => project.featured);
  const listFromDb = (featured.length > 0 ? featured : projectsData).slice().sort((a, b) => {
    if (a.homeOrder !== b.homeOrder) return a.homeOrder - b.homeOrder;
    return a.sortOrder - b.sortOrder;
  });
  const listForHome = homeGithubRepos && homeGithubRepos.length > 0 ? homeGithubRepos : listFromDb;
  const showGrid = isVisible || listForHome.length > 0;

  return (
    <Section id="projects" title="Projects">
      {!canEdit && (
        <div
          ref={ref}
          className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-children ${showGrid ? "scroll-visible" : ""}`}
        >
          {listForHome.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <a
          href={canEdit ? "/admin/projects" : "/projects"}
          className="inline-flex items-center gap-2 rounded-md border border-primary/30 px-5 py-2 text-sm text-primary hover:bg-primary/5 transition-colors"
        >
          Ver todos
        </a>
      </div>

      {canEdit && (
        <div className="space-y-4">
          {items.map((project, i) => (
            <div key={project.id} className="neon-card rounded-lg p-5 space-y-3">
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs text-primary">#{i + 1}</span>
                <button onClick={() => remove(project.id)} className="text-muted-foreground hover:text-destructive transition-colors">Eliminar</button>
              </div>
              <input value={project.name} onChange={(e) => update(i, "name", e.target.value)} className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-sm" placeholder="Nombre" />
              <textarea value={project.description} onChange={(e) => update(i, "description", e.target.value)} className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-sm" rows={2} placeholder="Descripcion" />
              <div>
                <label className="mb-1.5 block text-xs font-mono text-primary/70 uppercase tracking-wider">Tech stack (separado por comas)</label>
                <input value={project.techStack.join(", ")} onChange={(e) => update(i, "techStack", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-sm" />
              </div>
              <input value={project.githubUrl} onChange={(e) => update(i, "githubUrl", e.target.value)} className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-sm" placeholder="GitHub URL" />
              <input value={project.liveUrl ?? ""} onChange={(e) => update(i, "liveUrl", e.target.value)} className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-sm" placeholder="Live URL (opcional)" />
              <input value={project.imageUrl ?? ""} onChange={(e) => update(i, "imageUrl", e.target.value)} className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-sm" placeholder="Image URL" />
              <textarea value={project.longDescription ?? ""} onChange={(e) => update(i, "longDescription", e.target.value)} className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-sm" rows={3} placeholder="Descripcion larga (modal)" />
              <textarea value={project.highlights.join("\n")} onChange={(e) => update(i, "highlights", e.target.value.split("\n").filter(Boolean))} className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-sm" rows={3} placeholder="Puntos clave (uno por linea)" />
              <div className="flex items-center gap-3">
                <label className="text-xs text-muted-foreground">Mostrar en Home</label>
                <input type="checkbox" checked={project.featured} onChange={(e) => update(i, "featured", e.target.checked)} />
                <input value={project.homeOrder} onChange={(e) => update(i, "homeOrder", Number(e.target.value))} className="w-24 rounded-md border border-primary/20 bg-secondary/50 px-3 py-2 text-sm" placeholder="Orden" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input value={project.githubOwner ?? ""} onChange={(e) => update(i, "githubOwner", e.target.value)} className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-sm" placeholder="GitHub owner" />
                <input value={project.githubRepo ?? ""} onChange={(e) => update(i, "githubRepo", e.target.value)} className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-sm" placeholder="GitHub repo" />
              </div>
            </div>
          ))}
          <div className="flex gap-3">
            <button onClick={add} className="inline-flex items-center gap-2 rounded-md border border-primary/30 px-4 py-2 text-sm text-primary hover:bg-primary/5 transition-colors">
              Agregar
            </button>
          </div>
        </div>
      )}
    </Section>
  );
};

export default ProjectsSection;
