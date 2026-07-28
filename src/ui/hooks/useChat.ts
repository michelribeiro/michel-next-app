"use client";

import { useState, useRef, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface LeadInfo {
  name: string;
  whatsapp: string;
  segmento: string;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Olá! Me conta qual seu negócio que eu te explico como posso ajudar a vender mais.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [leadInfo, setLeadInfo] = useState<LeadInfo>({
    name: "",
    whatsapp: "",
    segmento: "",
  });
  const fullConversation = useRef<string>("");

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, history }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        role: "assistant",
        content: data.message,
      };
      setMessages((prev) => [...prev, aiMessage]);

      fullConversation.current += `\n\nCliente: ${content}\nRobô: ${data.message}`;

      // Check if AI asked for contact info (lead capture)
      const lowerMsg = data.message.toLowerCase();
      const askedForContact =
        lowerMsg.includes("nome") &&
        (lowerMsg.includes("whatsapp") || lowerMsg.includes("contato") || lowerMsg.includes("telefone"));

      if (askedForContact) {
        // Wait for user response to check if they provided contact
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Desculpe, tive um problema. Pode tentar novamente?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const submitLead = useCallback(async () => {
    if (!leadInfo.name || !leadInfo.whatsapp) return;

    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...leadInfo,
          conversa: fullConversation.current,
        }),
      });

      setLeadSent(true);
      setShowLeadForm(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Perfeito! Recebi seus dados. Em breve você recebe um contato nosso com todas as informações. 🚀",
        },
      ]);
    } catch {
      // Silent fail - will retry
    }
  }, [leadInfo]);

  const detectLeadIntent = useCallback(
    (userMessage: string) => {
      const lower = userMessage.toLowerCase();
      const hasName = lower.split(" ").length >= 2 || /[a-z]{3,}/i.test(lower);
      const hasPhone = /\d{10,}/.test(lower.replace(/\D/g, ""));

      if (hasName && hasPhone) {
        const phone = userMessage.replace(/\D/g, "").slice(-11);
        const nameGuess = userMessage
          .replace(/\d/g, "")
          .replace(/[^a-zA-ZÀ-ÿ\s]/g, "")
          .trim()
          .split(" ")[0];

        setLeadInfo((prev) => ({
          ...prev,
          name: prev.name || nameGuess,
          whatsapp: prev.whatsapp || phone,
        }));
        setShowLeadForm(true);
      }
    },
    []
  );

  return {
    messages,
    isLoading,
    showLeadForm,
    leadSent,
    leadInfo,
    setLeadInfo,
    sendMessage,
    submitLead,
    detectLeadIntent,
    setShowLeadForm,
  };
}
