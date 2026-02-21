import { useCallback, useEffect, useRef, useState } from "react";
import Section from "@/components/Section";
import { useEducation } from "@/hooks/usePortfolioData";
import type { EducationItem } from "@/hooks/usePortfolioData";
import { GraduationCap } from "lucide-react";
import { useAdminView } from "@/context/AdminViewContext";
import { useAdminActions } from "@/context/AdminActionsContext";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const EducationSection = () => {
  const { data: educationData, isLoading } = useEducation();
  const { user } = useAuth();
  const isAdminView = useAdminView();
  const canEdit = Boolean(isAdminView && user);
  const [items, setItems] = useState<(EducationItem & { __isNew?: boolean })[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const itemsRef = useRef(items);
  const deletedIdsRef = useRef(deletedIds);
  const { toast } = useToast();
  const qc = useQueryClient();
  const { registerHandler } = useAdminActions();

  useEffect(() => {
    if (educationData) setItems(educationData);
  }, [educationData]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    deletedIdsRef.current = deletedIds;
  }, [deletedIds]);

  const ready = !isLoading && Boolean(educationData);

  const update = (i: number, key: keyof EducationItem, val: string) => {
    const copy = [...items];
    (copy[i] as EducationItem)[key] = val as never;
    setItems(copy);
  };

  const add = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        school: "Nueva escuela",
        degree: "Titulo",
        dates: "2024",
        notes: "",
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
          apiFetch("/education", {
            method: "POST",
            body: JSON.stringify({
              school: item.school,
              degree: item.degree,
              dates: item.dates,
              notes: item.notes,
              sortOrder: index,
            }),
          })
        ),
        ...updates.map((item, index) =>
          apiFetch(`/education/${item.id}`, {
            method: "PUT",
            body: JSON.stringify({
              school: item.school,
              degree: item.degree,
              dates: item.dates,
              notes: item.notes,
              sortOrder: index,
            }),
          })
        ),
        ...currentDeleted.map((id) => apiFetch(`/education/${id}`, { method: "DELETE" })),
      ]);

      setDeletedIds([]);
      qc.invalidateQueries({ queryKey: ["education"] });
      toast({ title: "Educacion actualizada" });
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
      throw error;
    }
  }, [qc, toast]);

  useEffect(() => {
    if (!canEdit) return;
    registerHandler("education", save);
    return () => registerHandler("education", null);
  }, [canEdit, registerHandler, save]);

  if (!ready) return null;

  return (
    <Section id="education" title="Education">
      {!canEdit && (
        <div className="relative ml-4 border-l border-primary/20 pl-8">
          {educationData.map((edu, i) => (
            <div key={edu.id} className="group relative mb-12 last:mb-0">
              <div className="absolute -left-[calc(2rem+6px)] top-1 flex h-3 w-3 items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-primary shadow-[var(--neon-glow)] group-hover:shadow-[var(--neon-glow-strong)] transition-shadow" />
                <div className="absolute h-6 w-6 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: '3s' }} />
              </div>

              <div className="neon-card rounded-lg p-5">
                <div className="flex items-start gap-3 mb-2">
                  <GraduationCap size={16} className="mt-0.5 text-primary shrink-0" />
                  <div>
                    <p className="font-mono text-xs text-primary mb-1">{edu.dates}</p>
                    <h3 className="text-lg font-semibold text-foreground">{edu.degree}</h3>
                    <p className="text-sm text-muted-foreground">{edu.school}</p>
                    {edu.notes && (
                      <p className="mt-2 text-sm text-muted-foreground/70 italic">{edu.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {canEdit && (
        <div className="space-y-4">
          {items.map((edu, i) => (
            <div key={edu.id} className="neon-card rounded-lg p-5 space-y-3">
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs text-primary">#{i + 1}</span>
                <button onClick={() => remove(edu.id)} className="text-muted-foreground hover:text-destructive transition-colors">Eliminar</button>
              </div>
              <input value={edu.school} onChange={(e) => update(i, "school", e.target.value)} className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-sm" placeholder="Escuela" />
              <input value={edu.degree} onChange={(e) => update(i, "degree", e.target.value)} className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-sm" placeholder="Titulo" />
              <input value={edu.dates} onChange={(e) => update(i, "dates", e.target.value)} className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-sm" placeholder="Fechas" />
              <input value={edu.notes ?? ""} onChange={(e) => update(i, "notes", e.target.value)} className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-sm" placeholder="Notas" />
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

export default EducationSection;
