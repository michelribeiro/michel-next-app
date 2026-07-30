import { ClientStatus } from "../value-objects/ClientStatus";
import { PlanType } from "../../plan/value-objects/PlanType";

export interface Client {
  id: number;
  name: string;
  email: string;
  whatsapp: string;
  plan: PlanType;
  status: ClientStatus;
  free_until: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateClientInput {
  name: string;
  email: string;
  whatsapp: string;
  plan: PlanType;
  free_until?: string | null;
}

export interface UpdateClientInput {
  name?: string;
  email?: string;
  whatsapp?: string;
  plan?: PlanType;
  status?: ClientStatus;
  free_until?: string | null;
}
