"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [clientName, setClientName] = useState("");

  useEffect(() => {
    const name = sessionStorage.getItem("client_name");
    setClientName(name || "Cliente");
  }, []);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Olá, {clientName}! 👋</h1>
      <p className="mb-8 text-zinc-500">
        Bem-vindo ao seu painel de controle. Aqui você gerencia seus produtos,
        acompanha leads e configura seu robô vendedor.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Card Leads */}
        <div className="rounded-2xl border border-white/5 bg-zinc-900 p-6">
          <div className="mb-3 text-3xl">📋</div>
          <h3 className="mb-1 text-lg font-semibold">Leads</h3>
          <p className="text-sm text-zinc-500">
            Clientes que interagiram com sua página
          </p>
          <p className="mt-4 text-3xl font-bold text-violet-400">0</p>
          <p className="text-xs text-zinc-600">nenhum lead ainda</p>
        </div>

        {/* Card Produtos */}
        <div className="rounded-2xl border border-white/5 bg-zinc-900 p-6">
          <div className="mb-3 text-3xl">📦</div>
          <h3 className="mb-1 text-lg font-semibold">Produtos</h3>
          <p className="text-sm text-zinc-500">
            Seu catálogo de produtos cadastrados
          </p>
          <p className="mt-4 text-3xl font-bold text-violet-400">0</p>
          <p className="text-xs text-zinc-600">nenhum produto cadastrado</p>
        </div>

        {/* Card Plano */}
        <div className="rounded-2xl border border-white/5 bg-zinc-900 p-6">
          <div className="mb-3 text-3xl">⚡</div>
          <h3 className="mb-1 text-lg font-semibold">Status do Plano</h3>
          <p className="text-sm text-zinc-500">
            Sua assinatura e módulos ativos
          </p>
          <p className="mt-4 inline-block rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-sm font-medium text-green-400">
            ✅ Ativo
          </p>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-8 rounded-2xl border border-white/5 bg-zinc-900 p-6">
        <h3 className="mb-4 text-lg font-semibold">🚀 Primeiros passos</h3>
        <ol className="space-y-3 text-sm text-zinc-400">
          <li className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-400">
              1
            </span>
            Cadastre seus produtos no catálogo
          </li>
          <li className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-400">
              2
            </span>
            Personalize as cores e o tom da sua IA
          </li>
          <li className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-400">
              3
            </span>
            Compartilhe seu link e comece a vender!
          </li>
        </ol>
      </div>
    </div>
  );
}
