"use client";

import { CreditCard, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function PagamentosPage() {
  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">💳 Pagamentos</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/5 bg-zinc-900 p-5">
          <CheckCircle className="mb-3 h-5 w-5 text-green-400" />
          <p className="text-2xl font-bold text-white">Ativo</p>
          <p className="text-xs text-zinc-500">Status da assinatura</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-zinc-900 p-5">
          <CreditCard className="mb-3 h-5 w-5 text-violet-400" />
          <p className="text-2xl font-bold text-white">R$ 0</p>
          <p className="text-xs text-zinc-500">Próximo vencimento</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-zinc-900 p-5">
          <Clock className="mb-3 h-5 w-5 text-amber-400" />
          <p className="text-2xl font-bold text-white">—</p>
          <p className="text-xs text-zinc-500">Histórico de pagamentos</p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/5 bg-zinc-900 p-8 text-center">
        <div className="mb-3 text-4xl">💳</div>
        <h2 className="mb-2 text-lg font-bold text-white">
          Pagamentos em breve
        </h2>
        <p className="text-sm text-zinc-500">
          Quando integrarmos o ASAAS, você verá aqui o histórico de pagamentos e faturas.
        </p>
      </div>
    </div>
  );
}
