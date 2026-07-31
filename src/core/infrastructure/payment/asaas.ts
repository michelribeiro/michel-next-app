const ASAAS_API_KEY = process.env.CHAVE_ASAAS_SANDBOX || process.env.CHAVE_ASAAS || "";
export const ASAAS_WEBHOOK_TOKEN = process.env.TOKEN_ASAAS_SANDBOX || process.env.TOKEN_ASAAS || "";
const ASAAS_BASE = ASAAS_API_KEY.includes("hmlg")
  ? "https://sandbox.asaas.com/api/v3"
  : "https://www.asaas.com/api/v3";

interface AsaasCustomer {
  id: string;
  name: string;
  email: string;
  mobilePhone?: string;
  cpfCnpj?: string;
}

interface AsaasPayment {
  id: string;
  status: "PENDING" | "RECEIVED" | "CONFIRMED" | "OVERDUE" | "REFUNDED" | "RECEIVED_IN_CASH" | "PARTIAL" | "CANCELED";
  value: number;
  netValue: number;
  billingType: "PIX" | "BOLETO" | "CREDIT_CARD";
  pixQrCode?: string;
  pixCopyPaste?: string;
  invoiceUrl: string;
  bankSlipUrl?: string;
}

async function asaasFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${ASAAS_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "access_token": ASAAS_API_KEY,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.errors?.[0]?.description || `ASAAS: ${res.status}`);
  }

  return res.json();
}

// ─── Customer ────────────────────────────────────────────

export async function createCustomer(name: string, email: string, phone: string, cpfCnpj?: string): Promise<AsaasCustomer> {
  return asaasFetch("/customers", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      mobilePhone: phone.replace(/\D/g, ""),
      cpfCnpj: cpfCnpj || "11111111111",
      notificationDisabled: false,
    }),
  });
}

// ─── Payment ─────────────────────────────────────────────

export async function createPixPayment(
  customerId: string,
  value: number,
  description: string,
): Promise<AsaasPayment> {
  return asaasFetch("/payments", {
    method: "POST",
    body: JSON.stringify({
      customer: customerId,
      billingType: "PIX",
      value,
      description,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    }),
  });
}

export async function createCreditCardPayment(
  customerId: string,
  value: number,
  description: string,
  creditCard?: { holderName: string; number: string; expiryMonth: string; expiryYear: string; ccv: string },
  creditCardHolderInfo?: { name: string; email: string; cpfCnpj: string; mobilePhone: string; postalCode?: string; addressNumber?: string; phone?: string },
  installmentCount?: number,
): Promise<AsaasPayment> {
  const body: Record<string, unknown> = {
    customer: customerId,
    billingType: "CREDIT_CARD",
    value,
    description,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  };

  if (creditCard) body.creditCard = creditCard;
  if (creditCardHolderInfo) body.creditCardHolderInfo = creditCardHolderInfo;
  if (installmentCount && installmentCount > 1) {
    body.installmentCount = installmentCount;
    body.installmentValue = Math.round((value / installmentCount) * 100) / 100;
  }

  return asaasFetch("/payments", { method: "POST", body: JSON.stringify(body) });
}

// ─── PIX QR Code ────────────────────────────────────────

export async function getPixQrCode(paymentId: string): Promise<{ encodedImage?: string; payload?: string }> {
  return asaasFetch(`/payments/${paymentId}/pixQrCode`);
}

// ─── Transferência PIX ──────────────────────────────────

export async function createPixTransfer(
  value: number,
  pixKey: string,
  description: string,
): Promise<{ id: string; status: string; value: number }> {
  return asaasFetch("/transfers", {
    method: "POST",
    body: JSON.stringify({
      value,
      pixKey,
      description,
    }),
  });
}

// ─── Cancelamento ───────────────────────────────────────

export async function cancelPayment(id: string): Promise<void> {
  await asaasFetch(`/payments/${id}/cancel`, { method: "POST" });
}

// ─── Webhook ─────────────────────────────────────────────

export async function getPayment(id: string): Promise<AsaasPayment> {
  return asaasFetch(`/payments/${id}`);
}
