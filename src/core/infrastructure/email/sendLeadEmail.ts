import nodemailer from "nodemailer";
import { env } from "@/config/env";
import { leadEmailTemplate } from "./leadEmailTemplate";

interface LeadData {
  name: string;
  whatsapp: string;
  segmento: string;
  conversa: string;
}

export async function sendLeadEmail(lead: LeadData) {
  if (!env.email.user || !env.email.pass || !env.email.to) {
    console.warn("📧 E-mail não configurado. Lead não enviado.");
    return;
  }

  // Try port 587 (STARTTLS) first, fallback to 465 (SSL)
  const makeTransporter = (port: number, secure: boolean) =>
    nodemailer.createTransport({
      host: "smtp.gmail.com",
      port,
      secure,
      auth: {
        user: env.email.user,
        // Strip spaces from app password (Google generates with spaces)
        pass: env.email.pass.replace(/\s/g, ""),
      },
      connectionTimeout: 10000,
    });

  const html = leadEmailTemplate(lead);

  const send = async (port: number, secure: boolean) => {
    const transporter = makeTransporter(port, secure);
    await transporter.sendMail({
      from: `"Robô Vendedor" <${env.email.user}>`,
      to: env.email.to,
      subject: lead.segmento?.startsWith("Plano:")
        ? `💰 Plano escolhido: ${lead.name} - ${lead.segmento.replace("Plano: ", "")}`
        : `🎯 Novo Lead: ${lead.name} - ${lead.segmento || "Sem segmento"}`,
      html,
      replyTo: env.email.user,
    });
  };

  try {
    await send(587, false);
  } catch {
    console.warn("📧 Porta 587 falhou, tentando 465...");
    try {
      await send(465, true);
    } catch (err) {
      console.error("📧 Erro ao enviar e-mail em ambas portas:", err);
    }
  }
}
