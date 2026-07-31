"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/core/infrastructure/auth-context";
import { ShoppingBag, CheckCircle, Clock, AlertCircle, Copy, ChevronDown, ChevronRight, MapPin, Package, Check, Receipt } from "lucide-react";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  customer_name: string;
  customer_whatsapp: string;
  customer_email: string;
  items: OrderItem[];
  total: number;
  payment_method: string;
  payment_status: string;
  invoice_url: string;
  pix_qrcode: string;
  pix_copy_paste: string;
  bank_slip_url: string;
  shipping_address: { cep?: string; address?: string; number?: string; neighborhood?: string; city?: string; state?: string } | null;
  delivery_status: string;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Aguardando pagamento", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  RECEIVED: { label: "Pago", color: "text-green-400 bg-green-500/10 border-green-500/20" },
  CONFIRMED: { label: "Confirmado", color: "text-green-400 bg-green-500/10 border-green-500/20" },
  OVERDUE: { label: "Vencido", color: "text-red-400 bg-red-500/10 border-red-500/20" },
  CANCELED: { label: "Cancelado", color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20" },
};

const DELIVERY_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: "Aguardando confirmação", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  confirmed: { label: "Endereço confirmado", color: "text-green-400 bg-green-500/10 border-green-500/20" },
};

export default function PedidosPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/orders", { headers: { authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Erro ao carregar pedidos");
      const data = await res.json();
      // Add delivery_status if missing
      setOrders(data.map((o: Order) => ({ ...o, delivery_status: o.delivery_status || "pending" })));
    } catch {} finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const copyPix = async (code: string, id: number) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const confirmAddress = async (orderId: number) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ delivery_status: "confirmed" }),
      });
      if (res.ok) {
        setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, delivery_status: "confirmed" } : o));
      }
    } catch {}
  };

  if (loading) return <div className="py-20 text-center text-zinc-500">Carregando...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-2xl font-bold"><Receipt className="h-6 w-6 text-violet-400" /> Pedidos</h1>
        <p className="mt-1 text-sm text-zinc-500">{orders.length} pedido{orders.length !== 1 && "s"}</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-zinc-900 p-12 text-center">
          <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-zinc-600" />
          <h2 className="mb-2 text-xl font-bold text-white">Nenhum pedido ainda</h2>
          <p className="text-sm text-zinc-500">Os pedidos aparecerão aqui.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = STATUS_CONFIG[order.payment_status] || STATUS_CONFIG.PENDING;
            const delivery = DELIVERY_CONFIG[order.delivery_status] || DELIVERY_CONFIG.pending;
            const isExpanded = expandedId === order.id;
            return (
              <div key={order.id} className="rounded-2xl border border-white/5 bg-zinc-900 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-zinc-800/50 transition-colors" onClick={() => setExpandedId(isExpanded ? null : order.id)}>
                  <div className="flex items-center gap-3">
                    {isExpanded ? <ChevronDown className="h-4 w-4 text-zinc-500" /> : <ChevronRight className="h-4 w-4 text-zinc-500" />}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{order.customer_name}</h3>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${status.color}`}>{status.label}</span>
                        {order.shipping_address && order.delivery_status === "confirmed" && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-xs text-green-400">
                            <Check className="h-3 w-3" /> Endereço OK
                          </span>
                        )}
                        {order.shipping_address && order.delivery_status !== "confirmed" && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">
                            ⏳ Endereço
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500">
                        {new Date(order.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-violet-400">R$ {order.total.toFixed(2).replace(".", ",")}</span>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-white/5 px-5 pb-5 pt-4">
                    {/* Items */}
                    <div className="mb-4">
                      <p className="mb-2 text-xs font-medium text-zinc-500 flex items-center gap-1"><Package className="h-3 w-3" /> Itens do pedido</p>
                      <div className="space-y-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-3 py-2">
                            <div>
                              <p className="text-sm font-medium text-white">{item.name}</p>
                              <p className="text-xs text-zinc-600">Código: #{order.id}-{i + 1}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-zinc-300">{item.quantity > 1 ? `${item.quantity}x ` : ""}{item.price.toFixed(2).replace(".", ",")}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex justify-between rounded-lg bg-zinc-800/80 px-3 py-2">
                        <span className="text-sm font-medium text-white">Total</span>
                        <span className="text-sm font-bold text-violet-400">R$ {order.total.toFixed(2).replace(".", ",")}</span>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shipping_address && (
                      <div className="mb-4">
                        <p className="mb-2 text-xs font-medium text-zinc-500 flex items-center gap-1"><MapPin className="h-3 w-3" /> Endereço de entrega</p>
                        <div className="rounded-lg bg-zinc-800/50 px-3 py-2">
                          <p className="text-sm text-white">
                            {order.shipping_address.address}, {order.shipping_address.number}
                          </p>
                          <p className="text-xs text-zinc-400">
                            {order.shipping_address.neighborhood} - {order.shipping_address.city}/{order.shipping_address.state}
                          </p>
                          {order.shipping_address.cep && (
                            <p className="text-xs text-zinc-500">CEP: {order.shipping_address.cep}</p>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs ${delivery.color}`}>
                            {delivery.label}
                          </span>
                          {order.delivery_status !== "confirmed" && (
                            <button onClick={() => confirmAddress(order.id)}
                              className="flex items-center gap-1 rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-400 hover:bg-green-500/20">
                              <Check className="h-3 w-3" /> Confirmar endereço
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* PIX */}
                    {order.payment_method === "PIX" && order.pix_copy_paste && (
                      <div className="mb-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
                        <p className="mb-1 text-xs font-medium text-cyan-400">📱 PIX Copia e Cola</p>
                        <p className="mb-2 break-all font-mono text-xs text-zinc-400">{order.pix_copy_paste}</p>
                        <button onClick={() => copyPix(order.pix_copy_paste, order.id)}
                          className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300">
                          {copiedId === order.id ? "✅ Copiado!" : <><Copy className="h-3 w-3" /> Copiar código</>}
                        </button>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <a href={`https://wa.me/${order.customer_whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-lg border border-white/10 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-400 hover:text-white">
                        {order.customer_whatsapp}
                      </a>
                      {order.invoice_url && (
                        <a href={order.invoice_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 rounded-lg border border-white/10 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-400 hover:text-white">
                          Fatura
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
