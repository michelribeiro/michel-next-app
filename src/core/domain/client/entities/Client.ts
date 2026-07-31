import { ClientStatus } from "../value-objects/ClientStatus";
import { PlanType } from "../../plan/value-objects/PlanType";
import { ClientFeatures } from "../value-objects/ClientFeatures";

export interface Client {
  id: number;
  name: string;
  email: string;
  whatsapp: string;
  plan: PlanType;
  status: ClientStatus;
  free_until: string | null;
  features: ClientFeatures | null;
  created_at: string;
  updated_at: string;
}

export interface CreateClientInput {
  name: string;
  email: string;
  whatsapp: string;
  plan: PlanType;
  free_until?: string | null;
  features?: ClientFeatures | null;
}

export interface UpdateClientInput {
  name?: string;
  email?: string;
  whatsapp?: string;
  plan?: PlanType;
  status?: ClientStatus;
  free_until?: string | null;
  features?: ClientFeatures | null;
}
