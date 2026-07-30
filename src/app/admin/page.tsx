"use client";

import { useState, useEffect, useCallback } from "react";
import { PlanType } from "@/core/domain/plan/value-objects/PlanType";

// ─── Types ────────────────────────────────────────────────

interface Lead {
  id: number;
  name: string;
  whatsapp: string;
  segmento: string;
  conversa: string;
  status: "novo" | "contatado" | "convertido" | "perdido";
  created_at: string;
}

interface Client {
  id: number;
  name: string;
  email: string;
  whatsapp: string;
  plan: PlanType;
  status: "active" | "suspended" | "canceled";
  free_until: string | null;
  created_at: string;
  updated_at: string;
}

type Tab = "leads" | "clientes";

// ─── Constants ────────────────────────────────────────────

const LEAD_STATUS_COLORS = {
  novo: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  contatado: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  convertido: "bg-green-500/10 text-green-400 border-green-500/20",
  perdido: "bg-red-500/10 text-red-400 border-red-500/20",
} as const;

const CLIENT_STATUS_CONFIG = {
  active: { label: "Ativo", color: "bg-green-500/10 text-green-400 border-green-500/20" },
  suspended: { label: "Suspenso", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  canceled: { label: "Cancelado", color: "bg-red-500/10 text-red-400 border-red-500/20" },
} as const;

const PLAN_LABELS: Record<PlanType, string> = {
  free: "Free",
  basic: "Básico",
  evolution: "Evolution",
  pro: "Pro",
};

const PLAN_COLORS: Record<PlanType, string> = {
  free: "bg-green-500/10 text-green-400 border-green-500/20",
  basic: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  evolution: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  pro: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

// ─── Helpers ──────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Login Screen ─────────────────────────────────────────

function LoginScreen({
  onLogin,
  error,
  loading,
}: {
  onLogin: (password: string) => void;
  error: string;
  loading: boolean;
}) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-8"
      >
        <h1 className="mb-2 text-center text-2xl font-bold text-white">
          Admin
        </h1>
        <p className="mb-8 text-center text-sm text-zinc-500">
          Robô Vendedor
        </p>

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500"
          autoFocus
        />

        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

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

// ─── Leads Tab ────────────────────────────────────────────

function LeadsTab({
  token,
  onError,
}: {
  token: string;
  onError: (msg: string) => void;
}) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads", {
        headers: { authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        onError("Sessão expirada");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        onError(data.error || "Erro ao carregar leads");
        return;
      }
      setLeads(data);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Erro ao carregar leads");
    } finally {
      setLoading(false);
    }
  }, [token, onError]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

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

  const handleDelete = async (id: number) => {
    setConfirmDeleteId(null);
    await fetch(`/api/admin/leads?id=${id}`, {
      method: "DELETE",
      headers: { authorization: `Bearer ${token}` },
    });
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  if (loading) {
    return <div className="py-20 text-center text-zinc-500">Carregando leads...</div>;
  }

  if (leads.length === 0) {
    return <div className="py-20 text-center text-zinc-500">Nenhum lead capturado ainda.</div>;
  }

  return (
    <div
      className="overflow-x-auto rounded-2xl border border-white/5"
      onClick={() => setConfirmDeleteId(null)}
    >
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
              <td className="px-4 py-3 text-zinc-400">{lead.segmento || "-"}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                    LEAD_STATUS_COLORS[lead.status]
                  }`}
                >
                  {lead.status}
                </span>
              </td>
              <td className="px-4 py-3 text-zinc-400">{formatDate(lead.created_at)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatus(lead.id, e.target.value as Lead["status"])}
                    className="rounded-lg border border-white/10 bg-zinc-800 px-2 py-1 text-xs text-white outline-none focus:border-violet-500"
                  >
                    <option value="novo">Novo</option>
                    <option value="contatado">Contatado</option>
                    <option value="convertido">Convertido</option>
                    <option value="perdido">Perdido</option>
                  </select>
                  {confirmDeleteId === lead.id ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(lead.id);
                      }}
                      className="rounded-lg border border-red-500/40 bg-red-500/30 px-2 py-1 text-xs font-medium text-white transition-all hover:bg-red-500/50"
                    >
                      Confirmar
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeleteId(lead.id);
                      }}
                      className="rounded-lg border border-red-500/20 bg-red-500/10 px-2 py-1 text-xs text-red-400 transition-all hover:bg-red-500/30"
                    >
                      Excluir
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Clients Tab ──────────────────────────────────────────

function CreateClientModal({
  open,
  onClose,
  onCreated,
  token,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  token: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [plan, setPlan] = useState<PlanType>(PlanType.BASIC);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [createdInfo, setCreatedInfo] = useState<{ name: string; email: string; password: string } | null>(null);
  const [freeUntil, setFreeUntil] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const body: Record<string, unknown> = { name, email, whatsapp, plan };
    if (plan === PlanType.FREE && freeUntil) {
      body.free_until = freeUntil;
    }

    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao criar cliente");
      }

      const data = await res.json();

      setCreatedInfo({
        name: data.name,
        email: data.email,
        password: data.temp_password,
      });

      setName("");
      setEmail("");
      setWhatsapp("");
      setPlan(PlanType.BASIC);
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6">
        <h2 className="mb-6 text-lg font-bold text-white">Novo Cliente</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500"
              placeholder="Nome do cliente"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-zinc-500">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500"
              placeholder="email@cliente.com"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-zinc-500">WhatsApp</label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500"
              placeholder="(11) 99999-9999"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-zinc-500">Plano</label>
            <select
              value={plan}
              onChange={(e) => {
                setPlan(e.target.value as PlanType);
                if (e.target.value !== PlanType.FREE) setFreeUntil("");
              }}
              className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
            >
              <option value={PlanType.FREE}>Free — Grátis</option>
              <option value={PlanType.BASIC}>Básico — R$49</option>
              <option value={PlanType.EVOLUTION}>Evolution — R$97</option>
              <option value={PlanType.PRO}>Pro — R$197</option>
            </select>
          </div>

          {plan === PlanType.FREE && (
            <div>
              <label className="mb-1 block text-xs text-zinc-500">
                Expira em (data)
              </label>
              <input
                type="date"
                value={freeUntil}
                onChange={(e) => setFreeUntil(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
                required
              />
            </div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 bg-zinc-800 py-3 text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !name || !email || !whatsapp}
              className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3 text-sm font-medium text-white transition-all disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>

      {/* Success with password */}
      {createdInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-green-500/20 bg-zinc-900 p-6">
            <div className="mb-4 text-center">
              <div className="mb-3 text-4xl">✅</div>
              <h2 className="text-lg font-bold text-white">
                Cliente cadastrado!
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                {createdInfo.name} — {createdInfo.email}
              </p>
            </div>

            <div className="mb-4 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
              <p className="mb-2 text-xs font-medium text-violet-400">
                🔑 Senha temporária
              </p>
              <p className="select-all rounded-lg bg-zinc-800 px-3 py-2 font-mono text-lg font-bold text-white">
                {createdInfo.password}
              </p>
            </div>

            <p className="mb-4 text-xs text-zinc-500">
              O cliente deve acessar <span className="text-violet-400">/{'login'}</span> com e-mail e esta senha.
              Recomende trocar a senha no primeiro acesso.
            </p>

            <button
              onClick={() => {
                setCreatedInfo(null);
                onClose();
              }}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3 text-sm font-medium text-white transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ClientsTab({
  token,
  onError,
}: {
  token: string;
  onError: (msg: string) => void;
}) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/clients", {
        headers: { authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        onError("Sessão expirada");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        onError(data.error || "Erro ao carregar clientes");
        return;
      }
      setClients(data);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  }, [token, onError]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleStatusChange = async (
    id: number,
    status: Client["status"]
  ) => {
    try {
      const res = await fetch("/api/admin/clients", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status }),
      });

      if (!res.ok) {
        const data = await res.json();
        onError(data.error || "Erro ao atualizar");
        return;
      }

      fetchClients();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Erro ao atualizar");
    }
  };

  const handlePlanChange = async (id: number, plan: PlanType) => {
    try {
      const res = await fetch("/api/admin/clients", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, plan }),
      });

      if (!res.ok) {
        const data = await res.json();
        onError(data.error || "Erro ao atualizar");
        return;
      }

      fetchClients();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Erro ao atualizar");
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-zinc-500">Carregando clientes...</div>;
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm text-zinc-500">
          {clients.length} cliente{clients.length !== 1 && "s"}
        </span>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
        >
          + Novo Cliente
        </button>
      </div>

      {clients.length === 0 ? (
        <div className="py-20 text-center text-zinc-500">
          Nenhum cliente cadastrado ainda.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/5">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-zinc-900">
                <th className="px-4 py-3 font-medium text-zinc-400">Nome</th>
                <th className="px-4 py-3 font-medium text-zinc-400">E-mail</th>
                <th className="px-4 py-3 font-medium text-zinc-400">WhatsApp</th>
                <th className="px-4 py-3 font-medium text-zinc-400">Plano</th>
                <th className="px-4 py-3 font-medium text-zinc-400">Status</th>
                <th className="px-4 py-3 font-medium text-zinc-400">Expira</th>
                <th className="px-4 py-3 font-medium text-zinc-400">Desde</th>
                <th className="px-4 py-3 font-medium text-zinc-400">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="border-b border-white/5 transition-colors hover:bg-zinc-900/50"
                >
                  <td className="px-4 py-3 font-medium">{client.name}</td>
                  <td className="px-4 py-3 text-zinc-400">{client.email}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`https://wa.me/${client.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-400 transition-colors hover:text-violet-300"
                    >
                      {client.whatsapp}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={client.plan}
                      onChange={(e) =>
                        handlePlanChange(client.id, e.target.value as PlanType)
                      }
                      className={`rounded-lg border px-2 py-1 text-xs outline-none ${
                        PLAN_COLORS[client.plan]
                      }`}
                    >
                      <option value={PlanType.FREE}>Free</option>
                      <option value={PlanType.BASIC}>Básico</option>
                      <option value={PlanType.EVOLUTION}>Evolution</option>
                      <option value={PlanType.PRO}>Pro</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={client.status}
                      onChange={(e) =>
                        handleStatusChange(
                          client.id,
                          e.target.value as Client["status"]
                        )
                      }
                      className={`rounded-lg border px-2 py-1 text-xs outline-none ${
                        CLIENT_STATUS_CONFIG[client.status].color
                      }`}
                    >
                      <option value="active">Ativo</option>
                      <option value="suspended">Suspenso</option>
                      <option value="canceled">Cancelado</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    {client.free_until
                      ? new Date(client.free_until).toLocaleDateString("pt-BR")
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    {formatDate(client.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setEditingId(client.id)}
                      className="rounded-lg border border-white/10 bg-zinc-800 px-2 py-1 text-xs text-zinc-400 transition-colors hover:text-white"
                    >
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreateClientModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={fetchClients}
        token={token}
      />
    </>
  );
}

// ─── Main Admin Page ──────────────────────────────────────

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("leads");

  const handleError = useCallback((msg: string) => {
    setError(msg);
    setTimeout(() => setError(""), 5000);
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    if (saved) {
      setToken(saved);
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (loginPassword: string) => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/leads", {
      headers: { authorization: `Bearer ${loginPassword}` },
    });

    if (res.status === 401) {
      setError("Senha incorreta");
      setLoading(false);
      return;
    }

    sessionStorage.setItem("admin_token", loginPassword);
    setToken(loginPassword);
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    setToken(null);
    setPassword("");
  };

  // Login screen
  if (!token) {
    return (
      <LoginScreen onLogin={handleLogin} error={error} loading={loading} />
    );
  }

  // Dashboard
  const tabs: { key: Tab; label: string }[] = [
    { key: "leads", label: "Leads" },
    { key: "clientes", label: "Clientes" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-lg font-bold">📋 Admin</h1>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-white/10 px-4 py-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-white/5">
        <div className="mx-auto flex max-w-6xl gap-1 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "border-b-2 border-violet-500 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error toast */}
      {error && (
        <div className="mx-auto mt-4 max-w-6xl px-6">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
            {error}
          </div>
        </div>
      )}

      {/* Content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {activeTab === "leads" && (
          <LeadsTab token={token} onError={handleError} />
        )}
        {activeTab === "clientes" && (
          <ClientsTab token={token} onError={handleError} />
        )}
      </main>
    </div>
  );
}
