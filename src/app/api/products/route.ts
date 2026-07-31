import { NextRequest, NextResponse } from "next/server";
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  findSessionByToken,
} from "@/core/infrastructure/database/supabase";

async function checkAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { authorized: false, clientId: null };
  }

  const session = await findSessionByToken(authHeader.slice(7));
  if (!session || !session.client_user?.clients?.id) {
    return { authorized: false, clientId: null };
  }

  const clientId = session.client_user.clients.id;
  const plan = session.client_user.clients.plan;
  return { authorized: true, clientId, plan };
}

export async function GET(request: NextRequest) {
  const auth = await checkAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const products = await listProducts(auth.clientId!);
    return NextResponse.json(products);
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao listar produtos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await checkAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, type, description, price, images } = body;

    if (!name || !type || price === undefined) {
      return NextResponse.json(
        { error: "Campos obrigatórios: name, type, price" },
        { status: 400 }
      );
    }

    if (!["product", "service"].includes(type)) {
      return NextResponse.json(
        { error: "Tipo inválido. Use: product ou service" },
        { status: 400 }
      );
    }

    // Check limit by plan
    const existing = await listProducts(auth.clientId!);
    const limits: Record<string, number | "unlimited"> = {
      basic: 30,
      evolution: 50,
      pro: "unlimited",
    };

    const limit = limits[auth.plan as string] || 0;
    if (limit !== "unlimited" && existing.length >= (limit as number)) {
      return NextResponse.json(
        { error: `Limite de ${limit} produtos atingido para seu plano` },
        { status: 403 }
      );
    }

    const product = await createProduct({
      client_id: auth.clientId!,
      name,
      type,
      description: description || "",
      price,
      images: images || [],
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao criar produto" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await checkAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    const product = await updateProduct(id, updates);
    return NextResponse.json(product);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao atualizar produto" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await checkAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao deletar produto" },
      { status: 500 }
    );
  }
}
