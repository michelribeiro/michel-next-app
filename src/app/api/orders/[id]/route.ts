import { NextRequest, NextResponse } from "next/server";
import { findSessionByToken, supabase } from "@/core/infrastructure/database/supabase";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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
    const body = await request.json();
    const { delivery_status } = body;

    if (!delivery_status || !["pending", "confirmed"].includes(delivery_status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    const { error } = await supabase
      .from("orders")
      .update({ delivery_status })
      .eq("id", id)
      .eq("client_id", clientId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro interno" },
      { status: 500 }
    );
  }
}
