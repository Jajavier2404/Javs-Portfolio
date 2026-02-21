import { useCallback, useEffect, useRef, useState } from "react";
import Section from "@/components/Section";
import { useExperience } from "@/hooks/usePortfolioData";
import type { ExperienceItem } from "@/hooks/usePortfolioData";
import { Briefcase } from "lucide-react";
import { useAdminView } from "@/context/AdminViewContext";
import { useAdminActions } from "@/context/AdminActionsContext";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const ExperienceSection = () => {
  const { data: experienceData, isLoading } = useExperience();
  const { user } = useAuth();
  const isAdminView = useAdminView();
  const canEdit = Boolean(isAdminView && user);
  const [items, setItems] = useState<(ExperienceItem & { __isNew?: boolean })[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const itemsRef = useRef(items);
  const deletedIdsRef = useRef(deletedIds);
  const { toast } = useToast();
  const qc = useQueryClient();
  const { registerHandler } = useAdminActions();

  useEffect(() => {
    if (experienceData) setItems(experienceData);
  }, [experienceData]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    deletedIdsRef.current = deletedIds;
  }, [deletedIds]);

  const ready = !isLoading && Boolean(experienceData);

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
        company: "Nueva empresa",
        role: "Rol",
        dates: "2024",
        highlights: ["Logro 1"],
        sortOrder: prev.length,
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
          apiFetch("/experience", {
            method: "POST",
            body: JSON.stringify({
              company: item.company,
              role: item.role,
              dates: item.dates,
              highlights: item.highlights,
              sortOrder: index,
            }),
          })
        ),
        ...updates.map((item, index) =>
          apiFetch(`/experience/${item.id}`, {
            method: "PUT",
            body: JSON.stringify({
              company: item.company,
              role: item.role,
              dates: item.dates,
              highlights: item.highlights,
              sortOrder: index,
            }),
          })
        ),
        ...currentDeleted.map((id) => apiFetch(`/experience/${id}`, { method: "DELETE" })),
      ]);

      setDeletedIds([]);
      qc.invalidateQueries({ queryKey: ["experience"] });
      toast({ title: "Experiencia actualizada" });
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
      throw error;
    }
  }, [qc, toast]);

  useEffect(() => {
    if (!canEdit) return;
    registerHandler("experience", save);
    return () => registerHandler("experience", null);
  }, [canEdit, registerHandler, save]);

  if (!ready) return null;

  return (
    <Section id="experience" title="Experience">
      {!canEdit && (
        <div className="space-y-8">
          {experienceData.map((exp) => (
            <div key={exp.id} className="neon-card rounded-lg p-6 group">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                    <Briefcase size={14} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{exp.role}</h3>
                    <p className="text-sm text-primary">{exp.company}</p>
                  </div>
                </div>
                <span className="font-mono text-xs text-muted-foreground sm:text-right">{exp.dates}</span>
              </div>
              <ul className="space-y-2 ml-11">
                {exp.highlights.map((h, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/40 group-hover:bg-primary/80 transition-colors" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {canEdit && (
        <div className="space-y-4">
          {items.map((exp, i) => (
            <div key={exp.id} className="neon-card rounded-lg p-6 space-y-3">
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs text-primary">#{i + 1}</span>
                <button onClick={() => remove(exp.id)} className="text-muted-foreground hover:text-destructive transition-colors">Eliminar</button>
              </div>
              <input value={exp.company} onChange={(e) => update(i, "company", e.target.value)} className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-sm" placeholder="Empresa" />
              <input value={exp.role} onChange={(e) => update(i, "role", e.target.value)} className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-sm" placeholder="Rol" />
              <input value={exp.dates} onChange={(e) => update(i, "dates", e.target.value)} className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-sm" placeholder="Fechas" />
              <textarea
                value={exp.highlights.join("\n")}
                onChange={(e) => update(i, "highlights", e.target.value.split("\n"))}
                className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-sm"
                rows={4}
                placeholder="Logros (uno por linea)"
              />
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

export default ExperienceSection;
