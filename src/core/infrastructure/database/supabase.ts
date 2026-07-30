import { createClient } from "@supabase/supabase-js";
import { Client, CreateClientInput } from "@/core/domain/client/entities/Client";
import { ClientStatus } from "@/core/domain/client/value-objects/ClientStatus";

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
