import { NextRequest, NextResponse } from "next/server";
import { listLeads, updateLeadStatus, deleteLead } from "@/core/infrastructure/database/supabase";

function checkAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
    return { authorized: false };
  }

  return { authorized: true };
}

export async function GET(request: NextRequest) {
  const auth = checkAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("ERRO: NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não configurados");
      return NextResponse.json(
        { error: "Supabase não configurado. Verifique as variáveis de ambiente." },
        { status: 500 }
      );
    }

    const leads = await listLeads();
    return NextResponse.json(leads);
  } catch (error) {
    console.error("Erro ao listar leads:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json(
      { error: `Erro ao carregar leads: ${msg}` },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const auth = checkAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID e status são obrigatórios" },
        { status: 400 }
      );
    }

    await updateLeadStatus(id, status);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao atualizar lead:", error);
    return NextResponse.json(
      { error: `Erro ao atualizar lead: ${error instanceof Error ? error.message : "Erro desconhecido"}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const auth = checkAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    await deleteLead(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar lead:", error);
    return NextResponse.json(
      { error: `Erro ao deletar lead: ${error instanceof Error ? error.message : "Erro desconhecido"}` },
      { status: 500 }
    );
  }
}
