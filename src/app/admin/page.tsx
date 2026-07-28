"use client";

import { useState, useEffect, useCallback } from "react";

interface Lead {
  id: number;
  name: string;
  whatsapp: string;
  segmento: string;
  conversa: string;
  status: "novo" | "contatado" | "convertido" | "perdido";
  created_at: string;
}

const STATUS_COLORS = {
  novo: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  contatado: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  convertido: "bg-green-500/10 text-green-400 border-green-500/20",
  perdido: "bg-red-500/10 text-red-400 border-red-500/20",
} as const;

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLeads = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads", {
        headers: { authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        setToken(null);
        setError("Senha incorreta");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao carregar leads");
        return;
      }
      setLeads(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar leads");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    if (saved) {
      setToken(saved);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) fetchLeads();
  }, [token, fetchLeads]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/leads", {
      headers: { authorization: `Bearer ${password}` },
    });

    if (res.status === 401) {
      setError("Senha incorreta");
      setLoading(false);
      return;
    }

    sessionStorage.setItem("admin_token", password);
    setToken(password);
    setLoading(false);
  };

  const handleStatus = async (id: number, status: Lead["status"]) => {
    await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, status }),
    });
    fetchLeads();
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    setToken(null);
    setPassword("");
  };

  // Login screen
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-8"
        >
          <h1 className="mb-2 text-center text-2xl font-bold text-white">
            Admin
          </h1>
          <p className="mb-8 text-center text-sm text-zinc-500">
            Robô Vendedor — Leads
          </p>

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500"
            autoFocus
          />

          {error && (
            <p className="mb-4 text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3 text-sm font-medium text-white transition-all disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-lg font-bold">📋 Leads</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-500">
              {leads.length} lead{leads.length !== 1 && "s"}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-white/10 px-4 py-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {loading ? (
          <div className="py-20 text-center text-zinc-500">
            Carregando leads...
          </div>
        ) : leads.length === 0 ? (
          <div className="py-20 text-center text-zinc-500">
            Nenhum lead capturado ainda.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/5">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-zinc-900">
                  <th className="px-4 py-3 font-medium text-zinc-400">Nome</th>
                  <th className="px-4 py-3 font-medium text-zinc-400">WhatsApp</th>
                  <th className="px-4 py-3 font-medium text-zinc-400">Segmento</th>
                  <th className="px-4 py-3 font-medium text-zinc-400">Status</th>
                  <th className="px-4 py-3 font-medium text-zinc-400">Data</th>
                  <th className="px-4 py-3 font-medium text-zinc-400">Ações</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-white/5 transition-colors hover:bg-zinc-900/50"
                  >
                    <td className="px-4 py-3 font-medium">{lead.name}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`https://wa.me/${lead.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-400 transition-colors hover:text-violet-300"
                      >
                        {lead.whatsapp}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {lead.segmento || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                          STATUS_COLORS[lead.status]
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {new Date(lead.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          handleStatus(
                            lead.id,
                            e.target.value as Lead["status"]
                          )
                        }
                        className="rounded-lg border border-white/10 bg-zinc-800 px-2 py-1 text-xs text-white outline-none focus:border-violet-500"
                      >
                        <option value="novo">Novo</option>
                        <option value="contatado">Contatado</option>
                        <option value="convertido">Convertido</option>
                        <option value="perdido">Perdido</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
