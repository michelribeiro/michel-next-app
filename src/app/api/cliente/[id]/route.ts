import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/core/infrastructure/database/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const clientId = Number(id);

  if (!clientId) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  // Buscar dados do cliente
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("id, name, email, whatsapp, plan, status, settings")
    .eq("id", clientId)
    .single();

  if (clientError || !client) {
    return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
  }

  if (client.status !== "active") {
    return NextResponse.json({ error: "Loja não disponível" }, { status: 403 });
  }

  // Buscar produtos do cliente
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*")
    .eq("client_id", clientId)
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (productsError) {
    return NextResponse.json({ error: productsError.message }, { status: 500 });
  }

  const settings = client.settings || {};

  // Imagens de header disponíveis
  const headerImages = [
    { id: 1, name: "Loja moderna", url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200" },
    { id: 2, name: "Roupas", url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200" },
    { id: 3, name: "Tênis", url: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200" },
    { id: 4, name: "Comida", url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200" },
    { id: 5, name: "Tecnologia", url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200" },
    { id: 6, name: "Natureza", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200" },
  ];

  const selectedHeader = headerImages.find((img) => img.id === settings.header_image_id) || headerImages[0];

  return NextResponse.json({
    client: {
      id: client.id,
      name: client.name,
      whatsapp: settings.whatsapp || client.whatsapp,
      description: settings.store_description || "",
      logo: settings.logo_url || "🛒",
      primary_color: settings.primary_color || "#8B5CF6",
      header_image: selectedHeader.url,
      header_name: selectedHeader.name,
    },
    products: (products || []).map((p) => ({
      id: p.id,
      name: p.name,
      type: p.type,
      price: p.price,
      images: p.images || [],
      description: p.description || "",
    })),
  });
}
