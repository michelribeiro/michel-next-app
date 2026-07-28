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

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: env.email.user,
      pass: env.email.pass,
    },
  });

  const html = leadEmailTemplate(lead);

  await transporter.sendMail({
    from: `"Robô Vendedor" <${env.email.user}>`,
    to: env.email.to,
    subject: `🎯 Novo Lead: ${lead.name} - ${lead.segmento || "Sem segmento"}`,
    html,
    replyTo: env.email.user,
  });
}
