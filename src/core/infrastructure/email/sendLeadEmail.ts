import nodemailer from "nodemailer";
import { env } from "@/config/env";
import { leadEmailTemplate } from "./leadEmailTemplate";

interface LeadData {
  name: string;
  whatsapp: string;
  segmento: string;
  conversa: string;
}

function canSendEmail() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.EMAIL_APP_PASSWORD || process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || smtpUser;
  return !!(smtpHost && smtpUser && smtpPass && smtpFrom);
}

function createTransport() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.EMAIL_APP_PASSWORD || process.env.SMTP_PASS;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpSecure = process.env.SMTP_SECURE === "true";

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: { user: smtpUser, pass: smtpPass },
  });
}

export async function sendLeadEmail(lead: LeadData) {
  if (!canSendEmail()) {
    console.warn("📧 E-mail não configurado (SMTP_HOST/SMTP_USER/EMAIL_APP_PASSWORD). Lead não enviado.");
    return;
  }

  try {
    const transport = createTransport();
    const smtpFrom = process.env.SMTP_FROM || process.env.SMTP_USER || "";

    const isPlanLead = lead.segmento?.startsWith("Plano:");
    const subject = isPlanLead
      ? `💰 Plano escolhido: ${lead.name} - ${lead.segmento.replace("Plano: ", "")}`
      : `🎯 Novo Lead: ${lead.name} - ${lead.segmento || "Sem segmento"}`;

    await transport.sendMail({
      from: smtpFrom,
      to: env.email.to,
      subject,
      html: leadEmailTemplate(lead),
    });

    console.log("📧 E-mail enviado com sucesso");
  } catch (error) {
    console.error("📧 Erro ao enviar e-mail:", error);
  }
}
