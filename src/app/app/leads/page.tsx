"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/core/infrastructure/auth-context";
import { Users, Filter, Download, Search, CheckCircle, Clock, ShoppingBag, MessageCircle, UserPlus, Trash2, Mail, Bot } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  origin: "compra" | "newsletter" | "ia_chat" | "manual";
  qualified: boolean;
  product_interest: string;
  total: number | null;
  created_at: string;
}

const ORIGIN_CONFIG: Record<string, { label: string; icon: React.ReactNode }> = {
  compra: { label: "Compra", icon: <ShoppingBag className="h-3 w-3" /> },
  newsletter: { label: "Newsletter", icon: <Mail className="h-3 w-3" /> },
  ia_chat: { label: "IA Chat", icon: <Bot className="h-3 w-3" /> },
  manual: { label: "Manual", icon: <UserPlus className="h-3 w-3" /> },
};

export default function LeadsPage() {
  const { token } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [originFilter, setOriginFilter] = useState("todas");
  const [qualifiedFilter, setQualifiedFilter] = useState("todos");
  const [searchText, setSearchText] = useState("");

  const fetchLeads = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const params = new URLSearchParams();
    if (originFilter !== "todas") params.set("origin", originFilter);
    if (qualifiedFilter !== "todos") params.set("qualified", qualifiedFilter);
    if (searchText) params.set("search", searchText);

    try {
      const res = await fetch(`/api/leads?${params}`, { headers: { authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Erro ao carregar leads");
      setLeads(await res.json());
    } catch {} finally { setLoading(false); }
  }, [token, originFilter, qualifiedFilter, searchText]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleDelete = async (id: string) => {
    const [type, realId] = id.split("_");
    try {
      const res = await fetch(`/api/leads?id=${realId}&type=${type}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` },
      });
      if (res.ok) setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch {}
  };

  const exportCSV = () => {
    const header = "Nome;E-mail;Telefone;Origem;Qualificado;Produto;Data\n";
    const rows = leads.map((l) =>
      `"${l.name}";"${l.email}";"${l.whatsapp}";"${ORIGIN_CONFIG[l.origin]?.label || l.origin}";"${l.qualified ? "Sim" : "Não"}";"${l.product_interest}";"${new Date(l.created_at).toLocaleDateString("pt-BR")}"`
    ).join("\n");
    const blob = new Blob(["\uFEFF" + header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "leads.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold"><Users className="h-6 w-6 text-violet-400" /> Leads</h1>
          <p className="mt-1 text-sm text-zinc-500">{leads.length} lead{leads.length !== 1 && "s"}</p>
        </div>
        {leads.length > 0 && (
          <button onClick={exportCSV}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-800 px-4 py-2 text-sm text-zinc-400 hover:text-white">
            <Download className="h-4 w-4" /> Exportar CSV
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-zinc-500"><Filter className="h-3 w-3" /> Filtros</div>
        <select value={originFilter} onChange={(e) => setOriginFilter(e.target.value)}
          className="rounded-lg border border-white/10 bg-zinc-800 px-3 py-1.5 text-xs text-white outline-none focus:border-violet-500">
          <option value="todas">Todas origens</option>
          <option value="compra">Compra</option>
          <option value="newsletter">Newsletter</option>
          <option value="ia_chat">IA Chat</option>
        </select>
        <select value={qualifiedFilter} onChange={(e) => setQualifiedFilter(e.target.value)}
          className="rounded-lg border border-white/10 bg-zinc-800 px-3 py-1.5 text-xs text-white outline-none focus:border-violet-500">
          <option value="todos">Todos</option>
          <option value="sim">Qualificados</option>
          <option value="nao">Não qualificados</option>
        </select>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)}
            placeholder="Buscar por nome ou telefone..."
            className="w-full rounded-lg border border-white/10 bg-zinc-800 py-1.5 pl-8 pr-3 text-xs text-white outline-none focus:border-violet-500" />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-zinc-500">Carregando...</div>
      ) : leads.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-zinc-900 p-12 text-center">
          <Users className="mx-auto mb-4 h-12 w-12 text-zinc-600" />
          <h2 className="mb-2 text-xl font-bold text-white">Nenhum lead encontrado</h2>
          <p className="text-sm text-zinc-500">Os leads capturados aparecerão aqui.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/5">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-zinc-900">
                <th className="px-4 py-3 font-medium text-zinc-400">Nome</th>
                <th className="px-4 py-3 font-medium text-zinc-400">E-mail</th>
                <th className="px-4 py-3 font-medium text-zinc-400">Telefone</th>
                <th className="px-4 py-3 font-medium text-zinc-400">Origem</th>
                <th className="px-4 py-3 font-medium text-zinc-400">Qualificado</th>
                <th className="px-4 py-3 font-medium text-zinc-400">Produto</th>
                <th className="px-4 py-3 font-medium text-zinc-400">Data</th>
                <th className="px-4 py-3 font-medium text-zinc-400">Ações</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const origin = ORIGIN_CONFIG[lead.origin] || ORIGIN_CONFIG.manual;
                return (
                  <tr key={lead.id} className="border-b border-white/5 transition-colors hover:bg-zinc-900/50">
                    <td className="px-4 py-3 font-medium text-white">{lead.name}</td>
                    <td className="px-4 py-3 text-zinc-400">{lead.email || "-"}</td>
                    <td className="px-4 py-3">
                      <a href={`https://wa.me/${lead.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                        className="text-violet-400 hover:text-violet-300">{lead.whatsapp}</a>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
                        {origin.icon}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {lead.qualified ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-xs text-green-400">
                          <CheckCircle className="h-3 w-3" /> Sim
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">
                          <Clock className="h-3 w-3" /> Não
                        </span>
                      )}
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-zinc-400" title={lead.product_interest}>
                      {lead.product_interest || "-"}
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
                      {new Date(lead.created_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(lead.id)}
                        className="rounded-lg border border-red-500/20 bg-red-500/10 px-2 py-1 text-xs text-red-400 hover:bg-red-500/30">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
