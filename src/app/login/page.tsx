"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao fazer login");
      }

      // Save session token
      sessionStorage.setItem("client_token", data.token);
      sessionStorage.setItem("client_name", data.client.name);
      sessionStorage.setItem("client_plan", data.client.plan);

      router.push("/app/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-6">
      <div className="w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-2xl">
            🤖
          </div>
          <h1 className="text-xl font-bold text-white">Robô Vendedor</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Acesse seu painel de controle
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-zinc-900 p-8"
        >
          <div className="mb-4">
            <label className="mb-1 block text-xs text-zinc-500">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500"
              placeholder="seu@email.com"
              required
              autoFocus
            />
          </div>

          <div className="mb-6">
            <label className="mb-1 block text-xs text-zinc-500">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500"
              placeholder="Sua senha"
              required
            />
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3 text-sm font-medium text-white transition-all disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Robô Vendedor &mdash; Seu atendente IA 24h
        </p>
      </div>
    </div>
  );
}
