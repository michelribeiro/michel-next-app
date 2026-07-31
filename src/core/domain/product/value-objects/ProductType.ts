export type ProductType = "product" | "service";

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  product: "Produto físico",
  service: "Serviço",
};

export const PRODUCT_TYPE_ICONS: Record<ProductType, string> = {
  product: "📦",
  service: "🔧",
};
