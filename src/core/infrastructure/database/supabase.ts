import { createClient } from "@supabase/supabase-js";

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
