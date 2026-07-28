"use client";

import { useState, useRef, useCallback } from "react";

const MAX_MESSAGES = 20;

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
  const [limitReached, setLimitReached] = useState(false);
  const [leadInfo, setLeadInfo] = useState<LeadInfo>({
    name: "",
    whatsapp: "",
    segmento: "",
  });
  const fullConversation = useRef<string>("");

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Check message limit (user messages only)
    const userMsgCount = messages.filter((m) => m.role === "user").length;
    if (userMsgCount >= MAX_MESSAGES / 2) {
      setLimitReached(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "😅 Uau, quanta conversa! Se quiser saber mais, deixa seu contato que eu chamo você.",
        },
      ]);
      return;
    }

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
        body: JSON.stringify({
          message: content,
          history,
          messageCount: userMsgCount + 1,
        }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setLimitReached(true);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "😅 Uau, quanta conversa! Se quiser saber mais, deixa seu contato que eu chamo você.",
          },
        ]);
        setIsLoading(false);
        return;
      }

      const aiMessage: Message = {
        role: "assistant",
        content: data.message,
      };
      setMessages((prev) => [...prev, aiMessage]);

      fullConversation.current += `\n\nCliente: ${content}\nRobô: ${data.message}`;
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
      if (limitReached) return;

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
    [limitReached]
  );

  return {
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
  };
}
