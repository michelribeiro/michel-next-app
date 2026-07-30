import { NextRequest, NextResponse } from "next/server";
import {
  listClients,
  createClientRecord,
  createClientUser,
  updateClient,
  deleteClient,
} from "@/core/infrastructure/database/supabase";
import { hashPassword, generateTempPassword } from "@/core/infrastructure/auth";

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
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return NextResponse.json(
        { error: "Supabase não configurado" },
        { status: 500 }
      );
    }

    const clients = await listClients();
    return NextResponse.json(clients);
  } catch (error) {
    console.error("Erro ao listar clientes:", error);
    return NextResponse.json(
      {
        error: `Erro ao carregar clientes: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = checkAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, whatsapp, plan } = body;

    if (!name || !email || !whatsapp || !plan) {
      return NextResponse.json(
        { error: "Campos obrigatórios: name, email, whatsapp, plan" },
        { status: 400 }
      );
    }

    const validPlans = ["basic", "evolution", "pro"];
    if (!validPlans.includes(plan)) {
      return NextResponse.json(
        { error: `Plano inválido. Use: ${validPlans.join(", ")}` },
        { status: 400 }
      );
    }

    const client = await createClientRecord({ name, email, whatsapp, plan });

    // Create client user with temporary password
    const tempPassword = generateTempPassword();
    const passwordHash = hashPassword(tempPassword);
    await createClientUser(client.id, email.toLowerCase().trim(), passwordHash);

    return NextResponse.json(
      {
        ...client,
        temp_password: tempPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    return NextResponse.json(
      {
        error: `Erro ao criar cliente: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`,
      },
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
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID é obrigatório" },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (updates.status) {
      const validStatuses = ["active", "suspended", "canceled"];
      if (!validStatuses.includes(updates.status)) {
        return NextResponse.json(
          { error: `Status inválido. Use: ${validStatuses.join(", ")}` },
          { status: 400 }
        );
      }
    }

    // Validate plan if provided
    if (updates.plan) {
      const validPlans = ["basic", "evolution", "pro"];
      if (!validPlans.includes(updates.plan)) {
        return NextResponse.json(
          { error: `Plano inválido. Use: ${validPlans.join(", ")}` },
          { status: 400 }
        );
      }
    }

    const client = await updateClient(id, updates);
    return NextResponse.json(client);
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    return NextResponse.json(
      {
        error: `Erro ao atualizar cliente: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`,
      },
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

    await deleteClient(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar cliente:", error);
    return NextResponse.json(
      {
        error: `Erro ao deletar cliente: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`,
      },
      { status: 500 }
    );
  }
}
