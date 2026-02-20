import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Terminal } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = isLogin
      ? await signIn(email, password)
      : await signUp(email, password);

    setSubmitting(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    if (!isLogin) {
      toast({ title: "Cuenta creada", description: "Revisa tu email para confirmar tu cuenta." });
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
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClasses}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-mono font-medium text-primary/70 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClasses}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:shadow-[var(--neon-glow-strong)] hover:scale-[1.02] disabled:opacity-50"
            >
              {submitting ? "..." : isLogin ? "Iniciar sesión" : "Crear cuenta"}
            </button>
          </form>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            {isLogin ? "¿No tienes cuenta? Crear una" : "¿Ya tienes cuenta? Inicia sesión"}
          </button>

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
