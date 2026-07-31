import { NextRequest, NextResponse } from "next/server";
import { findSessionByToken, supabase } from "@/core/infrastructure/database/supabase";

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
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get("origin") || "";
    const qualified = searchParams.get("qualified") || "";
    const search = searchParams.get("search") || "";

    // Fetch from orders (compra) - only when not filtering by other origins
    let orderLeads: { id: string; name: string; email: string; whatsapp: string; origin: string; qualified: boolean; product_interest: string; total: number | null; created_at: string; }[] = [];
    
    if (origin !== "newsletter" && origin !== "ia_chat") {
      let query = supabase
        .from("orders")
        .select("id, customer_name, customer_email, customer_whatsapp, total, items, payment_status, created_at")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (qualified === "sim") {
        query = query.in("payment_status", ["RECEIVED", "CONFIRMED"]);
      } else if (qualified === "nao") {
        query = query.in("payment_status", ["PENDING", "OVERDUE", "CANCELED"]);
      }
      if (search) {
        query = query.or(`customer_name.ilike.%${search}%,customer_whatsapp.ilike.%${search}%`);
      }

      const { data: orders, error: ordersError } = await query;
      if (ordersError) throw ordersError;

      orderLeads = (orders || []).map((o) => ({
        id: `order_${o.id}`,
        name: o.customer_name,
        email: o.customer_email || "",
        whatsapp: o.customer_whatsapp,
        origin: "compra",
        qualified: true,
        product_interest: o.items?.map((i: { name: string }) => i.name).join(", ") || "",
        total: o.total,
        created_at: o.created_at,
      }));
    }

    // Fetch from leads table only if filtering by non-compra origins
    let formattedLeads: { id: string; name: string; email: string; whatsapp: string; origin: string; qualified: boolean; product_interest: string; total: number | null; created_at: string; }[] = [];
    
    if (origin !== "compra") {
      let leadsQuery = supabase
        .from("leads")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (origin && origin !== "todas") {
        leadsQuery = leadsQuery.eq("origin", origin);
      }
      if (search) {
        leadsQuery = leadsQuery.or(`name.ilike.%${search}%,whatsapp.ilike.%${search}%`);
      }

      const { data: leads, error: leadsError } = await leadsQuery;
      if (leadsError) throw leadsError;

      formattedLeads = (leads || []).map((l) => ({
        id: `lead_${l.id}`,
        name: l.name,
        email: l.email,
        whatsapp: l.whatsapp,
        origin: l.origin,
        qualified: l.origin === 'newsletter' || l.qualified,
        product_interest: l.product_interest,
        total: null,
        created_at: l.created_at,
      }));
    }

    // Combine, filter and sort
    let allLeads = [...orderLeads, ...formattedLeads];

    if (qualified === "sim") {
      allLeads = allLeads.filter((l) => l.qualified);
    } else if (qualified === "nao") {
      allLeads = allLeads.filter((l) => !l.qualified);
    }

    allLeads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return NextResponse.json(allLeads);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro interno" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    const type = searchParams.get("type");

    if (!id || !type) {
      return NextResponse.json({ error: "ID e tipo são obrigatórios" }, { status: 400 });
    }

    if (type === "order") {
      const { error } = await supabase.from("orders").delete().eq("id", id).eq("client_id", clientId);
      if (error) throw error;
    } else if (type === "lead") {
      const { error } = await supabase.from("leads").delete().eq("id", id).eq("client_id", clientId);
      if (error) throw error;
    } else {
      return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro interno" },
      { status: 500 }
    );
  }
}
