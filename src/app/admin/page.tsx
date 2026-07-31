"use client";

import { useState, useEffect, useCallback } from "react";
import { PlanType } from "@/core/domain/plan/value-objects/PlanType";
import { getDefaultFeatures, FEATURE_LABELS, ClientFeatures } from "@/core/domain/client/value-objects/ClientFeatures";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  features: ClientFeatures | null;
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

function maskWhatsApp(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7)
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

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
  onSuccess,
  token,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  onSuccess: (name: string, password: string) => void;
  token: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [plan, setPlan] = useState<PlanType>(PlanType.BASIC);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [freeUntil, setFreeUntil] = useState<Date | null>(null);

  // Features customizáveis (Free)
  const [freeFeatures, setFreeFeatures] = useState({
    has_whatsapp: false,
    has_dashboard: false,
    has_instagram: false,
    has_custom_domain: false,
    has_checkout: false,
    max_products: 5,
    max_groups: 0,
  });

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const body: Record<string, unknown> = { name, email, whatsapp, plan };
    if (plan === PlanType.FREE && freeUntil) {
      body.free_until = freeUntil.toISOString();
      body.features = freeFeatures;
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
      const clientName = data.name;
      const tempPass = data.temp_password;

      setName("");
      setEmail("");
      setWhatsapp("");
      setFreeUntil(null);
      setPlan(PlanType.BASIC);
      onCreated();
      onSuccess(clientName, tempPass);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setTimeout(() => setError(""), 6000);
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
              onChange={(e) => setWhatsapp(maskWhatsApp(e.target.value))}
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
                if (e.target.value !== PlanType.FREE) setFreeUntil(null);
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
            <>
              <div>
                <label className="mb-1 block text-xs text-zinc-500">
                  Expira em
                </label>
                <DatePicker
                  selected={freeUntil}
                  onChange={(date: Date | null) => setFreeUntil(date)}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                  placeholderText="Selecione a data"
                  className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
                  wrapperClassName="w-full"
                  popperClassName="z-50"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-zinc-500">
                  🛠️ Funcionalidades liberadas
                </label>
                <div className="space-y-2 rounded-xl border border-white/10 bg-zinc-800/50 p-3">
                  {/* Products */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Limite de produtos</span>
                    <input
                      type="number"
                      min={1}
                      max={9999}
                      value={freeFeatures.max_products}
                      onChange={(e) =>
                        setFreeFeatures({ ...freeFeatures, max_products: Number(e.target.value) })
                      }
                      className="w-20 rounded-lg border border-white/10 bg-zinc-800 px-2 py-1 text-center text-sm text-white outline-none focus:border-violet-500"
                    />
                  </div>

                  {/* Groups */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Grupos de disparo</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={freeFeatures.max_groups}
                      onChange={(e) =>
                        setFreeFeatures({ ...freeFeatures, max_groups: Number(e.target.value) })
                      }
                      className="w-20 rounded-lg border border-white/10 bg-zinc-800 px-2 py-1 text-center text-sm text-white outline-none focus:border-violet-500"
                    />
                  </div>

                  {/* Toggles */}
                  {[
                    { key: "has_whatsapp", label: "WhatsApp 1:1" },
                    { key: "has_dashboard", label: "Relatórios (gráficos)" },
                    { key: "has_checkout", label: "Checkout ASAAS" },
                    { key: "has_instagram", label: "Instagram" },
                    { key: "has_custom_domain", label: "Domínio próprio" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">{label}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setFreeFeatures({
                            ...freeFeatures,
                            [key]: !freeFeatures[key as keyof typeof freeFeatures],
                          })
                        }
                        className={`relative h-6 w-11 rounded-full transition-colors ${
                          freeFeatures[key as keyof typeof freeFeatures]
                            ? "bg-violet-600"
                            : "bg-zinc-700"
                        }`}
                      >
                        <span
                          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                            freeFeatures[key as keyof typeof freeFeatures]
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

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
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [successToast, setSuccessToast] = useState<{ name: string; password: string } | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const showSuccess = (name: string, password: string) => {
    setSuccessToast({ name, password });
    setTimeout(() => setSuccessToast(null), 8000);
  };

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

  const handleDeleteClient = async (id: number) => {
    setConfirmDeleteId(null);
    try {
      const res = await fetch(`/api/admin/clients?id=${id}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        onError(data.error || "Erro ao excluir");
        return;
      }

      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      onError(err instanceof Error ? err.message : "Erro ao excluir");
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
        <div
          className="overflow-x-auto rounded-2xl border border-white/5"
          onClick={() => setConfirmDeleteId(null)}
        >
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-zinc-900">
                <th className="px-4 py-3 font-medium text-zinc-400">Nome</th>
                <th className="px-4 py-3 font-medium text-zinc-400">Plano</th>
                <th className="px-4 py-3 font-medium text-zinc-400">Status</th>
                <th className="px-4 py-3 font-medium text-zinc-400">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <>
                <tr
                  key={client.id}
                  className="border-b border-white/5 transition-colors hover:bg-zinc-900/50"
                >
                  <td className="px-4 py-3 font-medium">{client.name}</td>
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
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {confirmDeleteId === client.id ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClient(client.id);
                          }}
                          className="rounded-lg border border-red-500/40 bg-red-500/30 px-2 py-1 text-xs font-medium text-white transition-all hover:bg-red-500/50"
                        >
                          Confirmar
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteId(client.id);
                          }}
                          className="rounded-lg border border-red-500/20 bg-red-500/10 px-2 py-1 text-xs text-red-400 transition-all hover:bg-red-500/30"
                        >
                          Excluir
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedRow(expandedRow === client.id ? null : client.id);
                        }}
                        className="rounded-lg border border-white/10 bg-zinc-800 px-2 py-1 text-xs text-zinc-400 transition-all hover:text-white"
                      >
                        {expandedRow === client.id ? "▲" : "▼"}
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedRow === client.id && (
                  <tr key={`${client.id}-expanded`} className="border-b border-white/5 bg-zinc-900/30">
                    <td colSpan={4} className="px-6 py-4">
                      <div className="mb-4 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        <div>
                          <span className="text-zinc-500">Plano:</span>{" "}
                          <span className="font-medium text-white">{PLAN_LABELS[client.plan]}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500">Status:</span>{" "}
                          <span className="font-medium text-white">
                            {client.status === "active"
                              ? "Ativo"
                              : client.status === "suspended"
                              ? "Suspenso"
                              : "Cancelado"}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500">E-mail:</span>{" "}
                          <span className="text-white">{client.email}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500">Cadastro:</span>{" "}
                          <span className="text-zinc-400">{formatDate(client.created_at)}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500">WhatsApp:</span>{" "}
                          <span className="text-violet-400">{client.whatsapp}</span>
                        </div>
                        {client.free_until ? (
                          <div>
                            <span className="text-zinc-500">Expira em:</span>{" "}
                            <span className="text-amber-400">
                              {new Date(client.free_until).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                        ) : (
                          <div />
                        )}
                      </div>

                      <div className="border-t border-white/5 pt-3">
                        <p className="mb-2 text-sm font-medium text-zinc-500">
                          📦 Funcionalidades do plano
                        </p>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
                          {(() => {
                            const features = client.features || getDefaultFeatures(client.plan);
                            const items: { key: keyof ClientFeatures; label: string }[] = [
                              { key: "has_whatsapp", label: "WhatsApp 1:1" },
                              { key: "has_dashboard", label: "Relatórios (gráficos)" },
                              { key: "has_checkout", label: "Checkout ASAAS" },
                              { key: "has_instagram", label: "Instagram" },
                              { key: "has_custom_domain", label: "Domínio próprio" },
                              { key: "max_products", label: "Limite de produtos" },
                              { key: "max_groups", label: "Grupos de disparo" },
                            ];
                            return items.map(({ key, label }) => {
                              const val = features[key];
                              const isEnabled = typeof val === "boolean" ? val : (val as number) > 0;
                              const suffix =
                                typeof val === "number"
                                  ? val === 999999
                                    ? "ilimitado"
                                    : String(val)
                                  : null;
                              return (
                                <div key={key} className="flex items-center gap-2 text-sm">
                                  {isEnabled ? (
                                    <span className="text-green-400">✅</span>
                                  ) : (
                                    <span className="text-zinc-600">🔒</span>
                                  )}
                                  <span className={isEnabled ? "text-zinc-300" : "text-zinc-600"}>
                                    {label}
                                    {suffix !== null && (
                                      <span className="ml-1 text-zinc-500">({suffix})</span>
                                    )}
                                  </span>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Success toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-in slide-in-from-right rounded-2xl border border-green-500/20 bg-zinc-900 p-4 shadow-2xl">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-lg">✅</span>
            <span className="font-medium text-white">Cliente cadastrado!</span>
          </div>
          <p className="mb-2 text-sm text-zinc-400">{successToast.name}</p>
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-3">
            <p className="mb-1 text-xs text-violet-400">🔑 Senha temporária</p>
            <div className="flex items-center gap-2">
              <p className="flex-1 select-all font-mono text-base font-bold text-white">
                {successToast.password}
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(successToast.password);
                }}
                className="rounded-lg border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-xs text-violet-400 transition-all hover:bg-violet-500/20"
              >
                Copiar
              </button>
            </div>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="mt-2 text-xs text-zinc-500 hover:text-zinc-300"
          >
            Dispensar
          </button>
        </div>
      )}

      <CreateClientModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={fetchClients}
        onSuccess={(name, password) => showSuccess(name, password)}
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
