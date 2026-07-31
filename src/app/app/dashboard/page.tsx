"use client";

import { useAuth } from "@/core/infrastructure/auth-context";
import { Users, Package, Zap, Smartphone, Palette, Share2, Rocket } from "lucide-react";

export default function DashboardPage() {
  const { client } = useAuth();

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Olá, {client?.name || "Cliente"}! 👋</h1>
      <p className="mb-8 text-zinc-500">
        Bem-vindo ao seu painel de controle. Aqui você gerencia seus produtos,
        acompanha leads e configura seu robô vendedor.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-white/5 bg-zinc-900 p-6">
          <Users className="mb-3 h-6 w-6 text-violet-400" />
          <h3 className="mb-1 text-lg font-semibold">Leads</h3>
          <p className="text-sm text-zinc-500">
            Clientes que interagiram com sua página
          </p>
          <p className="mt-4 text-3xl font-bold text-violet-400">0</p>
          <p className="text-xs text-zinc-600">nenhum lead ainda</p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-zinc-900 p-6">
          <Package className="mb-3 h-6 w-6 text-blue-400" />
          <h3 className="mb-1 text-lg font-semibold">Produtos</h3>
          <p className="text-sm text-zinc-500">
            Seu catálogo de produtos cadastrados
          </p>
          <p className="mt-4 text-3xl font-bold text-violet-400">0</p>
          <p className="text-xs text-zinc-600">nenhum produto cadastrado</p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-zinc-900 p-6">
          <Zap className="mb-3 h-6 w-6 text-green-400" />
          <h3 className="mb-1 text-lg font-semibold">Status do Plano</h3>
          <p className="text-sm text-zinc-500">
            Sua assinatura e módulos ativos
          </p>
          <p className="mt-4 inline-block rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-sm font-medium text-green-400">
            ✅ Ativo
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/5 bg-zinc-900 p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold"><Rocket className="h-5 w-5 text-violet-400" /> Primeiros passos</h3>
        <ol className="space-y-4 text-sm text-zinc-400">
          <li className="flex items-start gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-400">
              <Package className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="text-white">Cadastre seus produtos no catálogo</p>
              <p className="text-xs text-zinc-600">Vá em Produtos e adicione seus itens</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-400">
              <Smartphone className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="text-white">Configure o WhatsApp e chave PIX</p>
              <p className="text-xs text-zinc-600">Em Configurações, cadastre o contato e PIX pra receber</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-400">
              <Palette className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="text-white">Personalize a aparência da sua página</p>
              <p className="text-xs text-zinc-600">Escolha cor, imagem de fundo e logo em Configurações</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-400">
              <Share2 className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="text-white">Compartilhe seu link e comece a vender!</p>
              <p className="text-xs text-zinc-600">Divulgue sua página pros seus clientes</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}
