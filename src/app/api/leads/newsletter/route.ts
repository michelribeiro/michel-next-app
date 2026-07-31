import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/core/infrastructure/database/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, name, whatsapp } = body;

    if (!clientId || !name || !whatsapp) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const { error } = await supabase.from("leads").insert([{
      client_id: clientId,
      name,
      whatsapp: whatsapp.replace(/\D/g, ""),
      origin: "newsletter",
      qualified: false,
    }]);

    if (error) {
      console.error("Erro ao salvar lead:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
