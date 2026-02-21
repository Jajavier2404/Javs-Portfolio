import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useAdminHomeGithubRepos, useProfile, useProjects } from "@/hooks/usePortfolioData";
import type { HomeGithubRepoSelection, ProjectItem } from "@/hooks/usePortfolioData";
import { apiFetch } from "@/lib/api";
import ProjectCard from "@/components/ProjectCard";
import { useAdminActions } from "@/context/AdminActionsContext";
import { useToast } from "@/hooks/use-toast";

interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  owner: { login: string };
}

const extractGithubUsername = (value?: string | null) => {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  try {
    if (trimmed.includes("github.com")) {
      const withProtocol = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
      const url = new URL(withProtocol);
      const segments = url.pathname.split("/").filter(Boolean);
      return segments[0] || "";
    }
  } catch {
    return trimmed.replace(/^@/, "");
  }
  return trimmed.replace(/^@/, "");
};

export const ProjectsCatalog = ({ adminMode }: { adminMode: boolean }) => {
  const { user } = useAuth();
  const canEdit = Boolean(adminMode && user);
  const { data: projectsData, isLoading, isError, error } = useProjects();
  const { data: profile } = useProfile();
  const { data: adminHomeRepos } = useAdminHomeGithubRepos(canEdit);
  const githubUsername = useMemo(() => extractGithubUsername(profile?.github), [profile?.github]);
  const { toast } = useToast();
  const qc = useQueryClient();
  const { registerHandler } = useAdminActions();

  const [items, setItems] = useState<(ProjectItem & { __isNew?: boolean })[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [homeSelection, setHomeSelection] = useState<HomeGithubRepoSelection[]>([]);
  const [adminGithubInput, setAdminGithubInput] = useState("");
  const [adminGithubUsername, setAdminGithubUsername] = useState("");
  const [savingGithub, setSavingGithub] = useState(false);
  const itemsRef = useRef(items);
  const deletedIdsRef = useRef(deletedIds);

  useEffect(() => {
    if (projectsData) setItems(projectsData);
  }, [projectsData]);

  useEffect(() => {
    if (adminHomeRepos) setHomeSelection(adminHomeRepos);
  }, [adminHomeRepos]);

  useEffect(() => {
    if (!profile?.github) return;
    if (!adminGithubInput) setAdminGithubInput(profile.github);
    if (!adminGithubUsername) setAdminGithubUsername(extractGithubUsername(profile.github));
  }, [profile?.github, adminGithubInput, adminGithubUsername]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    deletedIdsRef.current = deletedIds;
  }, [deletedIds]);

  const isHomeSelected = useCallback(
    (owner: string, repo: string) =>
      homeSelection.some(
        (selection) => selection.githubOwner === owner && selection.githubRepo === repo
      ),
    [homeSelection]
  );

  const toggleHomeSelection = useCallback(
    (owner: string, repo: string) => {
      setHomeSelection((prev) => {
        const exists = prev.some(
          (selection) => selection.githubOwner === owner && selection.githubRepo === repo
        );
        if (exists) {
          return prev.filter(
            (selection) => !(selection.githubOwner === owner && selection.githubRepo === repo)
          );
        }
        return [
          ...prev,
          {
            id: `temp-${owner}-${repo}`,
            githubOwner: owner,
            githubRepo: repo,
            sortOrder: prev.length,
          },
        ];
      });
    },
    []
  );

  const { data: publicGithubRepos, isLoading: isPublicGithubLoading } = useQuery({
    queryKey: ["github-public-repos", githubUsername],
    queryFn: async () => {
      const all: GithubRepo[] = [];
      let page = 1;
      const perPage = 100;
      while (page < 20) {
        const batch = await apiFetch<GithubRepo[]>(
          `/github/public-repos?username=${encodeURIComponent(githubUsername)}&page=${page}&per_page=${perPage}`
        );
        all.push(...batch);
        if (batch.length < perPage) break;
        page += 1;
      }
      return all;
    },
    enabled: !canEdit && Boolean(githubUsername),
    staleTime: 1000 * 60 * 5,
  });

  const { data: adminPublicGithubRepos } = useQuery({
    queryKey: ["admin-github-public-repos", adminGithubUsername],
    queryFn: async () => {
      const all: GithubRepo[] = [];
      let page = 1;
      const perPage = 100;
      while (page < 20) {
        const batch = await apiFetch<GithubRepo[]>(
          `/github/public-repos?username=${encodeURIComponent(adminGithubUsername)}&page=${page}&per_page=${perPage}`
        );
        all.push(...batch);
        if (batch.length < perPage) break;
        page += 1;
      }
      return all;
    },
    enabled: canEdit && Boolean(adminGithubUsername),
    staleTime: 1000 * 60 * 5,
  });

  const publicProjects = useMemo<ProjectItem[] | null>(() => {
    if (!publicGithubRepos) return null;
    return publicGithubRepos.map((repo, index) => {
      const tech = [...(repo.topics || []), ...(repo.language ? [repo.language] : [])];
      const techStack = Array.from(new Set(tech)).filter(Boolean);
      return {
        id: `github-${repo.id}`,
        name: repo.name,
        description: repo.description ?? "Sin descripcion",
        techStack: techStack.length > 0 ? techStack : ["GitHub"],
        githubUrl: repo.html_url,
        liveUrl: repo.homepage || null,
        imageUrl: `https://opengraph.githubassets.com/1/${repo.owner.login}/${repo.name}`,
        githubOwner: repo.owner.login,
        githubRepo: repo.name,
        sortOrder: index,
        featured: false,
        homeOrder: 0,
        longDescription: repo.description ?? null,
        highlights: [],
      };
    });
  }, [publicGithubRepos]);

  const adminGithubSource = adminPublicGithubRepos;

  const adminGithubProjects = useMemo<ProjectItem[]>(() => {
    if (!adminGithubSource) return [];
    return adminGithubSource.map((repo) => {
      const techStack = Array.from(
        new Set([...(repo.topics || []), ...(repo.language ? [repo.language] : [])])
      ).filter(Boolean);
      return {
        id: `github-${repo.id}`,
        name: repo.name,
        description: repo.description ?? "Sin descripcion",
        techStack: techStack.length > 0 ? techStack : ["GitHub"],
        githubUrl: repo.html_url,
        liveUrl: repo.homepage ?? null,
        imageUrl: `https://opengraph.githubassets.com/1/${repo.owner.login}/${repo.name}`,
        githubOwner: repo.owner.login,
        githubRepo: repo.name,
        sortOrder: 0,
        featured: false,
        homeOrder: 0,
        longDescription: repo.description ?? null,
        highlights: [],
      };
    });
  }, [adminGithubSource]);

  const update = (id: string, patch: Partial<ProjectItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
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

  const importRepo = async (owner: string, repo: string, featured = false) => {
    try {
      const data = await apiFetch<{
        name: string;
        description: string | null;
        html_url: string;
        homepage: string | null;
        language: string | null;
        topics: string[];
        image_url: string;
        owner: string;
        repo: string;
      }>(`/github/repo?owner=${owner}&repo=${repo}`);

      const tech = [...(data.topics || []), ...(data.language ? [data.language] : [])];
      const techStack = Array.from(new Set(tech));

      setItems((prev) => [
        ...prev,
        {
          id: `temp-${Date.now()}`,
          name: data.name,
          description: data.description ?? "",
          techStack: techStack.length > 0 ? techStack : ["GitHub"],
          githubUrl: data.html_url,
          liveUrl: data.homepage ?? null,
          imageUrl: data.image_url,
          githubOwner: data.owner,
          githubRepo: data.repo,
          sortOrder: prev.length,
          featured,
          homeOrder: 0,
          longDescription: data.description ?? "",
          highlights: [],
          __isNew: true,
        },
      ]);
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    }
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

  const saveHomeSelection = useCallback(async () => {
    try {
      await apiFetch("/admin/home-github-repos", {
        method: "PUT",
        body: JSON.stringify({
          repos: homeSelection.map((repo) => ({
            githubOwner: repo.githubOwner,
            githubRepo: repo.githubRepo,
          })),
        }),
      });
      qc.invalidateQueries({ queryKey: ["home-github-repos"] });
      qc.invalidateQueries({ queryKey: ["admin-home-github-repos"] });
      toast({ title: "Home actualizada" });
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
      throw error;
    }
  }, [homeSelection, qc, toast]);

  const saveGithubUrl = useCallback(async () => {
    if (!profile) {
      toast({ title: "Error", description: "Perfil no cargado", variant: "destructive" });
      return;
    }
    setSavingGithub(true);
    try {
      await apiFetch("/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: profile.name,
          role: profile.role,
          bio: profile.bio,
          email: profile.email,
          github: adminGithubInput,
          linkedin: profile.linkedin,
          twitter: profile.twitter,
        }),
      });
      qc.invalidateQueries({ queryKey: ["profile"] });
      setAdminGithubUsername(extractGithubUsername(adminGithubInput));
      toast({ title: "GitHub guardado" });
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    } finally {
      setSavingGithub(false);
    }
  }, [adminGithubInput, profile, qc, toast]);

  useEffect(() => {
    if (!canEdit) return;
    registerHandler("projects", save);
    registerHandler("home-github-repos", saveHomeSelection);
    return () => {
      registerHandler("projects", null);
      registerHandler("home-github-repos", null);
    };
  }, [canEdit, registerHandler, save, saveHomeSelection]);

  if (canEdit && isLoading) {
    return (
      <div className="container mx-auto px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Todos los proyectos</h1>
        </div>
        <p className="text-sm text-muted-foreground">Cargando proyectos...</p>
      </div>
    );
  }

  const ready = githubUsername
    ? !isPublicGithubLoading && Boolean(publicProjects)
    : !isLoading && Boolean(projectsData);

  if (!canEdit && !ready) return null;

  const listForPublic = publicProjects ?? projectsData ?? [];

  const listToRender = canEdit
    ? items.length > 0
      ? items
      : adminGithubProjects
    : listForPublic;

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Todos los proyectos</h1>
        {canEdit && (
          <button onClick={add} className="rounded-md border border-primary/30 px-4 py-2 text-sm text-primary hover:bg-primary/5">
            Agregar manual
          </button>
        )}
      </div>

      {canEdit && (
        <div className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-mono text-primary">GitHub (selecciona para Home)</h2>
            <span className="text-xs text-muted-foreground">Seleccionados: {homeSelection.length}</span>
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            <input
              className="w-full max-w-md rounded-md border border-primary/20 bg-secondary/50 px-3 py-2 text-sm text-muted-foreground"
              value={adminGithubInput}
              onChange={(e) => setAdminGithubInput(e.target.value)}
              placeholder="Tu GitHub (usuario o URL)"
            />
            <button
              type="button"
              onClick={() => setAdminGithubUsername(extractGithubUsername(adminGithubInput))}
              className="rounded-md border border-primary/30 px-4 py-2 text-xs text-primary"
            >
              Cargar
            </button>
            <button
              type="button"
              onClick={saveGithubUrl}
              disabled={!adminGithubInput || savingGithub}
              className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50"
            >
              {savingGithub ? "Guardando..." : "Guardar URL"}
            </button>
          </div>
          {adminGithubSource && adminGithubSource.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {adminGithubSource.map((repo) => {
              const project: ProjectItem = {
                id: `github-${repo.id}`,
                name: repo.name,
                description: repo.description ?? "Sin descripcion",
                techStack: Array.from(new Set([...(repo.topics || []), ...(repo.language ? [repo.language] : [])]))
                  .filter(Boolean),
                githubUrl: repo.html_url,
                liveUrl: repo.homepage ?? null,
                imageUrl: `https://opengraph.githubassets.com/1/${repo.owner.login}/${repo.name}`,
                githubOwner: repo.owner.login,
                githubRepo: repo.name,
                sortOrder: 0,
                featured: false,
                homeOrder: 0,
                longDescription: repo.description ?? null,
                highlights: [],
              };
              const selected = isHomeSelected(repo.owner.login, repo.name);
                return (
                  <div key={repo.id} className="relative">
                    <ProjectCard project={project} />
                    <div className="absolute right-3 top-3 z-10 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleHomeSelection(repo.owner.login, repo.name);
                        }}
                        className={`rounded-md border px-2 py-1 text-[11px] ${
                          selected
                            ? "border-primary/60 bg-primary/10 text-primary"
                            : "border-primary/20 text-muted-foreground"
                        }`}
                      >
                        {selected ? "En Home" : "Mostrar en Home"}
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          importRepo(repo.owner.login, repo.name, selected);
                        }}
                        className="rounded-md border border-primary/20 px-2 py-1 text-[11px] text-primary"
                      >
                        Importar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {canEdit && isError && (
        <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Error al cargar proyectos: {(error as Error)?.message || "Revisa el API"}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listToRender.map((project) => (
          <div key={project.id} className="relative">
            {canEdit && items.some((item) => item.id === project.id) && (
              <button
                onClick={() => remove(project.id)}
                className="absolute right-3 top-3 z-10 rounded-md border border-primary/30 bg-background/80 px-2 py-1 text-xs text-primary"
              >
                Eliminar
              </button>
            )}
            <ProjectCard
              project={project}
              editable={canEdit && items.some((item) => item.id === project.id)}
              onUpdate={(id, patch) => update(id, patch)}
            />
          </div>
        ))}
      </div>
      {canEdit && listToRender.length === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">
          No hay proyectos cargados. Usa “Importar” desde GitHub o “Agregar manual”.
        </p>
      )}
    </div>
  );
};
