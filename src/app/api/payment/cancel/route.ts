import { NextRequest, NextResponse } from "next/server";
import { cancelPayment } from "@/core/infrastructure/payment/asaas";
import { supabase } from "@/core/infrastructure/database/supabase";

export async function POST(request: NextRequest) {
  try {
    const { paymentId, leadId } = await request.json();

    if (!paymentId) {
      return NextResponse.json({ error: "ID do pagamento é obrigatório" }, { status: 400 });
    }

    // Cancel in ASAAS
    await cancelPayment(paymentId);

    // Update order status to CANCELED
    await supabase.from("orders").update({ payment_status: "CANCELED" }).eq("payment_id", paymentId);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao cancelar" },
      { status: 500 }
    );
  }
}
