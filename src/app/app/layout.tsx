"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [clientName, setClientName] = useState("");
  const [clientPlan, setClientPlan] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("client_token");
    const name = sessionStorage.getItem("client_name");
    const plan = sessionStorage.getItem("client_plan");

    if (!token) {
      router.replace("/login");
      return;
    }

    // Verify session is still valid
    fetch("/api/auth/me", {
      headers: { authorization: `Bearer ${token}` },
    }).then((res) => {
      if (!res.ok) {
        sessionStorage.clear();
        router.replace("/login");
        return;
      }
      setClientName(name || "");
      setClientPlan(plan || "");
      setChecking(false);
    });
  }, [router]);

  const handleLogout = async () => {
    const token = sessionStorage.getItem("client_token");
    if (token) {
      await fetch("/api/auth/me", {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
      });
    }
    sessionStorage.clear();
    router.replace("/login");
  };

  if (checking) {
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
            {clientPlan && (
              <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-0.5 text-xs font-medium text-violet-400">
                {clientPlan === "basic"
                  ? "Básico"
                  : clientPlan === "evolution"
                  ? "Evolution"
                  : "Pro"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400">{clientName}</span>
            <button
              onClick={handleLogout}
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
          <a
            href="/app/dashboard"
            className={`px-5 py-3 text-sm font-medium transition-all ${
              pathname === "/app/dashboard"
                ? "border-b-2 border-violet-500 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Dashboard
          </a>
          <a
            href="/app/produtos"
            className="px-5 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-all"
          >
            Produtos
          </a>
          <a
            href="/app/leads"
            className="px-5 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-all"
          >
            Leads
          </a>
          <a
            href="/app/configuracoes"
            className="px-5 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-all"
          >
            Configurações
          </a>
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
