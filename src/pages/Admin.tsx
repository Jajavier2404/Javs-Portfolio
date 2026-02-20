import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useProfile, useEducation, useExperience, useProjects } from "@/hooks/usePortfolioData";
import type { ProfileData, EducationItem, ExperienceItem, ProjectItem } from "@/hooks/usePortfolioData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Save, Plus, Trash2, Terminal, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><span className="text-primary font-mono">Loading...</span></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background neon-grid-bg">
      <nav className="glass-panel border-b sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Terminal size={16} className="text-primary" />
            <span className="font-mono text-sm font-bold neon-text">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
              <ArrowLeft size={12} /> Portafolio
            </a>
            <button onClick={() => { signOut(); navigate("/"); }} className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors">
              <LogOut size={12} /> Salir
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="profile">
          <TabsList className="mb-8 bg-secondary/50 border border-primary/10">
            <TabsTrigger value="profile" className="font-mono text-xs data-[state=active]:text-primary">Perfil</TabsTrigger>
            <TabsTrigger value="education" className="font-mono text-xs data-[state=active]:text-primary">Educación</TabsTrigger>
            <TabsTrigger value="experience" className="font-mono text-xs data-[state=active]:text-primary">Experiencia</TabsTrigger>
            <TabsTrigger value="projects" className="font-mono text-xs data-[state=active]:text-primary">Proyectos</TabsTrigger>
          </TabsList>

          <TabsContent value="profile"><ProfileEditor /></TabsContent>
          <TabsContent value="education"><EducationEditor /></TabsContent>
          <TabsContent value="experience"><ExperienceEditor /></TabsContent>
          <TabsContent value="projects"><ProjectsEditor /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const inputClasses = "w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all";

const SaveBtn = ({ onClick, saving }: { onClick: () => void; saving: boolean }) => (
  <button onClick={onClick} disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:shadow-[var(--neon-glow-strong)] transition-all disabled:opacity-50">
    <Save size={14} /> {saving ? "Guardando..." : "Guardar"}
  </button>
);

// === Profile Editor ===
const ProfileEditor = () => {
  const { data, isLoading } = useProfile();
  const [form, setForm] = useState<Partial<ProfileData>>({});
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const qc = useQueryClient();

  useEffect(() => { if (data) setForm(data); }, [data]);

  const save = async () => {
    if (!form.id) return;
    setSaving(true);
    const { error } = await supabase.from("profile").update({
      name: form.name, role: form.role, bio: form.bio, email: form.email,
      github: form.github, linkedin: form.linkedin, twitter: form.twitter,
    } as any).eq("id", form.id);
    setSaving(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    qc.invalidateQueries({ queryKey: ["profile"] });
    toast({ title: "Perfil actualizado" });
  };

  if (isLoading) return <p className="text-muted-foreground text-sm">Cargando...</p>;

  const field = (label: string, key: keyof ProfileData, textarea = false) => (
    <div key={key}>
      <label className="mb-1.5 block text-xs font-mono text-primary/70 uppercase tracking-wider">{label}</label>
      {textarea ? (
        <textarea value={form[key] ?? ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className={`${inputClasses} resize-none`} rows={3} />
      ) : (
        <input value={form[key] ?? ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className={inputClasses} />
      )}
    </div>
  );

  return (
    <div className="neon-card rounded-lg p-6 max-w-2xl space-y-4">
      {field("Nombre", "name")}
      {field("Rol", "role")}
      {field("Bio", "bio", true)}
      {field("Email", "email")}
      {field("GitHub", "github")}
      {field("LinkedIn", "linkedin")}
      {field("Twitter", "twitter")}
      <SaveBtn onClick={save} saving={saving} />
    </div>
  );
};

// === Education Editor ===
const EducationEditor = () => {
  const { data, isLoading } = useEducation();
  const [items, setItems] = useState<EducationItem[]>([]);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const qc = useQueryClient();

  useEffect(() => { if (data) setItems(data); }, [data]);

  const update = (i: number, key: keyof EducationItem, val: string) => {
    const copy = [...items];
    (copy[i] as any)[key] = val;
    setItems(copy);
  };

  const add = async () => {
    const { error } = await supabase.from("education").insert({ school: "Nueva escuela", degree: "Título", dates: "2024", sort_order: items.length } as any);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    qc.invalidateQueries({ queryKey: ["education"] });
  };

  const remove = async (id: string) => {
    await supabase.from("education").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["education"] });
  };

  const save = async () => {
    setSaving(true);
    for (const item of items) {
      await supabase.from("education").update({ school: item.school, degree: item.degree, dates: item.dates, notes: item.notes, sort_order: item.sort_order } as any).eq("id", item.id);
    }
    setSaving(false);
    qc.invalidateQueries({ queryKey: ["education"] });
    toast({ title: "Educación actualizada" });
  };

  if (isLoading) return <p className="text-muted-foreground text-sm">Cargando...</p>;

  return (
    <div className="space-y-4 max-w-2xl">
      {items.map((item, i) => (
        <div key={item.id} className="neon-card rounded-lg p-5 space-y-3">
          <div className="flex justify-between items-start">
            <span className="font-mono text-xs text-primary">#{i + 1}</span>
            <button onClick={() => remove(item.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
          </div>
          <input value={item.school} onChange={(e) => update(i, "school", e.target.value)} className={inputClasses} placeholder="Escuela" />
          <input value={item.degree} onChange={(e) => update(i, "degree", e.target.value)} className={inputClasses} placeholder="Título" />
          <input value={item.dates} onChange={(e) => update(i, "dates", e.target.value)} className={inputClasses} placeholder="Fechas" />
          <input value={item.notes ?? ""} onChange={(e) => update(i, "notes", e.target.value)} className={inputClasses} placeholder="Notas (opcional)" />
        </div>
      ))}
      <div className="flex gap-3">
        <button onClick={add} className="inline-flex items-center gap-2 rounded-md border border-primary/30 px-4 py-2 text-sm text-primary hover:bg-primary/5 transition-colors">
          <Plus size={14} /> Agregar
        </button>
        <SaveBtn onClick={save} saving={saving} />
      </div>
    </div>
  );
};

// === Experience Editor ===
const ExperienceEditor = () => {
  const { data, isLoading } = useExperience();
  const [items, setItems] = useState<ExperienceItem[]>([]);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const qc = useQueryClient();

  useEffect(() => { if (data) setItems(data); }, [data]);

  const update = (i: number, key: string, val: any) => {
    const copy = [...items];
    (copy[i] as any)[key] = val;
    setItems(copy);
  };

  const add = async () => {
    const { error } = await supabase.from("experience").insert({ company: "Nueva empresa", role: "Rol", dates: "2024", highlights: ["Logro 1"], sort_order: items.length } as any);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    qc.invalidateQueries({ queryKey: ["experience"] });
  };

  const remove = async (id: string) => {
    await supabase.from("experience").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["experience"] });
  };

  const save = async () => {
    setSaving(true);
    for (const item of items) {
      await supabase.from("experience").update({ company: item.company, role: item.role, dates: item.dates, highlights: item.highlights, sort_order: item.sort_order } as any).eq("id", item.id);
    }
    setSaving(false);
    qc.invalidateQueries({ queryKey: ["experience"] });
    toast({ title: "Experiencia actualizada" });
  };

  if (isLoading) return <p className="text-muted-foreground text-sm">Cargando...</p>;

  return (
    <div className="space-y-4 max-w-2xl">
      {items.map((item, i) => (
        <div key={item.id} className="neon-card rounded-lg p-5 space-y-3">
          <div className="flex justify-between items-start">
            <span className="font-mono text-xs text-primary">#{i + 1}</span>
            <button onClick={() => remove(item.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
          </div>
          <input value={item.company} onChange={(e) => update(i, "company", e.target.value)} className={inputClasses} placeholder="Empresa" />
          <input value={item.role} onChange={(e) => update(i, "role", e.target.value)} className={inputClasses} placeholder="Rol" />
          <input value={item.dates} onChange={(e) => update(i, "dates", e.target.value)} className={inputClasses} placeholder="Fechas" />
          <div>
            <label className="mb-1.5 block text-xs font-mono text-primary/70 uppercase tracking-wider">Logros (uno por línea)</label>
            <textarea
              value={item.highlights.join("\n")}
              onChange={(e) => update(i, "highlights", e.target.value.split("\n"))}
              className={`${inputClasses} resize-none`}
              rows={4}
            />
          </div>
        </div>
      ))}
      <div className="flex gap-3">
        <button onClick={add} className="inline-flex items-center gap-2 rounded-md border border-primary/30 px-4 py-2 text-sm text-primary hover:bg-primary/5 transition-colors">
          <Plus size={14} /> Agregar
        </button>
        <SaveBtn onClick={save} saving={saving} />
      </div>
    </div>
  );
};

// === Projects Editor ===
const ProjectsEditor = () => {
  const { data, isLoading } = useProjects();
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const qc = useQueryClient();

  useEffect(() => { if (data) setItems(data); }, [data]);

  const update = (i: number, key: string, val: any) => {
    const copy = [...items];
    (copy[i] as any)[key] = val;
    setItems(copy);
  };

  const add = async () => {
    const { error } = await supabase.from("projects").insert({ name: "Nuevo proyecto", description: "Descripción", tech_stack: ["React"], github_url: "https://github.com", sort_order: items.length } as any);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    qc.invalidateQueries({ queryKey: ["projects"] });
  };

  const remove = async (id: string) => {
    await supabase.from("projects").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["projects"] });
  };

  const save = async () => {
    setSaving(true);
    for (const item of items) {
      await supabase.from("projects").update({
        name: item.name, description: item.description, tech_stack: item.tech_stack,
        github_url: item.github_url, live_url: item.live_url || null, sort_order: item.sort_order,
      } as any).eq("id", item.id);
    }
    setSaving(false);
    qc.invalidateQueries({ queryKey: ["projects"] });
    toast({ title: "Proyectos actualizados" });
  };

  if (isLoading) return <p className="text-muted-foreground text-sm">Cargando...</p>;

  return (
    <div className="space-y-4 max-w-2xl">
      {items.map((item, i) => (
        <div key={item.id} className="neon-card rounded-lg p-5 space-y-3">
          <div className="flex justify-between items-start">
            <span className="font-mono text-xs text-primary">#{i + 1}</span>
            <button onClick={() => remove(item.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
          </div>
          <input value={item.name} onChange={(e) => update(i, "name", e.target.value)} className={inputClasses} placeholder="Nombre" />
          <textarea value={item.description} onChange={(e) => update(i, "description", e.target.value)} className={`${inputClasses} resize-none`} rows={2} placeholder="Descripción" />
          <div>
            <label className="mb-1.5 block text-xs font-mono text-primary/70 uppercase tracking-wider">Tech stack (separado por comas)</label>
            <input value={item.tech_stack.join(", ")} onChange={(e) => update(i, "tech_stack", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} className={inputClasses} />
          </div>
          <input value={item.github_url} onChange={(e) => update(i, "github_url", e.target.value)} className={inputClasses} placeholder="GitHub URL" />
          <input value={item.live_url ?? ""} onChange={(e) => update(i, "live_url", e.target.value)} className={inputClasses} placeholder="Live URL (opcional)" />
        </div>
      ))}
      <div className="flex gap-3">
        <button onClick={add} className="inline-flex items-center gap-2 rounded-md border border-primary/30 px-4 py-2 text-sm text-primary hover:bg-primary/5 transition-colors">
          <Plus size={14} /> Agregar
        </button>
        <SaveBtn onClick={save} saving={saving} />
      </div>
    </div>
  );
};

export default Admin;
