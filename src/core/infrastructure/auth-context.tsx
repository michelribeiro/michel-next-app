"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthClient {
  id: number;
  name: string;
  email: string;
  plan: string;
  status: string;
}

interface AuthContextData {
  client: AuthClient | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [client, setClient] = useState<AuthClient | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const savedToken = sessionStorage.getItem("client_token");
    if (!savedToken) {
      setLoading(false);
      return;
    }

    fetch("/api/auth/me", {
      headers: { authorization: `Bearer ${savedToken}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Sessão inválida");
        const data = await res.json();
        setClient(data.client);
        setToken(savedToken);
        sessionStorage.setItem("client_name", data.client.name);
        sessionStorage.setItem("client_plan", data.client.plan);
      })
      .catch(() => {
        sessionStorage.clear();
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return { error: data.error || "Erro ao fazer login" };

      sessionStorage.setItem("client_token", data.token);
      sessionStorage.setItem("client_name", data.client.name);
      sessionStorage.setItem("client_plan", data.client.plan);
      setToken(data.token);
      setClient(data.client);
      return {};
    } catch {
      return { error: "Erro de conexão" };
    }
  }, []);

  const logout = useCallback(async () => {
    if (token) {
      await fetch("/api/auth/me", {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    sessionStorage.clear();
    setClient(null);
    setToken(null);
    router.replace("/login");
  }, [token, router]);

  const refresh = useCallback(async () => {
    if (!token) return;
    const res = await fetch("/api/auth/me", {
      headers: { authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setClient(data.client);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ client, token, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
