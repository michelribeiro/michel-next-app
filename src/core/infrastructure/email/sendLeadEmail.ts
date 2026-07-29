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
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpSecure = process.env.SMTP_SECURE === "true";
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER || "";
  const smtpPass =
    process.env.EMAIL_APP_PASSWORD ||
    process.env.SMTP_PASS ||
    process.env.EMAIL_PASS ||
    "";
  const smtpFrom = process.env.SMTP_FROM || `"Robô Vendedor" <${smtpUser}>`;
  const emailTo = env.email.to || process.env.EMAIL_TO || "";

  const missing: string[] = [];
  if (!smtpUser) missing.push("SMTP_USER/EMAIL_USER");
  if (!smtpPass) missing.push("EMAIL_APP_PASSWORD/EMAIL_PASS");
  if (!emailTo) missing.push("EMAIL_TO");

  return { smtpHost, smtpPort, smtpSecure, smtpUser, smtpPass, smtpFrom, emailTo, missing };
}

export async function sendLeadEmail(lead: LeadData) {
  const config = getConfig();

  if (config.missing.length > 0) {
    console.warn(`📧 Envio de e-mail desabilitado. Variáveis faltando: ${config.missing.join(", ")}`);
    return;
  }

  // Log que tentou (visível nos logs da Vercel)
  console.log(`📧 Tentando enviar e-mail para ${config.emailTo} via ${config.smtpUser}...`);

  try {
    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpSecure,
      auth: { user: config.smtpUser, pass: config.smtpPass },
      connectionTimeout: 15000,
    });

    const isPlanLead = lead.segmento?.startsWith("Plano:");
    const subject = isPlanLead
      ? `💰 Plano escolhido: ${lead.name} - ${lead.segmento.replace("Plano: ", "")}`
      : `🎯 Novo Lead: ${lead.name} - ${lead.segmento || "Sem segmento"}`;

    await transporter.sendMail({
      from: config.smtpFrom,
      to: config.emailTo,
      subject,
      html: leadEmailTemplate(lead),
    });

    console.log("📧 E-mail enviado com sucesso!");
  } catch (error) {
    console.error("📧 Erro ao enviar e-mail:", error instanceof Error ? error.message : error);
  }
}
