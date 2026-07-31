import { NextRequest, NextResponse } from "next/server";
import { findSessionByToken, supabase } from "@/core/infrastructure/database/supabase";

const HEADER_IMAGES = [
  { id: 1, name: "Loja moderna", url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200" },
  { id: 2, name: "Roupas", url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200" },
  { id: 3, name: "Tênis", url: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200" },
  { id: 4, name: "Comida", url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200" },
  { id: 5, name: "Tecnologia", url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200" },
  { id: 6, name: "Natureza", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200" },
];

async function getClientId(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const session = await findSessionByToken(authHeader.slice(7));
  return session?.client_user?.clients?.id || null;
}

export async function GET(request: NextRequest) {
  const clientId = await getClientId(request);
  if (!clientId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("clients")
    .select("name, email, whatsapp, settings")
    .eq("id", clientId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    name: data.name,
    email: data.email,
    whatsapp: data.whatsapp,
    settings: data.settings || {},
    header_images: HEADER_IMAGES,
    store_name: data.settings?.store_name || data.name,
  });
}

export async function PATCH(request: NextRequest) {
  const clientId = await getClientId(request);
  if (!clientId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { settings, name } = body;

    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ error: "settings é obrigatório" }, { status: 400 });
    }

    // Update name if provided
    if (name && typeof name === "string" && name.trim()) {
      await supabase.from("clients").update({ name: name.trim() }).eq("id", clientId);
    }

    // Merge with existing settings
    const { data: existing } = await supabase
      .from("clients")
      .select("settings")
      .eq("id", clientId)
      .single();

    const merged = { ...(existing?.settings || {}), ...settings };

    const { error } = await supabase
      .from("clients")
      .update({ settings: merged })
      .eq("id", clientId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ settings: merged });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao salvar" },
      { status: 500 }
    );
  }
}
