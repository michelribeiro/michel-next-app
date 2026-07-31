export enum FeatureId {
  AI_PAGE = "ai_page",
  LEADS_UNLIMITED = "leads_unlimited",
  CHECKOUT = "checkout",
  CATALOG = "catalog",
  WHATSAPP_1TO1 = "whatsapp_1to1",
  WHATSAPP_GROUP = "whatsapp_group",
  ANALYTICS = "analytics",
  INSTAGRAM = "instagram",
  CUSTOM_DOMAIN = "custom_domain",
}

export interface PlanFeature {
  id: FeatureId;
  label: string;
  description: string;
}

export const ALL_FEATURES: PlanFeature[] = [
  {
    id: FeatureId.AI_PAGE,
    label: "Página com IA",
    description: "Página de vendas com inteligência artificial 24h",
  },
  {
    id: FeatureId.LEADS_UNLIMITED,
    label: "Leads ilimitados",
    description: "Sem limite de captura de leads",
  },
  {
    id: FeatureId.CHECKOUT,
    label: "Checkout (ASAAS)",
    description: "PIX, boleto e cartão de crédito",
  },
  {
    id: FeatureId.CATALOG,
    label: "Catálogo de produtos",
    description: "Produtos ilimitados no catálogo",
  },
  {
    id: FeatureId.WHATSAPP_1TO1,
    label: "WhatsApp 1:1",
    description: "IA chama o lead no privado automaticamente",
  },
  {
    id: FeatureId.WHATSAPP_GROUP,
    label: "Disparo em grupo",
    description: "IA envia ofertas em grupos de WhatsApp",
  },
  {
    id: FeatureId.ANALYTICS,
    label: "Relatórios",
    description: "Gráficos de leads, conversão e vendas",
  },
  {
    id: FeatureId.INSTAGRAM,
    label: "Instagram integrado",
    description: "Comentário vira lead automaticamente",
  },
  {
    id: FeatureId.CUSTOM_DOMAIN,
    label: "Domínio próprio",
    description: "URL personalizada para seu negócio",
  },
];
