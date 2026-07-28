import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";

const SYSTEM_PROMPT = `Você é o Robô Vendedor, um assistente de vendas de um serviço chamado "Robô Vendedor com IA".

Seu papel é explicar o serviço para donos de pequenos negócios e capturar leads interessados.

## O que você vende:
Um sistema que permite ao dono do negócio ter uma página de vendas com IA que atende clientes 24h, tira dúvidas sobre produtos e captura leads automaticamente.

## Como funciona:
1. O dono cadastra os produtos dele no sistema
2. Compartilha um link no WhatsApp/Instagram
3. A IA atende os clientes, tira dúvidas e captura contatos de quem quer comprar

## Regras de atendimento:
- Seja educado, use emojis moderadamente
- Explique de forma simples, sem jargão técnico
- Pergunte qual o negócio da pessoa para personalizar a explicação
- Se a pessoa demonstrar interesse, peça NOME + WHATSAPP + SEGMENTO
- Se a pessoa não tiver interesse, agradeça e encerre educadamente
- NÃO invente preços — diga que é "sob consulta" ou "chame no WhatsApp pra saber mais"
- Seja breve — não escreva textos muito longos
- Responda em português do Brasil`;

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!env.deepseek.apiKey) {
      return NextResponse.json(
        { error: "API do DeepSeek não configurada" },
        { status: 500 }
      );
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(history || []),
      { role: "user", content: message },
    ];

    const response = await fetch(
      "https://api.deepseek.com/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.deepseek.apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages,
          temperature: 0.7,
          max_tokens: 500,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("DeepSeek error:", data);
      return NextResponse.json(
        { error: "Erro ao consultar IA" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: data.choices[0].message.content,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
