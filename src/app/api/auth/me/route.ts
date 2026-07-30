import { NextRequest, NextResponse } from "next/server";
import { findSessionByToken, deleteSession } from "@/core/infrastructure/database/supabase";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const session = await findSessionByToken(token);

    if (!session) {
      return NextResponse.json({ error: "Sessão inválida ou expirada" }, { status: 401 });
    }

    const clientData = session.client_user?.clients;

    return NextResponse.json({
      client: {
        id: clientData?.id,
        name: clientData?.name,
        email: session.client_user?.email,
        plan: clientData?.plan,
        status: clientData?.status,
      },
    });
  } catch (error) {
    console.error("Erro ao verificar sessão:", error);
    return NextResponse.json(
      {
        error: `Erro ao verificar sessão: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Logout: delete session
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    await deleteSession(token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    return NextResponse.json(
      {
        error: `Erro ao fazer logout: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`,
      },
      { status: 500 }
    );
  }
}
