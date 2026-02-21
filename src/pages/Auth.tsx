import { useState, type FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Terminal } from "lucide-react";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await signIn(username, password);

    setSubmitting(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    navigate("/admin");
  };

  const inputClasses =
    "w-full rounded-md border border-primary/20 bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 focus:shadow-[var(--neon-glow)] transition-all duration-300";

  return (
    <div className="min-h-screen bg-background neon-grid-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="neon-card rounded-lg p-8">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <Terminal size={18} className="text-primary" />
            <h1 className="font-mono text-lg font-bold neon-text">Admin</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-mono font-medium text-primary/70 uppercase tracking-wider">
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClasses}
                placeholder="admin"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-mono font-medium text-primary/70 uppercase tracking-wider">
                Contrasena
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClasses}
                placeholder="••••"
                required
                minLength={4}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:shadow-[var(--neon-glow-strong)] hover:scale-[1.02] disabled:opacity-50"
            >
              {submitting ? "..." : "Iniciar sesión"}
            </button>
          </form>

          <a
            href="/"
            className="mt-3 block text-center text-xs text-muted-foreground/50 hover:text-primary transition-colors"
          >
            ← Volver al portafolio
          </a>
        </div>
      </div>
    </div>
  );
};

export default Auth;
