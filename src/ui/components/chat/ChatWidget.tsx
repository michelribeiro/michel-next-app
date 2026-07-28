"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@/ui/hooks/useChat";

interface ChatWidgetProps {
  inline?: boolean;
}

export function ChatWidget({ inline = false }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    isLoading,
    showLeadForm,
    leadSent,
    limitReached,
    leadInfo,
    setLeadInfo,
    sendMessage,
    submitLead,
    detectLeadIntent,
    setShowLeadForm,
  } = useChat();

  useEffect(() => {
    // Only scroll within the chat container, not the page
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, showLeadForm]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput("");
    await sendMessage(userMsg);
    detectLeadIntent(userMsg);
  };

  const chatContent = (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
            R
          </div>
          <div>
            <p className="text-sm font-medium text-white">Robô Vendedor</p>
            <p className="text-xs text-white/70">Online</p>
          </div>
        </div>
        {!inline && (
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "rounded-tr-sm bg-gradient-to-r from-violet-600 to-blue-600 text-white"
                  : "rounded-tl-sm bg-zinc-800 text-zinc-200"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-tl-sm bg-zinc-800 px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" style={{ animationDelay: "0.1s" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
          </div>
        )}

        {/* Lead form inline */}
        {showLeadForm && !leadSent && (
          <div className="rounded-2xl border border-violet-500/20 bg-zinc-900 p-4">
            <p className="mb-3 text-sm font-medium text-white">
              Quer saber mais? Deixa seu contato:
            </p>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Seu nome"
                value={leadInfo.name}
                onChange={(e) =>
                  setLeadInfo((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500"
              />
              <input
                type="text"
                placeholder="Seu WhatsApp"
                value={leadInfo.whatsapp}
                onChange={(e) =>
                  setLeadInfo((prev) => ({ ...prev, whatsapp: e.target.value }))
                }
                className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500"
              />
              <select
                value={leadInfo.segmento}
                onChange={(e) =>
                  setLeadInfo((prev) => ({ ...prev, segmento: e.target.value }))
                }
                className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
              >
                <option value="">Qual seu segmento?</option>
                <option value="Loja física">Loja física</option>
                <option value="Loja online">Loja online</option>
                <option value="Serviços">Prestador de serviço</option>
                <option value="Alimentação">Alimentação</option>
                <option value="Outro">Outro</option>
              </select>
              <button
                onClick={submitLead}
                className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 py-2 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-violet-600/25"
              >
                Quero saber mais
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {!leadSent && !limitReached && (
        <form onSubmit={handleSubmit} className="border-t border-white/5 p-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              disabled={isLoading}
              className="flex-1 rounded-xl border border-white/10 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-violet-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white transition-all hover:shadow-lg hover:shadow-violet-600/25 disabled:opacity-50"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </form>
      )}
    </div>
  );

  // Floating mode
  if (!inline) {
    return (
      <>
        {/* FAB button */}
        {!isOpen && (
          <div className="fixed bottom-6 right-6 z-50">
            {/* Pulsing ring */}
            <div className="absolute inset-0 animate-ping rounded-full bg-violet-600/40" />
            <button
              onClick={() => setIsOpen(true)}
              className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-xl shadow-violet-600/40 transition-all hover:scale-105 hover:shadow-violet-600/60 active:scale-95"
            >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </button>
          </div>
        )}

        {/* Chat window */}
        {isOpen && (
          <div className="fixed bottom-6 right-6 z-50 h-[520px] w-[360px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/60 animate-in slide-in-from-bottom-5">
            {chatContent}
          </div>
        )}
      </>
    );
  }

  // Inline mode
  return (
    <div className="mx-auto h-[480px] w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/60">
      {chatContent}
    </div>
  );
}
