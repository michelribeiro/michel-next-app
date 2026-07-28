"use client";

import { useState } from "react";

export function FinalCTA() {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [segmento, setSegmento] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !whatsapp) return;

    setLoading(true);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          whatsapp,
          segmento,
          conversa: "Lead do formulário CTA final",
        }),
      });
      setSent(true);
    } catch {
      // Silent
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="cta" className="border-t border-white/5 px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div
          className="relative overflow-hidden rounded-3xl p-8 md:p-16"
          style={{ background: "rgb(17, 17, 17)", border: "1px solid rgb(31, 31, 31)" }}
        >
          {/* Glows */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-600/20 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-blue-600/20 blur-[80px]" />

          <div className="relative">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white md:text-4xl">
                Quer levar isso pro seu negócio?
              </h2>
              <p className="mt-4 text-lg text-zinc-400">
                Deixe seu contato que eu te explico como funciona
              </p>
            </div>

            {sent ? (
              <div className="mt-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                  <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="mt-6 text-xl font-medium text-white">
                  Recebi! 🚀
                </p>
                <p className="mt-2 text-zinc-400">
                  Em breve entro em contato pelo WhatsApp.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mx-auto mt-12 max-w-md space-y-4">
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-zinc-800 px-5 py-3.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-violet-500"
                />
                <input
                  type="tel"
                  placeholder="Seu WhatsApp com DDD"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-zinc-800 px-5 py-3.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-violet-500"
                />
                <select
                  value={segmento}
                  onChange={(e) => setSegmento(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-800 px-5 py-3.5 text-sm text-white outline-none transition-colors focus:border-violet-500"
                >
                  <option value="">Qual seu segmento?</option>
                  <option value="Loja física">Loja física</option>
                  <option value="Loja online">Loja online</option>
                  <option value="Serviços">Prestador de serviço</option>
                  <option value="Alimentação">Alimentação</option>
                  <option value="Outro">Outro</option>
                </select>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-600/35 transition-all hover:shadow-xl hover:shadow-violet-600/45 active:scale-95 disabled:opacity-50"
                >
                  {loading ? "Enviando..." : "Quero meu robô vendedor →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
