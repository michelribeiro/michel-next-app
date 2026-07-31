import { NextRequest, NextResponse } from "next/server";
import { listOrders, findSessionByToken } from "@/core/infrastructure/database/supabase";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const session = await findSessionByToken(authHeader.slice(7));
  const clientId = session?.client_user?.clients?.id;
  if (!clientId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const orders = await listOrders(clientId);
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao listar pedidos" },
      { status: 500 }
    );
  }
}
