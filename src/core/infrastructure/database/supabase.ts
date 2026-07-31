import { createClient } from "@supabase/supabase-js";
import { Client, CreateClientInput } from "@/core/domain/client/entities/Client";
import { ClientStatus } from "@/core/domain/client/value-objects/ClientStatus";
import { Product, CreateProductInput } from "@/core/domain/product/entities/Product";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Lead {
  id?: number;
  name: string;
  whatsapp: string;
  segmento?: string;
  conversa?: string;
  status?: "novo" | "contatado" | "convertido" | "perdido";
  created_at?: string;
}

export async function saveLead(lead: Omit<Lead, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("leads")
    .insert([
      {
        name: lead.name,
        whatsapp: lead.whatsapp,
        segmento: lead.segmento || "",
        conversa: lead.conversa || "",
        status: "novo",
      },
    ])
    .select();

  if (error) {
    console.error("Erro ao salvar lead:", JSON.stringify(error));
    throw new Error(error.message || "Erro desconhecido no Supabase");
  }

  return data?.[0] as Lead | undefined;
}

export async function listLeads() {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao listar leads:", JSON.stringify(error));
    throw new Error(error.message || "Erro desconhecido no Supabase");
  }

  return data as Lead[];
}

export async function updateLeadStatus(
  id: number,
  status: Lead["status"]
) {
  const { error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar lead:", JSON.stringify(error));
    throw new Error(error.message || "Erro desconhecido no Supabase");
  }
}

export async function deleteLead(id: number) {
  const { error } = await supabase.from("leads").delete().eq("id", id);

  if (error) {
    console.error("Erro ao deletar lead:", JSON.stringify(error));
    throw new Error(error.message || "Erro desconhecido no Supabase");
  }
}

// ─── Client CRUD ────────────────────────────────────────

export async function listClients() {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao listar clientes:", JSON.stringify(error));
    throw new Error(error.message || "Erro desconhecido no Supabase");
  }

  return data as Client[];
}

export async function createClientRecord(input: CreateClientInput) {
  const { data, error } = await supabase
    .from("clients")
    .insert([
      {
        name: input.name,
        email: input.email,
        whatsapp: input.whatsapp,
        plan: input.plan,
        status: "active",
        free_until: input.free_until || null,
        features: input.features || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar cliente:", JSON.stringify(error));
    throw new Error(error.message || "Erro desconhecido no Supabase");
  }

  return data as Client;
}

export async function updateClient(
  id: number,
  updates: {
    name?: string;
    email?: string;
    whatsapp?: string;
    plan?: string;
    status?: ClientStatus;
    free_until?: string | null;
    features?: Record<string, unknown> | null;
  }
) {
  const { data, error } = await supabase
    .from("clients")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar cliente:", JSON.stringify(error));
    throw new Error(error.message || "Erro desconhecido no Supabase");
  }

  return data as Client;
}

export async function deleteClient(id: number) {
  const { error } = await supabase.from("clients").delete().eq("id", id);

  if (error) {
    console.error("Erro ao deletar cliente:", JSON.stringify(error));
    throw new Error(error.message || "Erro desconhecido no Supabase");
  }
}

// ─── Client Auth ─────────────────────────────────────────

export async function createClientUser(clientId: number, email: string, passwordHash: string) {
  const { data, error } = await supabase
    .from("client_users")
    .insert([{ client_id: clientId, email, password_hash: passwordHash }])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar usuário cliente:", JSON.stringify(error));
    throw new Error(error.message || "Erro desconhecido no Supabase");
  }

  return data;
}

export async function findClientUserByEmail(email: string) {
  const { data, error } = await supabase
    .from("client_users")
    .select("*, clients!inner(id, name, plan, status)")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar usuário:", JSON.stringify(error));
    throw new Error(error.message || "Erro desconhecido no Supabase");
  }

  return data;
}

export async function createSession(clientUserId: number, token: string, expiresAt: string) {
  const { data, error } = await supabase
    .from("client_sessions")
    .insert([{ client_user_id: clientUserId, token, expires_at: expiresAt }])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar sessão:", JSON.stringify(error));
    throw new Error(error.message || "Erro desconhecido no Supabase");
  }

  return data;
}

export async function findSessionByToken(token: string) {
  const { data, error } = await supabase
    .from("client_sessions")
    .select("*, client_user:client_users!inner(client_id, email, clients!inner(id, name, plan, status))")
    .eq("token", token)
    .gte("expires_at", new Date().toISOString())
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar sessão:", JSON.stringify(error));
    throw new Error(error.message || "Erro desconhecido no Supabase");
  }

  return data;
}

export async function deleteSession(token: string) {
  const { error } = await supabase.from("client_sessions").delete().eq("token", token);

  if (error) {
    console.error("Erro ao deletar sessão:", JSON.stringify(error));
    throw new Error(error.message || "Erro desconhecido no Supabase");
  }
}

// ─── Product CRUD ─────────────────────────────────────────

export async function listProducts(clientId: number) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao listar produtos:", JSON.stringify(error));
    throw new Error(error.message || "Erro desconhecido no Supabase");
  }

  return data as Product[];
}

export async function createProduct(input: CreateProductInput) {
  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        client_id: input.client_id,
        name: input.name,
        type: input.type,
        description: input.description || "",
        price: input.price,
        images: input.images || [],
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar produto:", JSON.stringify(error));
    throw new Error(error.message || "Erro desconhecido no Supabase");
  }

  return data as Product;
}

export async function updateProduct(
  id: number,
  updates: {
    name?: string;
    type?: string;
    description?: string;
    price?: number;
    images?: string[];
    active?: boolean;
  }
) {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar produto:", JSON.stringify(error));
    throw new Error(error.message || "Erro desconhecido no Supabase");
  }

  return data as Product;
}

export async function deleteProduct(id: number) {
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("Erro ao deletar produto:", JSON.stringify(error));
    throw new Error(error.message || "Erro desconhecido no Supabase");
  }
}

// ─── Orders ──────────────────────────────────────────────

export async function listOrders(clientId: number) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao listar pedidos:", JSON.stringify(error));
    throw new Error(error.message || "Erro desconhecido no Supabase");
  }

  return data;
}

export async function createOrder(input: {
  client_id: number;
  customer_name: string;
  customer_whatsapp: string;
  customer_email?: string;
  items: unknown[];
  total: number;
  payment_method: string;
  payment_id: string;
  invoice_url: string;
  pix_qrcode?: string;
  pix_copy_paste?: string;
  bank_slip_url?: string;
  shipping_address?: unknown;
}) {
  const { data, error } = await supabase
    .from("orders")
    .insert([input])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar pedido:", JSON.stringify(error));
    throw new Error(error.message || "Erro desconhecido no Supabase");
  }

  return data;
}

export async function updateOrderPaymentStatus(paymentId: string, status: string) {
  const { error } = await supabase
    .from("orders")
    .update({ payment_status: status })
    .eq("payment_id", paymentId);

  if (error) {
    console.error("Erro ao atualizar pedido:", JSON.stringify(error));
    throw new Error(error.message || "Erro desconhecido no Supabase");
  }
}
