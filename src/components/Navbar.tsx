import { useState, useEffect } from "react";
import { navLinks } from "@/data/profile";
import { useAuth } from "@/hooks/useAuth";
import { useAdminView } from "@/context/AdminViewContext";
import { useAdminActions } from "@/context/AdminActionsContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Menu, X, Settings } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { user, signOut, loading } = useAuth();
  const isAdminView = useAdminView();
  const { handlers, savingAll, setSavingAll } = useAdminActions();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSave = async () => {
    const entries = Object.values(handlers);
    if (entries.length === 0) return;
    setSavingAll(true);
    try {
      for (const handler of entries) {
        await handler();
      }
      toast({ title: "Cambios guardados" });
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    } finally {
      setSavingAll(false);
    }
  };

  const handleExitAdmin = async () => {
    await signOut();
    navigate("/");
  };

  const isAdminControls = Boolean(isAdminView && user && !loading);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = navLinks.map((l) => l.href.replace("#", ""));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 150) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "glass-panel border-b shadow-[0_4px_20px_hsl(120_100%_40%/0.03)]" : "bg-transparent"}`}>
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <a href="#about" className="font-mono text-lg font-bold neon-text">{"<JA />"}</a>

        <div className="hidden md:flex items-center gap-1">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <li key={link.href}>
                  <a href={link.href} className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-md ${isActive ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"}`}>
                    {link.label}
                    {isActive && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-px bg-primary shadow-[var(--neon-glow)]" />}
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="ml-2 flex min-w-[160px] items-center justify-end">
            {loading && isAdminView ? (
              <div className="h-8 w-[160px]" />
            ) : isAdminControls ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={Object.keys(handlers).length === 0 || savingAll}
                  className="rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground disabled:opacity-50"
                >
                  {savingAll ? "Guardando..." : "Guardar"}
                </button>
                <button
                  type="button"
                  onClick={handleExitAdmin}
                  className="rounded-md border border-primary/30 px-3 py-1 text-xs text-primary"
                >
                  Salir admin
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => navigate(user ? "/admin" : "/auth")}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-primary/20 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all"
                title="Admin"
              >
                <Settings size={14} />
              </button>
            )}
          </div>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground hover:text-primary transition-colors" aria-label="Toggle menu">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass-panel border-t px-6 pb-4">
          <ul className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <li key={link.href}>
                  <a href={link.href} onClick={() => setMobileOpen(false)} className={`block px-4 py-2 text-sm rounded-md transition-colors ${isActive ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-primary"}`}>
                    {link.label}
                  </a>
                </li>
              );
            })}
            <li>
              {isAdminControls ? (
                <div className="flex flex-col gap-2 px-4 py-2">
                  <button
                    onClick={async () => { await handleSave(); setMobileOpen(false); }}
                    disabled={Object.keys(handlers).length === 0 || savingAll}
                    className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50"
                  >
                    {savingAll ? "Guardando..." : "Guardar"}
                  </button>
                  <button
                    onClick={async () => { await handleExitAdmin(); setMobileOpen(false); }}
                    className="rounded-md border border-primary/30 px-3 py-2 text-xs text-primary"
                  >
                    Salir admin
                  </button>
                </div>
              ) : (
                <a href={user ? "/admin" : "/auth"} onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm rounded-md text-muted-foreground hover:text-primary transition-colors">
                  <Settings size={14} className="inline mr-2" />Admin
                </a>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
