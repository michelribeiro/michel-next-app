import { NextRequest, NextResponse } from "next/server";
import { sendLeadEmail } from "@/core/infrastructure/email/sendLeadEmail";
import { saveLead } from "@/core/infrastructure/database/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, whatsapp, segmento, conversa } = body;

    if (!name || !whatsapp) {
      return NextResponse.json(
        { error: "Nome e WhatsApp são obrigatórios" },
        { status: 400 }
      );
    }

    // Save to Supabase
    const lead = await saveLead({
      name,
      whatsapp,
      segmento: segmento || "",
      conversa: conversa || "",
    });

    // Send email notification (non-blocking)
    sendLeadEmail({
      name,
      whatsapp,
      segmento: segmento || "",
      conversa: conversa || "",
    }).catch((err) => console.error("Erro ao enviar e-mail:", err));

    console.log("✅ Lead salvo:", { name, whatsapp, segmento, id: lead?.id });

    return NextResponse.json({ success: true, id: lead?.id });
  } catch (error) {
    console.error("Lead API error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
