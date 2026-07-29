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
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER || "";
  const smtpPass =
    process.env.EMAIL_APP_PASSWORD ||
    process.env.SMTP_PASS ||
    process.env.EMAIL_PASS ||
    "";
  const emailTo = env.email.to || process.env.EMAIL_TO || "";

  if (!smtpUser || !smtpPass || !emailTo) {
    console.warn("📧 Configuração de email incompleta");
    return;
  }

  const isPlanLead = lead.segmento?.startsWith("Plano:");
  const subject = isPlanLead
    ? `💰 Plano escolhido: ${lead.name} - ${lead.segmento.replace("Plano: ", "")}`
    : `🎯 Novo Lead: ${lead.name} - ${lead.segmento || "Sem segmento"}`;

  const smtpFrom = process.env.SMTP_FROM || `"Robô Vendedor" <${smtpUser}>`;

  // Try different ports/options aggressively
  const attempts = [
    { host: "smtp.gmail.com", port: 587, secure: false },
    { host: "smtp.gmail.com", port: 465, secure: true },
    { host: "smtp.gmail.com", port: 25, secure: false },
  ];

  for (const opts of attempts) {
    try {
      const t = nodemailer.createTransport({
        host: opts.host,
        port: opts.port,
        secure: opts.secure,
        auth: { user: smtpUser, pass: smtpPass },
        connectionTimeout: 5000,
        greetingTimeout: 3000,
        socketTimeout: 8000,
      });
      await t.sendMail({
        from: smtpFrom,
        to: emailTo,
        subject,
        html: leadEmailTemplate(lead),
      });
      console.log(`✅ Email enviado via ${opts.host}:${opts.port}`);
      return;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`📧 ${opts.host}:${opts.port} -> ${msg.slice(0, 80)}`);
    }
  }

  console.error("❌ Todas as tentativas de email falharam");
}
