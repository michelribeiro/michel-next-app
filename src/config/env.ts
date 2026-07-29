export const env = {
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY || "",
  },
  email: {
    to: process.env.EMAIL_TO || "",
  },
} as const;

export function validateEnv() {
  const missing: string[] = [];

  if (!env.deepseek.apiKey) missing.push("DEEPSEEK_API_KEY");
  if (!process.env.SMTP_HOST) missing.push("SMTP_HOST");
  if (!process.env.SMTP_USER) missing.push("SMTP_USER");
  if (!process.env.EMAIL_APP_PASSWORD) missing.push("EMAIL_APP_PASSWORD");
  if (!env.email.to) missing.push("EMAIL_TO");

  if (missing.length > 0) {
    console.warn(`⚠️ Variáveis de ambiente faltando: ${missing.join(", ")}`);
  }
}
