import { NextRequest, NextResponse } from "next/server";
import { getPayment } from "@/core/infrastructure/payment/asaas";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get("id");

  if (!paymentId) {
    return NextResponse.json({ error: "ID do pagamento é obrigatório" }, { status: 400 });
  }

  try {
    const payment = await getPayment(paymentId);
    return NextResponse.json({
      status: payment.status,
      confirmed: ["RECEIVED", "CONFIRMED"].includes(payment.status),
    });
  } catch {
    return NextResponse.json({ status: "UNKNOWN", confirmed: false });
  }
}
