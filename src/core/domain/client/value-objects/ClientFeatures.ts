/**
 * Features customizáveis por cliente.
 * Usado principalmente para planos Free, onde o admin
 * escolhe o que liberar. Para planos pagos, as features
 * vêm do Plan.ts.
 */
export interface ClientFeatures {
  max_products: number;
  max_groups: number;
  has_whatsapp: boolean;
  has_dashboard: boolean;
  has_instagram: boolean;
  has_custom_domain: boolean;
  has_checkout: boolean;
}

/**
 * Features padrão liberadas para cada tipo de plano.
 * Usado quando o cliente não tem features customizadas.
 */
export function getDefaultFeatures(plan: string): ClientFeatures {
  switch (plan) {
    case "free":
      return {
        max_products: 5,
        max_groups: 0,
        has_whatsapp: false,
        has_dashboard: false,
        has_instagram: false,
        has_custom_domain: false,
        has_checkout: false,
      };
    case "basic":
      return {
        max_products: 30,
        max_groups: 0,
        has_whatsapp: false,
        has_dashboard: true,
        has_instagram: false,
        has_custom_domain: false,
        has_checkout: true,
      };
    case "evolution":
      return {
        max_products: 50,
        max_groups: 3,
        has_whatsapp: true,
        has_dashboard: true,
        has_instagram: false,
        has_custom_domain: false,
        has_checkout: true,
      };
    case "pro":
      return {
        max_products: 999999,
        max_groups: 5,
        has_whatsapp: true,
        has_dashboard: true,
        has_instagram: true,
        has_custom_domain: true,
        has_checkout: true,
      };
    default:
      return getDefaultFeatures("free");
  }
}

export const FEATURE_LABELS: Record<keyof ClientFeatures, string> = {
  max_products: "Limite de produtos",
  max_groups: "Grupos de disparo",
  has_whatsapp: "WhatsApp 1:1",
  has_dashboard: "Relatórios (gráficos)",
  has_instagram: "Instagram",
  has_custom_domain: "Domínio próprio",
  has_checkout: "Checkout ASAAS",
};
