export const env = {
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY || "",
  },
  email: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
    to: process.env.EMAIL_TO || "",
  },
} as const;

export function validateEnv() {
  const missing: string[] = [];

  if (!env.deepseek.apiKey) missing.push("DEEPSEEK_API_KEY");
  if (!env.email.user) missing.push("EMAIL_USER");
  if (!env.email.pass) missing.push("EMAIL_PASS");
  if (!env.email.to) missing.push("EMAIL_TO");

  if (missing.length > 0) {
    console.warn(`⚠️ Variáveis de ambiente faltando: ${missing.join(", ")}`);
  }
}
