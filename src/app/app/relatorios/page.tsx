"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/core/infrastructure/auth-context";
import { BarChart3, TrendingUp, Users, ShoppingCart, DollarSign, ArrowUp, ArrowDown, TrendingDown, Activity, Target, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from "recharts";

// ─── Cores do tema ───────────────────────────────────────

const COLORS = {
  violet: "#8B5CF6",
  blue: "#3B82F6",
  green: "#22C55E",
  amber: "#F59E0B",
  cyan: "#06B6D4",
  pink: "#EC4899",
  zinc: "#71717A",
};

const CHART_COLORS = [COLORS.violet, COLORS.blue, COLORS.green, COLORS.amber, COLORS.cyan, COLORS.pink];

// ─── Tipos ───────────────────────────────────────────────

interface Order {
  id: number;
  customer_name: string;
  customer_whatsapp: string;
  items: { name: string; price: number; quantity: number }[];
  total: number;
  payment_method: string;
  payment_status: string;
  created_at: string;
}

interface Lead {
  id: string;
  name: string;
  origin: string;
  qualified: boolean;
  created_at: string;
}

// ─── Tooltip customizado ─────────────────────────────────

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; color?: string }[]; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm shadow-xl">
      <p className="mb-1 text-zinc-400">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-medium text-white" style={{ color: p.color }}>
          R$ {p.value.toFixed(2).replace(".", ",")}
        </p>
      ))}
    </div>
  );
}

function CustomPieTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number; fill?: string }[] }) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm shadow-xl">
      <p className="text-white">{payload[0].name}: <span className="font-bold">{payload[0].value}</span></p>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────

export default function RelatoriosPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"7" | "30" | "90">("30");

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const [oRes, lRes] = await Promise.all([
        fetch("/api/orders", { headers: { authorization: `Bearer ${token}` } }),
        fetch("/api/leads", { headers: { authorization: `Bearer ${token}` } }),
      ]);
      if (oRes.ok) setOrders(await oRes.json());
      if (lRes.ok) {
        const data = await lRes.json();
        setLeads(data);
      }
    } catch {} finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return <div className="py-20 text-center text-zinc-500">Carregando...</div>;
  }

  // ─── Cálculos ──────────────────────────────────────────

  const now = new Date();
  const periodDays = Number(period);
  const periodStart = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);

  const filteredOrders = orders.filter((o) => new Date(o.created_at) >= periodStart);
  const confirmedOrders = filteredOrders.filter((o) => o.payment_status === "CONFIRMED" || o.payment_status === "RECEIVED");
  const revenue = confirmedOrders.reduce((s, o) => s + o.total, 0);
  const totalSales = confirmedOrders.length;
  const totalLeads = leads.filter((l) => new Date(l.created_at) >= periodStart).length;
  const qualifiedLeads = leads.filter((l) => new Date(l.created_at) >= periodStart && l.qualified).length;

  // Receita por método
  const pixRevenue = confirmedOrders.filter((o) => o.payment_method === "PIX").reduce((s, o) => s + o.total, 0);
  const cardRevenue = confirmedOrders.filter((o) => o.payment_method !== "PIX").reduce((s, o) => s + o.total, 0);

  // Dados do gráfico de receita (por dia)
  const dailyMap = new Map<string, number>();
  confirmedOrders.forEach((o) => {
    const day = new Date(o.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    dailyMap.set(day, (dailyMap.get(day) || 0) + o.total);
  });
  const revenueChart = Array.from(dailyMap.entries())
    .map(([date, value]) => ({ date, value: Math.round(value * 100) / 100 }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Top produtos
  const productMap = new Map<string, number>();
  confirmedOrders.forEach((o) => {
    (o.items || []).forEach((item) => {
      productMap.set(item.name, (productMap.get(item.name) || 0) + item.quantity);
    });
  });
  const topProducts = Array.from(productMap.entries())
    .map(([name, qty]) => ({ name: name.length > 20 ? name.slice(0, 20) + "..." : name, quantity: qty }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Leads por origem (apenas do período)
  const originMap = new Map<string, number>();
  leads.filter((l) => new Date(l.created_at) >= periodStart).forEach((l) => {
    const label = l.origin === "compra" ? "Compra" : l.origin === "newsletter" ? "Newsletter" : "IA Chat";
    originMap.set(label, (originMap.get(label) || 0) + 1);
  });
  const originChart = Array.from(originMap.entries()).map(([name, value]) => ({ name, value }));

  // Mês anterior (pro comparativo)
  const prevStart = new Date(periodStart.getTime() - periodDays * 24 * 60 * 60 * 1000);
  const prevOrders = orders.filter((o) => {
    const d = new Date(o.created_at);
    return d >= prevStart && d < periodStart;
  });
  const prevRevenue = prevOrders.filter((o) => o.payment_status === "CONFIRMED" || o.payment_status === "RECEIVED")
    .reduce((s, o) => s + o.total, 0);
  const revenueDiff = prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue * 100).toFixed(1) : "0";

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold"><BarChart3 className="h-6 w-6 text-violet-400" /> Relatórios</h1>
        <select value={period} onChange={(e) => setPeriod(e.target.value as "7" | "30" | "90")}
          className="rounded-lg border border-white/10 bg-zinc-800 px-3 py-1.5 text-xs text-white outline-none focus:border-violet-500">
          <option value="7">Últimos 7 dias</option>
          <option value="30">Últimos 30 dias</option>
          <option value="90">Últimos 90 dias</option>
        </select>
      </div>

      {/* Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/5 bg-zinc-900 p-5">
          <div className="mb-2 flex items-center justify-between">
            <DollarSign className="h-5 w-5 text-violet-400" />
            <span className={`flex items-center gap-0.5 text-xs font-medium ${Number(revenueDiff) >= 0 ? "text-green-400" : "text-red-400"}`}>
              {Number(revenueDiff) >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {revenueDiff}%
            </span>
          </div>
          <p className="text-2xl font-bold text-white">R$ {revenue.toFixed(2).replace(".", ",")}</p>
          <p className="text-xs text-zinc-500">Faturamento do período</p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-zinc-900 p-5">
          <ShoppingCart className="mb-2 h-5 w-5 text-blue-400" />
          <p className="text-2xl font-bold text-white">{totalSales}</p>
          <p className="text-xs text-zinc-500">Vendas realizadas</p>
          {totalSales > 0 && <p className="mt-1 text-xs text-zinc-600">Ticket médio: R$ {(revenue / totalSales).toFixed(2).replace(".", ",")}</p>}
        </div>

        <div className="rounded-2xl border border-white/5 bg-zinc-900 p-5">
          <Users className="mb-2 h-5 w-5 text-green-400" />
          <p className="text-2xl font-bold text-white">{totalLeads}</p>
          <p className="text-xs text-zinc-500">Leads capturados</p>
          {totalLeads > 0 && <p className="mt-1 text-xs text-zinc-600">{qualifiedLeads} qualificados</p>}
        </div>

        <div className="rounded-2xl border border-white/5 bg-zinc-900 p-5">
          <TrendingUp className="mb-2 h-5 w-5 text-amber-400" />
          <p className="text-2xl font-bold text-white">{totalSales > 0 && totalLeads > 0 ? Math.round((totalSales / totalLeads) * 100) : 0}%</p>
          <p className="text-xs text-zinc-500">Taxa de conversão</p>
          {totalSales > 0 && pixRevenue > 0 && cardRevenue > 0 && (
            <p className="mt-1 text-xs text-zinc-600">PIX {Math.round((pixRevenue / revenue) * 100)}% | Cartão {Math.round((cardRevenue / revenue) * 100)}%</p>
          )}
        </div>
      </div>

      {/* Comparativo com período anterior */}
      {confirmedOrders.length > 0 && (
        <div className="mb-6 rounded-2xl border border-white/5 bg-zinc-900 p-5">
          <p className="mb-4 flex items-center gap-2 text-sm font-medium text-zinc-400"><TrendingUp className="h-4 w-4 text-violet-400" /> Comparativo</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-zinc-500">Período atual</p>
              <p className="text-lg font-bold text-white">R$ {revenue.toFixed(2).replace(".", ",")}</p>
              <p className="text-xs text-zinc-600">{totalSales} venda{totalSales !== 1 && "s"}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-zinc-500">Período anterior</p>
              <p className="text-lg font-bold text-zinc-400">R$ {prevRevenue.toFixed(2).replace(".", ",")}</p>
              <p className="text-xs text-zinc-600">{prevOrders.filter((o) => o.payment_status === "CONFIRMED" || o.payment_status === "RECEIVED").length} venda(s)</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-500">Diferença</p>
              <p className={`text-lg font-bold ${Number(revenueDiff) >= 0 ? "text-green-400" : "text-red-400"}`}>
                {Number(revenueDiff) >= 0 ? "+" : ""}{revenueDiff}%
              </p>
              <div className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${Number(revenueDiff) >= 0 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                {Number(revenueDiff) >= 0 ? <ArrowUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Number(revenueDiff) >= 0 ? "Crescendo" : "Caindo"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="rounded-2xl border border-white/5 bg-zinc-900 p-6">
          <h3 className="mb-6 flex items-center gap-2 text-sm font-medium text-zinc-400"><Activity className="h-4 w-4 text-violet-400" /> Receita por dia</h3>
          {revenueChart.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-zinc-600">Nenhuma venda no período</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: "#71717A", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#71717A", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="value" stroke={COLORS.violet} strokeWidth={2} dot={{ fill: COLORS.violet, r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Products */}
        <div className="rounded-2xl border border-white/5 bg-zinc-900 p-6">
          <h3 className="mb-6 flex items-center gap-2 text-sm font-medium text-zinc-400"><Target className="h-4 w-4 text-violet-400" /> Produtos mais vendidos</h3>
          {topProducts.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-zinc-600">Nenhum produto vendido</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topProducts} layout="vertical">
                <XAxis type="number" tick={{ fill: "#71717A", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: "#71717A", fontSize: 11 }} axisLine={false} tickLine={false} width={140} />
                <Tooltip content={({ active, payload }) => active && payload ? (
                  <div className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm shadow-xl">
                    <p className="text-white">{payload[0].payload.name}: <span className="font-bold text-violet-400">{payload[0].value} unidade(s)</span></p>
                  </div>
                ) : null} />
                <Bar dataKey="quantity" radius={[0, 6, 6, 0]} barSize={20}>
                  {topProducts.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Leads by Origin */}
        <div className="rounded-2xl border border-white/5 bg-zinc-900 p-6">
          <h3 className="mb-6 flex items-center gap-2 text-sm font-medium text-zinc-400"><Users className="h-4 w-4 text-violet-400" /> Leads por origem</h3>
          {originChart.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-zinc-600">Nenhum lead no período</div>
          ) : (
            <div className="flex items-center gap-8">
              <ResponsiveContainer width="60%" height={240}>
                <PieChart>
                  <Pie data={originChart} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={3}>
                    {originChart.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 text-sm">
                {originChart.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                    <span className="text-zinc-400">{item.name}</span>
                    <span className="font-medium text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Sales */}
        <div className="rounded-2xl border border-white/5 bg-zinc-900 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-zinc-400"><Clock className="h-4 w-4 text-violet-400" /> Últimas vendas</h3>
          {confirmedOrders.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-zinc-600">Nenhuma venda no período</div>
          ) : (
            <div className="space-y-3">
              {confirmedOrders.slice(0, 10).map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-xl bg-zinc-800/50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{order.customer_name}</p>
                    <p className="text-xs text-zinc-500">
                      {order.items?.map((i) => i.name).join(", ").slice(0, 40)}...
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-violet-400">R$ {order.total.toFixed(2).replace(".", ",")}</p>
                    <p className="text-xs text-zinc-600">{new Date(order.created_at).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
