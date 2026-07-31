import { NextRequest, NextResponse } from "next/server";
import { getPayment, ASAAS_WEBHOOK_TOKEN, createPixTransfer } from "@/core/infrastructure/payment/asaas";
import { updateOrderPaymentStatus, supabase } from "@/core/infrastructure/database/supabase";

export async function POST(request: NextRequest) {
  try {
    // Validate webhook token (only if configured)
    const authHeader = request.headers.get("authorization");
    if (ASAAS_WEBHOOK_TOKEN && authHeader !== ASAAS_WEBHOOK_TOKEN) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { event, payment } = body;

    // ASAAS sends different events
    // https://docs.asaas.com/reference/webhook
    if (!event || !payment?.id) {
      return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
    }

    const paymentId = payment.id;

    switch (event) {
      case "PAYMENT_RECEIVED":
      case "PAYMENT_CONFIRMED":
        console.log(`✅ Pagamento ${paymentId} confirmado!`);
        await updateOrderPaymentStatus(paymentId, event === "PAYMENT_CONFIRMED" ? "CONFIRMED" : "RECEIVED");

        // Repasse automático pro lojista
        try {
          // Buscar pedido
          const { data: order } = await supabase.from("orders").select("client_id, total").eq("payment_id", paymentId).single();
          if (order) {
            // Buscar chave PIX do lojista
            const { data: client } = await supabase.from("clients").select("settings").eq("id", order.client_id).single();
            const pixKey = client?.settings?.pix_key;
            if (pixKey) {
              const transfer = await createPixTransfer(order.total, pixKey, `Repasse venda #${order.client_id}`);
              console.log(`💰 Transferência PIX realizada: ${transfer.id} - R$ ${transfer.value}`);
              // Registrar transferência
              await supabase.from("transfers").insert([{
                client_id: order.client_id,
                payment_id: paymentId,
                value: order.total,
                pix_key: pixKey,
                transfer_id: transfer.id,
                status: transfer.status,
              }]);
            }
          }
        } catch (err) {
          console.error("Erro no repasse automático:", err);
        }
        break;

      case "PAYMENT_OVERDUE":
        console.log(`⏰ Pagamento ${paymentId} venceu`);
        break;

      case "PAYMENT_REFUNDED":
        console.log(`↩️ Pagamento ${paymentId} estornado`);
        break;

      case "PAYMENT_CANCELED":
        console.log(`❌ Pagamento ${paymentId} cancelado`);
        break;

      default:
        console.log(`📨 Evento não tratado: ${event}`);
    }

    // Always return 200 to ASAAS
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erro no webhook:", error);
    return NextResponse.json({ received: true });
  }
}

// ASAAS also sends GET for validation
export async function GET() {
  return NextResponse.json({ status: "ok" });
}
