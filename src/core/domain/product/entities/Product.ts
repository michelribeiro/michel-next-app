import { ProductType } from "../value-objects/ProductType";

export interface Product {
  id: number;
  client_id: number;
  name: string;
  type: ProductType;
  description: string;
  price: number;
  image_url: string;
  images: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductInput {
  client_id: number;
  name: string;
  type: ProductType;
  description?: string;
  price: number;
  images?: string[];
}

export const MAX_IMAGES_PER_PRODUCT = 2;

export function getMaxImagesByProductLimit(productLimit: number | "unlimited"): number | "unlimited" {
  if (productLimit === "unlimited") return "unlimited";
  return productLimit * MAX_IMAGES_PER_PRODUCT;
}
