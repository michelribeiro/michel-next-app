import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/core/infrastructure/database/supabase";

export async function POST(request: NextRequest) {
  try {
    const { paymentId } = await request.json();

    if (!paymentId) {
      return NextResponse.json({ error: "ID do pagamento é obrigatório" }, { status: 400 });
    }

    // Update order payment status to CONFIRMED
    await supabase
      .from("orders")
      .update({ payment_status: "CONFIRMED" })
      .eq("payment_id", paymentId);

    return NextResponse.json({ success: true, status: "CONFIRMED" });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro" },
      { status: 500 }
    );
  }
}
