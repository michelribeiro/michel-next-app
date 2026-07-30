import { NextRequest, NextResponse } from "next/server";
import { findClientUserByEmail, createSession } from "@/core/infrastructure/database/supabase";
import { verifyPassword } from "@/core/infrastructure/auth";
import { generateToken } from "@/core/infrastructure/auth";

const SESSION_DURATION_HOURS = 24 * 30; // 30 days

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Find user
    const user = await findClientUserByEmail(email.toLowerCase().trim());

    if (!user) {
      return NextResponse.json(
        { error: "E-mail ou senha incorretos" },
        { status: 401 }
      );
    }

    // Check if client is active
    if (user.clients?.status !== "active") {
      return NextResponse.json(
        { error: "Sua conta está suspensa ou cancelada. Entre em contato." },
        { status: 403 }
      );
    }

    // Verify password
    const valid = verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json(
        { error: "E-mail ou senha incorretos" },
        { status: 401 }
      );
    }

    // Create session
    const token = generateToken();
    const expiresAt = new Date(
      Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000
    ).toISOString();

    await createSession(user.id, token, expiresAt);

    return NextResponse.json({
      token,
      client: {
        id: user.clients.id,
        name: user.clients.name,
        plan: user.clients.plan,
      },
      expires_at: expiresAt,
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      {
        error: `Erro ao fazer login: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`,
      },
      { status: 500 }
    );
  }
}
