import nodemailer from "nodemailer";
import { env } from "@/config/env";
import { leadEmailTemplate } from "./leadEmailTemplate";

interface LeadData {
  name: string;
  whatsapp: string;
  segmento: string;
  conversa: string;
}

function getConfig() {
  const smtpUser =
    process.env.SMTP_USER || process.env.EMAIL_USER || "";
  const smtpPass =
    process.env.EMAIL_APP_PASSWORD ||
    process.env.SMTP_PASS ||
    process.env.EMAIL_PASS ||
    "";
  const emailTo = env.email.to || process.env.EMAIL_TO || "";

  const missing: string[] = [];
  if (!smtpUser) missing.push("SMTP_USER/EMAIL_USER");
  if (!smtpPass) missing.push("EMAIL_APP_PASSWORD/EMAIL_PASS");
  if (!emailTo) missing.push("EMAIL_TO");

  return { smtpUser, smtpPass, emailTo, missing };
}

export async function sendLeadEmail(lead: LeadData) {
  const config = getConfig();

  if (config.missing.length > 0) {
    console.warn(`📧 Envio desabilitado. Faltando: ${config.missing.join(", ")}`);
    return;
  }

  const isPlanLead = lead.segmento?.startsWith("Plano:");
  const subject = isPlanLead
    ? `💰 Plano escolhido: ${lead.name} - ${lead.segmento.replace("Plano: ", "")}`
    : `🎯 Novo Lead: ${lead.name} - ${lead.segmento || "Sem segmento"}`;

  const html = leadEmailTemplate(lead);
  const smtpFrom = process.env.SMTP_FROM || `"Robô Vendedor" <${config.smtpUser}>`;

  async function trySend(port: number, secure: boolean) {
    const t = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port,
      secure,
      auth: { user: config.smtpUser, pass: config.smtpPass },
      connectionTimeout: 8000,
    });
    await t.sendMail({ from: smtpFrom, to: config.emailTo, subject, html });
  }

  try {
    console.log(`📧 Enviando para ${config.emailTo}...`);
    await trySend(587, false);
    console.log("✅ E-mail enviado (porta 587)");
  } catch (err1) {
    console.log("📧 587 falhou, tentando 465...", err1 instanceof Error ? err1.message.slice(0, 50) : "");
    try {
      await trySend(465, true);
      console.log("✅ E-mail enviado (porta 465)");
    } catch (err2) {
      console.error("❌ E-mail falhou em ambas portas:", err2 instanceof Error ? err2.message : err2);
    }
  }
}
