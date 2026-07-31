"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/core/infrastructure/auth-context";

function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { client, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="text-zinc-500">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">🤖 Robô Vendedor</span>
            {client?.plan && (
              <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-0.5 text-xs font-medium text-violet-400">
                {client.plan === "basic"
                  ? "Básico"
                  : client.plan === "evolution"
                  ? "Evolution"
                  : "Pro"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400">{client?.name}</span>
            <button
              onClick={logout}
              className="rounded-lg border border-white/10 px-4 py-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-white/5">
        <div className="mx-auto flex max-w-6xl gap-1 px-6">
          <Link
            href="/app/dashboard"
            className={`px-5 py-3 text-sm font-medium transition-all ${
              pathname === "/app/dashboard"
                ? "border-b-2 border-violet-500 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/app/produtos"
            className={`px-5 py-3 text-sm font-medium transition-all ${
              pathname === "/app/produtos"
                ? "border-b-2 border-violet-500 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Produtos
          </Link>
          {((client?.plan || sessionStorage.getItem("client_plan")) !== "basic" && (client?.plan || sessionStorage.getItem("client_plan")) !== "free") && (
            <Link
              href="/app/relatorios"
              className={`px-5 py-3 text-sm font-medium transition-all ${
                pathname === "/app/relatorios"
                  ? "border-b-2 border-violet-500 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Relatórios
            </Link>
          )}
          <Link
            href="/app/leads"
            className={`px-5 py-3 text-sm font-medium transition-all ${
              pathname === "/app/leads"
                ? "border-b-2 border-violet-500 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Leads
          </Link>
          <Link
            href="/app/pedidos"
            className={`px-5 py-3 text-sm font-medium transition-all ${
              pathname === "/app/pedidos"
                ? "border-b-2 border-violet-500 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Pedidos
          </Link>
          <Link
            href="/app/pagamentos"
            className={`px-5 py-3 text-sm font-medium transition-all ${
              pathname === "/app/pagamentos"
                ? "border-b-2 border-violet-500 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Pagamentos
          </Link>
          <Link
            href="/app/configuracoes"
            className={`px-5 py-3 text-sm font-medium transition-all ${
              pathname === "/app/configuracoes"
                ? "border-b-2 border-violet-500 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Configurações
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppContent>{children}</AppContent>
    </AuthProvider>
  );
}
