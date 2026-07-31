import { NextRequest, NextResponse } from "next/server";
import { createCustomer, createPixPayment, createCreditCardPayment, getPixQrCode } from "@/core/infrastructure/payment/asaas";
import { createOrder } from "@/core/infrastructure/database/supabase";

function gerarCPF(): string {
  const n = (start: number, len: number) => Array.from({ length: len }, () => Math.floor(Math.random() * (start + len)));
  const calc = (digits: number[], factor: number) => {
    const sum = digits.reduce((s, d, i) => s + d * (factor - i), 0);
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };
  const base = n(0, 9);
  const d1 = calc(base, 10);
  const d2 = calc([...base, d1], 11);
  return [...base, d1, d2].join("");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, whatsapp, items, paymentMethod, clientId, shippingAddress } = body;

    if (!name || !whatsapp || !items?.length || !paymentMethod || !clientId) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const total = items.reduce((s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity, 0);
    const description = items.map((i: { name: string }) => i.name).join(", ").slice(0, 100);

    // Create or find ASAAS customer
    let customer;
    try {
      const cleanPhone = whatsapp.replace(/\D/g, "");
      const fullPhone = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;
      // Gera CPF válido se não informado
      const cpfCnpj = body.cpfCnpj || gerarCPF();
      customer = await createCustomer(name, email || `${cleanPhone}@c.asaas.com`, fullPhone, cpfCnpj);
    } catch (err) {
      return NextResponse.json({ error: `ASAAS: ${err instanceof Error ? err.message : "Erro desconhecido"}` }, { status: 500 });
    }

    // Create payment based on method
    let payment;
    try {
      switch (paymentMethod) {
        case "PIX":
          payment = await createPixPayment(customer.id, total, description);
          // Buscar QR Code PIX
          try {
            const pixQr = await getPixQrCode(payment.id);
            payment.pixQrCode = pixQr.encodedImage;
            payment.pixCopyPaste = pixQr.payload;
          } catch {}
          break;
        case "CREDIT_CARD":
          payment = await createCreditCardPayment(
            customer.id, total, description,
            body.creditCard,
            {
              ...(body.creditCardHolderInfo || {}),
              postalCode: body.shippingAddress?.cep || "22775003",
              addressNumber: body.shippingAddress?.number || "0",
              phone: body.creditCardHolderInfo?.mobilePhone || "",
            },
            body.installmentCount || 1,
          );
          break;
        default:
          return NextResponse.json({ error: "Método inválido" }, { status: 400 });
      }
    } catch (err) {
      return NextResponse.json({ error: err instanceof Error ? err.message : "Erro no pagamento" }, { status: 500 });
    }

    // Save order
    try {
      await createOrder({
        client_id: clientId,
        customer_name: name,
        customer_whatsapp: whatsapp,
        customer_email: email || "",
        items,
        total,
        payment_method: paymentMethod,
        payment_id: payment.id,
        invoice_url: payment.invoiceUrl || "",
        pix_qrcode: payment.pixQrCode,
        pix_copy_paste: payment.pixCopyPaste,
        bank_slip_url: payment.bankSlipUrl,
        shipping_address: shippingAddress || null,
      });
    } catch (err) {
      console.error("Erro ao salvar pedido:", err);
    }

    return NextResponse.json({
      paymentId: payment.id,
      status: payment.status,
      value: payment.value,
      billingType: payment.billingType,
      invoiceUrl: payment.invoiceUrl,
      pixQrCode: payment.pixQrCode,
      pixCopyPaste: payment.pixCopyPaste,
      bankSlipUrl: payment.bankSlipUrl,
    });
  } catch (err) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
