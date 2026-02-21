import { useCallback, useEffect, useState } from "react";
import { useProfile } from "@/hooks/usePortfolioData";
import { ArrowDown, Mail, Terminal } from "lucide-react";
import Typewriter from "@/components/Typewriter";
import { useAdminView } from "@/context/AdminViewContext";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAdminActions } from "@/context/AdminActionsContext";

const HeroSection = () => {
  const { data: profile } = useProfile();
  const { user } = useAuth();
  const isAdminView = useAdminView();
  const canEdit = Boolean(isAdminView && user);
  const { toast } = useToast();
  const qc = useQueryClient();
  const { registerHandler } = useAdminActions();
  const [form, setForm] = useState({ name: "", role: "", bio: "", email: "", github: "", linkedin: "", twitter: "" });
  const [saving, setSaving] = useState(false);

  const name = profile?.name ?? "Javier Alexander";
  const role = profile?.role ?? "Full-Stack Developer";
  const bio = profile?.bio ?? "";

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name,
        role: profile.role,
        bio: profile.bio,
        email: profile.email,
        github: profile.github,
        linkedin: profile.linkedin,
        twitter: profile.twitter,
      });
    }
  }, [profile]);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      await apiFetch("/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: form.name,
          role: form.role,
          bio: form.bio,
          email: form.email,
          github: form.github,
          linkedin: form.linkedin,
          twitter: form.twitter,
        }),
      });
      qc.invalidateQueries({ queryKey: ["profile"] });
      toast({ title: "Perfil actualizado" });
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }, [form, profile, qc, toast]);

  useEffect(() => {
    if (!canEdit) return;
    registerHandler("profile", save);
    return () => registerHandler("profile", null);
  }, [canEdit, save, registerHandler]);

  return (
    <section
      id="about"
      className="relative flex min-h-screen items-center pt-20 overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-[100px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6">
        <div className="flex flex-col-reverse items-center gap-12 md:flex-row md:gap-16">
          <div className="flex-1 text-center md:text-left">
            <div className="hero-enter hero-enter-delay-1 inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-primary/20 bg-primary/5">
              <Terminal size={14} className="text-primary" />
              <span className="font-mono text-xs text-primary">Available for work</span>
            </div>

            <p className="hero-enter hero-enter-delay-1 mb-3 font-mono text-sm text-muted-foreground">
              Hi, I'm
            </p>
            <div className="hero-enter hero-enter-delay-2 mb-4">
              {canEdit ? (
                <input
                  className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-3xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nombre"
                />
              ) : (
                <h1 className="text-4xl font-bold leading-tight text-foreground md:text-6xl lg:text-7xl">
                  {name}
                  <span className="neon-text">.</span>
                </h1>
              )}
            </div>
            <div className="hero-enter hero-enter-delay-3 mb-4 text-xl text-muted-foreground md:text-2xl h-10">
              {canEdit ? (
                <input
                  className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-lg text-muted-foreground md:text-xl"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="Rol"
                />
              ) : (
                <Typewriter
                  texts={[role, "UI/UX Enthusiast", "Open Source Contributor", "Problem Solver"]}
                />
              )}
            </div>
            <div className="hero-enter hero-enter-delay-3 mb-8">
              {canEdit ? (
                <textarea
                  className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-base leading-relaxed text-muted-foreground md:text-lg"
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Bio"
                />
              ) : (
                <p className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
                  {bio}
                </p>
              )}
            </div>
            {canEdit && (
              <div className="hero-enter hero-enter-delay-3 mb-8 grid gap-3 sm:grid-cols-2">
                <input
                  className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-sm text-muted-foreground"
                  value={form.github}
                  onChange={(e) => setForm({ ...form, github: e.target.value })}
                  placeholder="GitHub (usuario o URL)"
                />
                <input
                  className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-sm text-muted-foreground"
                  value={form.linkedin}
                  onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                  placeholder="LinkedIn (URL)"
                />
                <input
                  className="w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-2 text-sm text-muted-foreground sm:col-span-2"
                  value={form.twitter}
                  onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                  placeholder="Twitter/X (URL)"
                />
              </div>
            )}
            <div className="hero-enter hero-enter-delay-4 flex flex-wrap justify-center gap-4 md:justify-start">
              <a href="#projects" className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:shadow-[var(--neon-glow-strong)] hover:scale-105">
                View Projects
                <ArrowDown size={16} className="transition-transform group-hover:translate-y-0.5" />
              </a>
              <a href="#contact" className="inline-flex items-center gap-2 rounded-md border border-primary/30 px-6 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:border-primary/60 hover:shadow-[var(--neon-glow)] hover:bg-primary/5">
                <Mail size={16} />
                Contact
              </a>
            </div>
          </div>

          <div className="hero-enter flex-shrink-0">
            <div className="relative">
              <div className="relative h-48 w-48 overflow-hidden rounded-full border-2 border-primary/30 avatar-glow md:h-64 md:w-64">
                <div className="flex h-full w-full items-center justify-center bg-secondary font-mono text-3xl text-primary md:text-4xl">
                  {name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </div>
              </div>
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary shadow-[var(--neon-glow)]" />
              </div>
              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-primary/40 rounded-tl-sm" />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-primary/40 rounded-br-sm" />
            </div>
          </div>
        </div>

        <div className="hero-enter hero-enter-delay-4 absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-primary/50 to-transparent animate-pulse-neon" />
        </div>

        {canEdit && null}
      </div>
    </section>
  );
};

export default HeroSection;
