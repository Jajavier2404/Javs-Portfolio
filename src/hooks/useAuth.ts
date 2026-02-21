import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";

export interface AuthUser {
  id: string;
  username: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ user: AuthUser | null }>("/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      const data = await apiFetch<{ user: AuthUser }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      setUser(data.user);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await apiFetch("/auth/logout", { method: "POST" });
    setUser(null);
  };

  return { user, loading, signIn, signOut };
};
