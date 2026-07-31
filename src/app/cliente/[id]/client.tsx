"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface StoreData {
  id: number; name: string; whatsapp: string; description: string;
  logo: string; primary_color: string; header_image: string; header_name: string; pixel_id: string;
  absorb_fees: boolean;
}

interface ProductData {
  id: number; name: string; type: "product" | "service";
  price: number; images: string[]; description: string;
}

interface CartItem { product: ProductData; quantity: number; }

function maskWhatsApp(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function formatPrice(p: number) { return `R$ ${p.toFixed(2).replace(".", ",")}`; }

function maskCardNumber(v: string) { return v.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ").slice(0, 19); }
function maskExpiry(v: string) { return v.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "$1/$2").slice(0, 5); }
function maskCpf(v: string) { return v.replace(/\D/g, "").replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*$/, "$1.$2.$3-$4").slice(0, 14); }

// ─── Product Modal ───────────────────────────────────────

function ProductModal({ product, onClose, onAdd }: { product: ProductData | null; onClose: () => void; onAdd: (p: ProductData) => void }) {
  const [imgIdx, setImgIdx] = useState(0);
  useEffect(() => { setImgIdx(0); }, [product]);
  if (!product) return null;
  const images = product.images || [];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-zinc-900 p-6" onClick={(e) => e.stopPropagation()}>
        {images.length > 0 ? (
          <div className="relative mb-4">
            <img src={images[imgIdx]} alt={product.name} className="aspect-square w-full rounded-xl bg-zinc-800/50 object-contain p-4" />
            {images.length > 1 && (<>
              <button onClick={(e) => { e.stopPropagation(); setImgIdx((i) => (i - 1 + images.length) % images.length); }} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white backdrop-blur-sm hover:bg-black/80"><ChevronLeft className="h-5 w-5" /></button>
              <button onClick={(e) => { e.stopPropagation(); setImgIdx((i) => (i + 1) % images.length); }} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white backdrop-blur-sm hover:bg-black/80"><ChevronRight className="h-5 w-5" /></button>
            </>)}
          </div>
        ) : (
          <div className="mb-4 flex aspect-square items-center justify-center rounded-xl bg-zinc-800/50 text-7xl opacity-30">{product.type === "service" ? "🔧" : "📦"}</div>
        )}
        <span className="text-xs text-zinc-500">{product.type === "product" ? "📦 Produto" : "🔧 Serviço"}</span>
        <h2 className="mb-2 mt-1 text-xl font-bold text-white">{product.name}</h2>
        <div className="mb-4 overflow-x-hidden break-words text-sm leading-relaxed text-zinc-400" dangerouslySetInnerHTML={{ __html: product.description }} />
        <div className="mb-6 text-3xl font-bold text-violet-400">{formatPrice(product.price)}</div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 bg-zinc-800 py-3 text-sm text-zinc-400 hover:text-white">Continuar vendo</button>
          <button onClick={() => { onAdd(product); onClose(); }} className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3 text-sm font-medium text-white hover:opacity-90">Adicionar ao carrinho</button>
        </div>
      </div>
    </div>
  );
}

// ─── Cart Drawer ─────────────────────────────────────────

function CartDrawer({ items, onClose, onRemove, onCheckout }: { items: CartItem[]; onClose: () => void; onRemove: (id: number) => void; onCheckout: () => void }) {
  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60" onClick={onClose}>
      <div className="flex w-full max-w-md flex-col bg-zinc-900 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Carrinho ({items.length})</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-zinc-500 hover:text-white" /></button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto">
          {items.length === 0 ? <p className="py-12 text-center text-zinc-500">Vazio</p> : items.map((item) => (
            <div key={item.product.id} className="flex items-center gap-3 rounded-xl border border-white/5 bg-zinc-800/50 p-3">
              {item.product.images?.[0] ? <img src={item.product.images[0]} alt={item.product.name} className="h-12 w-12 rounded-lg object-cover" /> : <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-700/50 text-xl">{item.product.type === "service" ? "🔧" : "📦"}</div>}
              <div className="flex-1"><p className="text-sm font-medium text-white">{item.product.name}</p><p className="text-xs text-zinc-500">{formatPrice(item.product.price)}</p></div>
              <button onClick={() => onRemove(item.product.id)} className="text-xs text-red-400 hover:text-red-300">Remover</button>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="border-t border-white/5 pt-4">
            <div className="mb-4 flex items-center justify-between"><span className="text-zinc-400">Total</span><span className="text-xl font-bold text-white">{formatPrice(total)}</span></div>
            <button onClick={onCheckout} className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3 text-sm font-medium text-white hover:opacity-90">Finalizar pedido</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Checkout Modal ──────────────────────────────────────

function CheckoutModal({ items, onClose, storeName, clientDbId, store, onPaid }: { items: CartItem[]; onClose: () => void; storeName: string; clientDbId: number; store: StoreData; onPaid?: () => void }) {
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [cpf, setCpf] = useState(""); const [whatsapp, setWhatsapp] = useState("");
  const [cep, setCep] = useState(""); const [address, setAddress] = useState(""); const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState(""); const [city, setCity] = useState(""); const [state, setState] = useState("");
  const [step, setStep] = useState<"form" | "payment" | "pix_info" | "done">("form");
  const [paymentData, setPaymentData] = useState<{ pixCode?: string; invoiceUrl?: string; paymentId?: string } | null>(null);
  const [loading, setLoading] = useState(false); const [error, setError] = useState(""); const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false); const [paid, setPaid] = useState(false);
  const [canceled, setCanceled] = useState(false); const [canceling, setCanceling] = useState(false); const [notFound, setNotFound] = useState(false);
  const [cardNumber, setCardNumber] = useState(""); const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState(""); const [cardCvv, setCardCvv] = useState(""); const [cardInstallments, setCardInstallments] = useState(1);
  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const hasPhysical = items.some((i) => i.product.type === "product");

  const handlePayment = async (method: string) => {
    setLoading(true); setError("");
    const body: Record<string, unknown> = {
      name, email, whatsapp, cpfCnpj: cpf, clientId: clientDbId, paymentMethod: method,
      items: items.map((i) => ({ name: i.product.name, price: i.product.price, quantity: i.quantity })),
      installmentCount: cardInstallments,
      shippingAddress: hasPhysical ? { cep, address, number, neighborhood, city, state } : null,
    };
    if (method === "CREDIT_CARD") {
      const [expiryMonth, expiryYear] = cardExpiry.split("/");
      body.creditCard = { holderName: cardName, number: cardNumber.replace(/\D/g, ""), expiryMonth, expiryYear: expiryYear ? `20${expiryYear}` : "", ccv: cardCvv };
      body.creditCardHolderInfo = { name, email, cpfCnpj: cpf, mobilePhone: whatsapp.replace(/\D/g, "") };
    }
    try {
      const res = await fetch("/api/payment/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro no pagamento");
      setPaymentData({ pixCode: data.pixCopyPaste, invoiceUrl: data.invoiceUrl, paymentId: data.paymentId });
      setStep("done");
    } catch (err) { setError(err instanceof Error ? err.message : "Erro no pagamento"); } finally { setLoading(false); }
  };

  const checkPayment = async () => {
    setChecking(true); setNotFound(false);
    try {
      const res = await fetch(`/api/payment/check?id=${paymentData?.paymentId}`);
      const data = await res.json();
      if (data.confirmed) setPaid(true);
      else setNotFound(true);
    } catch { setNotFound(true); }
    setChecking(false);
  };

  const simulatePayment = async () => {
    setChecking(true);
    try {
      await fetch("/api/payment/simulate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentId: paymentData?.paymentId }) });
      setPaid(true);
    } catch {}
    setChecking(false);
  };

  const cancelOrder = async () => {
    setCanceling(true);
    try { await fetch("/api/payment/cancel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentId: paymentData?.paymentId }) }); } catch {}
    setCanceled(true); setCanceling(false);
  };

  const isCard = !paymentData?.pixCode && paymentData?.invoiceUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-zinc-900 p-6" onClick={(e) => e.stopPropagation()}>

        {step === "done" && paymentData && !paid && !canceled && paymentData.pixCode && (
          <>
            <div className="mb-6 border-b border-white/5 pb-4 text-center">
              {store.logo.startsWith("http") ? <img src={store.logo} alt="" className="mx-auto mb-2 h-12 w-12 rounded-xl object-cover" /> : <div className="mx-auto mb-2 text-3xl">{store.logo}</div>}
              <h2 className="text-lg font-bold text-white">{storeName}</h2>
              <p className="mt-3 inline-block rounded-full bg-amber-500/10 px-4 py-1 text-xs font-medium text-amber-400">⏳ Aguardando pagamento PIX</p>
            </div>
            <p className="mb-4 text-center text-sm text-zinc-300">Pague o PIX no app do seu banco e <strong className="text-white">volte a esta tela</strong> para confirmar.</p>
            <div className="mb-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
              <p className="mb-2 text-xs font-medium text-cyan-400">PIX Copia e Cola</p>
              <div className="mb-3 rounded-lg bg-zinc-800 p-3"><p className="break-all font-mono text-xs text-zinc-300">{paymentData.pixCode}</p></div>
              <button onClick={() => { navigator.clipboard.writeText(paymentData.pixCode || ""); setCopied(true); }} className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 py-2.5 text-sm font-medium text-white hover:opacity-90">{copied ? "Copiado!" : "Copiar código PIX"}</button>
              <button onClick={checkPayment} disabled={checking} className="mt-2 w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50">{checking ? "Verificando..." : "Conferir pagamento"}</button>
              {notFound && <button onClick={simulatePayment} disabled={checking} className="mt-2 w-full rounded-xl border border-amber-500/30 bg-amber-500/10 py-2.5 text-sm font-medium text-amber-400 hover:bg-amber-500/20 disabled:opacity-50">{checking ? "Processando..." : "Simular pagamento"}</button>}
              <button onClick={cancelOrder} disabled={canceling} className="mt-3 w-full text-sm text-zinc-500 hover:text-zinc-300 disabled:opacity-50">{canceling ? "Cancelando..." : "Desistir da compra"}</button>
            </div>
          </>
        )}

        {step === "done" && canceled && (
          <div className="mb-6 text-center">
            <p className="mb-4 text-zinc-400">Compra cancelada.</p>
            <button onClick={onClose} className="rounded-xl border border-white/10 bg-zinc-800 px-6 py-3 text-sm text-zinc-400 hover:text-white">Fechar</button>
          </div>
        )}

        {step === "done" && (paid || isCard) && !canceled && (
          <div className="mb-6 text-center">
            <div className="mb-3 text-5xl">🎉</div>
            <h3 className="mb-2 text-lg font-bold text-white">Parabéns pela compra!</h3>
            <p className="mb-4 text-sm text-zinc-400">Você receberá um e-mail com os dados da compra.</p>
            <button onClick={() => { onPaid?.(); onClose(); }} className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3 text-sm font-medium text-white hover:opacity-90">Continuar comprando</button>
          </div>
        )}

        {step === "done" && paymentData && (paid || isCard) && !canceled && null}
        {step === "done" && paymentData && (paid || isCard) && !canceled && null}

        {(step === "done" && paymentData && (paid || isCard) && !canceled) || step !== "done" ? (
          <>
            {/* Resumo - shows for all steps except canceled */}
            {step !== "form" && step !== "payment" && !canceled && (
              <>
              <div className="mb-4 rounded-xl bg-zinc-800/50 p-4 text-sm">
                <p className="mb-2 text-xs font-medium text-zinc-500">Resumo do pedido</p>
                {items.map((i) => <div key={i.product.id} className="flex justify-between py-1 text-zinc-300"><span>{i.product.name}</span><span>{formatPrice(i.product.price * i.quantity)}</span></div>)}
                {!store.absorb_fees && paymentData?.pixCode && (
                  <div className="flex justify-between py-1 text-zinc-400"><span>Taxa PIX</span><span>{formatPrice(0.99)}</span></div>
                )}
                <div className="mt-2 flex justify-between border-t border-white/5 pt-2 font-bold text-white"><span>Total</span><span className="text-violet-400">{formatPrice(total + (!store.absorb_fees && paymentData?.pixCode ? 0.99 : 0))}</span></div>
              </div>
              <div className="mb-4 rounded-xl bg-zinc-800/30 p-3 text-xs text-zinc-400">
                <p><span className="text-zinc-600">CPF:</span> {maskCpf(cpf)}</p>
                <p className="mt-1"><span className="text-zinc-600">WhatsApp:</span> {whatsapp}</p>
                {hasPhysical && <p className="mt-1"><span className="text-zinc-600">Endereço:</span> {address}, {number} - {neighborhood}, {city}/{state}</p>}
              </div>
              </>
            )}
          </>
        ) : null}

        {step !== "done" && !canceled && (() => {
          if (step === "form") return (
            <div>
              <h2 className="mb-1 text-lg font-bold text-white">Finalizar pedido</h2>
              <p className="mb-4 text-sm text-zinc-500">Deixe seus dados.</p>
              <div className="mb-4 rounded-xl bg-zinc-800/50 p-3 text-sm">
                {items.map((i) => <div key={i.product.id} className="flex justify-between text-zinc-300"><span>{i.product.name}</span><span>{formatPrice(i.product.price)}</span></div>)}
                <div className="mt-2 flex justify-between border-t border-white/5 pt-2 font-bold text-white"><span>Total</span><span>{formatPrice(total)}</span></div>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); setStep("payment"); setError(""); }} className="space-y-4">
                <div><label className="mb-1 block text-xs text-zinc-500">Nome</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-violet-500" placeholder="Seu nome" required /></div>
                <div><label className="mb-1 block text-xs text-zinc-500">E-mail</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-violet-500" placeholder="email@exemplo.com" /></div>
                <div><label className="mb-1 block text-xs text-zinc-500">CPF</label><input type="text" value={maskCpf(cpf)} onChange={(e) => setCpf(e.target.value.replace(/\D/g, "").slice(0, 11))} className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-violet-500" placeholder="123.456.789-00" required /></div>
                <div><label className="mb-1 block text-xs text-zinc-500">WhatsApp</label><input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(maskWhatsApp(e.target.value))} className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-violet-500" placeholder="(11) 99999-9999" required /></div>
                {hasPhysical && <div className="rounded-xl border border-white/5 bg-zinc-800/30 p-4">
                  <p className="mb-3 text-xs font-medium text-zinc-400">📦 Endereço</p>
                  <div className="grid grid-cols-3 gap-3">
                    <input type="text" value={cep} onChange={(e) => setCep(e.target.value)} placeholder="CEP" className="col-span-1 rounded-xl border border-white/10 bg-zinc-800 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500" required />
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Endereço" className="col-span-2 rounded-xl border border-white/10 bg-zinc-800 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500" required />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    <input type="text" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Número" className="rounded-xl border border-white/10 bg-zinc-800 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500" required />
                    <input type="text" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder="Bairro" className="rounded-xl border border-white/10 bg-zinc-800 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500" required />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Cidade" className="rounded-xl border border-white/10 bg-zinc-800 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500" required />
                      <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="UF" maxLength={2} className="rounded-xl border border-white/10 bg-zinc-800 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500" required />
                    </div>
                  </div>
                </div>}
                <button type="submit" disabled={!name || !email || !whatsapp || !cpf || (hasPhysical && (!cep || !address || !number || !neighborhood || !city || !state))} className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3 text-sm font-medium text-white disabled:opacity-50">Ir para pagamento</button>
                <button type="button" onClick={onClose} className="w-full text-sm text-zinc-500 hover:text-zinc-300">Continuar comprando</button>
              </form>
            </div>
          );

          if (step === "pix_info") return (
            <div>
              <h2 className="mb-1 text-lg font-bold text-white">Pagamento PIX</h2>
              <p className="mb-6 text-sm text-zinc-300">Pague com PIX usando o código. Após o pagamento, volte para confirmar.</p>
              {error && <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">{error}</div>}
              <button onClick={() => handlePayment("PIX")} disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50">{loading ? "Gerando PIX..." : "Gerar código PIX"}</button>
              <button onClick={() => { setStep("payment"); setError(""); }} className="mt-3 w-full text-sm text-zinc-500 hover:text-zinc-300">Voltar para cartão</button>
            </div>
          );

          if (step === "payment") return (
            <div>
              <h2 className="mb-4 text-lg font-bold text-white">Pagamento</h2>
              <div className="mb-4 rounded-xl bg-zinc-800/50 p-3 text-sm">
                {items.map((i) => <div key={i.product.id} className="flex justify-between text-zinc-300"><span>{i.product.name}</span><span>{formatPrice(i.product.price)}</span></div>)}
                <div className="mt-2 flex justify-between border-t border-white/5 pt-2 font-bold text-white"><span>Total</span><span>{formatPrice(total)}</span></div>
              </div>
              {!store.absorb_fees && <div className="mb-4 rounded-xl border border-violet-500/10 bg-violet-500/[0.03] p-3 text-xs">
                <p className="mb-1.5 font-medium text-violet-400">Taxas do cartão</p>
                <div className="flex justify-between"><span className="text-zinc-400">Crédito à vista</span><span className="text-zinc-300">3,99%</span></div>
                <div className="flex justify-between"><span className="text-zinc-400">Parcelado</span><span className="text-zinc-300">4,99% a 6,99%</span></div>
              </div>}
              {error && <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">{error}</div>}
              <div className="rounded-xl border border-white/5 bg-zinc-800/30 p-4">
                <p className="mb-3 text-xs font-medium text-zinc-400">Dados do cartão</p>
                <div className="space-y-3">
                  <input type="text" value={cardNumber} onChange={(e) => setCardNumber(maskCardNumber(e.target.value))} placeholder="Número do cartão" className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500" />
                  <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value.toUpperCase())} placeholder="Nome do titular" className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500" />
                  <div className="grid grid-cols-3 gap-3">
                    <input type="text" value={cardExpiry} onChange={(e) => setCardExpiry(maskExpiry(e.target.value))} placeholder="MM/AA" className="rounded-xl border border-white/10 bg-zinc-800 px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500" />
                    <input type="text" value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="CVV" className="rounded-xl border border-white/10 bg-zinc-800 px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500" />
                    <select value={cardInstallments} onChange={(e) => setCardInstallments(Number(e.target.value))} className="rounded-xl border border-white/10 bg-zinc-800 px-2 py-2.5 text-sm text-white outline-none focus:border-violet-500">
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map((n) => {
                        const rate = n <= 1 ? 0.0399 : n <= 6 ? 0.0499 : 0.0699;
                        const totalWithFee = total * (1 + rate);
                        const pct = (rate * 100).toFixed(2).replace(".", ",");
                        return <option key={n} value={n}>{n}x R$ {(totalWithFee / n).toFixed(2).replace(".", ",")} ({pct}%)</option>;
                      })}
                    </select>
                  </div>
                  <button onClick={() => handlePayment("CREDIT_CARD")} disabled={loading || !cardNumber || !cardName || !cardExpiry || !cardCvv} className="w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50">{loading ? "Processando..." : "Pagar com Cartão"}</button>
                </div>
              </div>
              <div className="relative my-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div><div className="relative flex justify-center"><span className="bg-zinc-900 px-3 text-xs text-zinc-600">ou</span></div></div>
              <button onClick={() => { setStep("pix_info"); setError(""); }} className="w-full rounded-xl border border-cyan-500/30 bg-cyan-500/10 py-3 text-sm font-medium text-cyan-400 hover:bg-cyan-500/20">Pagar com PIX</button>
              <button onClick={() => setStep("form")} className="mt-4 w-full text-sm text-zinc-500 hover:text-zinc-300">Voltar</button>
            </div>
          );

          return null;
        })()}

      </div>
    </div>
  );
}

// ─── Chat IA ─────────────────────────────────────────────

function ChatIA({ storeName, products, whatsapp, onAddToCart }: { storeName: string; products: ProductData[]; whatsapp: string; onAddToCart: (p: ProductData) => void }) {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState<{ from: "bot" | "user"; text: string }[]>([{ from: "bot", text: `Olá! 👋 Eu sou a assistente da ${storeName}! Quer conhecer nossos produtos?` }]);
  const [ended, setEnded] = useState(false);

  const handleSend = useCallback((text?: string) => {
    const t = (text || msg).trim(); if (!t || ended) return;
    setChat((prev) => [...prev, { from: "user", text: t }]); setMsg("");
    setTimeout(() => {
      const lower = t.toLowerCase();
      const found = products.find((p) => lower.includes(p.name.toLowerCase().split(" ")[0]));
      const wantsBuy = lower.includes("quero") || lower.includes("comprar") || lower.includes("adiciona");
      if (found && wantsBuy) { onAddToCart(found); setChat((prev) => [...prev, { from: "bot", text: `✅ Adicionei **${found.name}** ao carrinho!` }]); }
      else if (lower.includes("carrinho")) { setChat((prev) => [...prev, { from: "bot", text: "🛒 Clique no carrinho no topo!" }]); }
      else if (lower.includes("falar") || lower.includes("humano") || lower.includes("atendente")) { const w = whatsapp.replace(/\D/g, ""); setChat((prev) => [...prev, { from: "bot", text: `Vou passar pro atendente! 📱 wa.me/${w}` }]); setEnded(true); }
      else if (products.length > 0) { const list = products.map((p) => `${p.type === "product" ? "👟" : "🔧"} **${p.name}** — ${formatPrice(p.price)}`).join("\n"); setChat((prev) => [...prev, { from: "bot", text: `Esses são nossos produtos:\n\n${list}` }]); }
      else { setChat((prev) => [...prev, { from: "bot", text: "Não sei informar. Melhor perguntar pra loja! 😊" }]); }
    }, 800);
  }, [msg, products, whatsapp, onAddToCart, ended, storeName]);

  return (
    <div className="rounded-2xl border border-white/5 bg-zinc-900">
      <div className="border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600 text-sm">🤖</span>
          <div><p className="text-sm font-medium text-white">IA da {storeName}</p><p className="text-xs text-green-400">● Online</p></div>
        </div>
      </div>
      <div className="h-64 space-y-3 overflow-y-auto p-4">
        {chat.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${m.from === "user" ? "bg-violet-600 text-white" : "bg-zinc-800 text-zinc-300"}`}>
              {m.text.split("\n").map((l, j) => <span key={j}>{l}{j < m.text.split("\n").length - 1 && <br />}</span>)}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-white/5 p-3">
        <div className="flex gap-2">
          <input type="text" value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder={ended ? "Encerrada" : 'Ex: "Quero tirar dúvida..."'} disabled={ended}
            className="flex-1 rounded-xl border border-white/10 bg-zinc-800 px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500 disabled:opacity-50" />
          <button onClick={() => handleSend()} disabled={ended} className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2.5 text-sm text-white hover:opacity-90 disabled:opacity-50">Enviar</button>
        </div>
      </div>
    </div>
  );
}

// ─── Newsletter ──────────────────────────────────────────

function NewsletterForm({ clientId }: { clientId: number }) {
  const [name, setName] = useState(""); const [wpp, setWpp] = useState(""); const [sent, setSent] = useState(false);
  return (
    <div className="rounded-2xl border border-white/5 bg-zinc-900 p-5">
      {sent ? <div className="text-center"><div className="mb-2 text-3xl">🔔</div><p className="text-sm text-zinc-400">Você receberá novidades!</p></div> : (
        <><h3 className="mb-1 text-sm font-semibold text-white">Receba novidades</h3><p className="mb-4 text-xs text-zinc-500">Ofertas exclusivas no WhatsApp.</p>
          <form onSubmit={async (e) => { e.preventDefault(); await fetch("/api/leads/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clientId, name, whatsapp: wpp }) }); setSent(true); }} className="space-y-3">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500" required />
            <input type="tel" value={wpp} onChange={(e) => setWpp(maskWhatsApp(e.target.value))} placeholder="WhatsApp" className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500" required />
            <button type="submit" className="w-full rounded-xl border border-violet-500/30 bg-violet-500/10 py-2.5 text-sm font-medium text-violet-400 hover:bg-violet-500/20">Quero receber ofertas</button>
          </form>
        </>
      )}
    </div>
  );
}

// ─── Main Client Component ──────────────────────────────

export function ClientePublicClient({ store, products }: { store: StoreData; products: ProductData[] }) {
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [cardImages, setCardImages] = useState<Record<number, number>>({});

  useEffect(() => {
    try { const saved = localStorage.getItem("public_cart"); if (saved) setCart(JSON.parse(saved)); } catch {}
  }, []);

  const addToCart = useCallback((product: ProductData) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      const updated = existing ? prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) : [...prev, { product, quantity: 1 }];
      localStorage.setItem("public_cart", JSON.stringify(updated)); return updated;
    });
  }, []);

  const removeFromCart = (productId: number) => {
    setCart((prev) => { const updated = prev.filter((i) => i.product.id !== productId); localStorage.setItem("public_cart", JSON.stringify(updated)); return updated; });
  };

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${store.header_image})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0a0a0a]" />
        <header className="relative px-6 py-12">
          <div className="mx-auto flex max-w-6xl items-start justify-between">
            <div className="flex items-center gap-4">
              {store.logo.startsWith("http") ? <img src={store.logo} alt={store.name} className="h-14 w-14 rounded-xl object-cover" /> : <span className="text-5xl">{store.logo}</span>}
              <div><h1 className="text-3xl font-bold text-white drop-shadow-lg">{store.name}</h1><p className="mt-1 text-base text-zinc-300 drop-shadow">{store.description}</p></div>
            </div>
            <button onClick={() => setShowCart(true)} className="relative rounded-xl border border-white/20 bg-black/40 px-4 py-2.5 text-sm text-white backdrop-blur-sm hover:bg-black/60">
              🛒 Carrinho{cartCount > 0 && <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">{cartCount}</span>}
            </button>
          </div>
        </header>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-6 text-lg font-semibold text-white">Produtos</h2>
            {products.length === 0 ? (
              <div className="rounded-2xl border border-white/5 bg-zinc-900 p-12 text-center"><p className="text-zinc-500">Nenhum produto disponível.</p></div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {products.map((product) => {
                  const imgs = product.images || [];
                  const imgIdx = cardImages[product.id] || 0;
                  const setImgIdx = (idx: number) => setCardImages((prev) => ({ ...prev, [product.id]: idx }));
                  return <div key={product.id} className="group cursor-pointer rounded-2xl border border-white/5 bg-zinc-900 p-5 transition-all hover:border-white/10" onClick={() => setSelectedProduct(product)}>
                    {imgs.length > 0 ? (
                      <div className="relative mb-4">
                        <img src={imgs[imgIdx]} alt={product.name} className="aspect-square w-full rounded-xl bg-zinc-800/50 object-contain p-3" />
                        {imgs.length > 1 && <><button onClick={(e) => { e.stopPropagation(); setImgIdx((imgIdx - 1 + imgs.length) % imgs.length); }} className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1 text-white backdrop-blur-sm hover:bg-black/80"><ChevronLeft className="h-4 w-4" /></button>
                        <button onClick={(e) => { e.stopPropagation(); setImgIdx((imgIdx + 1) % imgs.length); }} className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1 text-white backdrop-blur-sm hover:bg-black/80"><ChevronRight className="h-4 w-4" /></button></>}
                      </div>
                    ) : <div className="mb-4 flex aspect-square items-center justify-center rounded-xl bg-zinc-800/50 text-6xl opacity-30">{product.type === "service" ? "🔧" : "📦"}</div>}
                    <span className="text-xs text-zinc-600">{product.type === "product" ? "📦 Produto" : "🔧 Serviço"}</span>
                    <h3 className="mb-2 mt-1 text-lg font-semibold text-white">{product.name}</h3>
                    <div className="mb-3 text-2xl font-bold text-violet-400">{formatPrice(product.price)}</div>
                    <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="w-full rounded-xl border border-violet-500/30 bg-violet-500/10 py-2.5 text-sm font-medium text-violet-400 hover:bg-violet-500/20 active:scale-95">+ Adicionar ao carrinho</button>
                  </div>;
                })}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div><h3 className="mb-3 text-lg font-semibold text-white">Tire dúvidas com a IA</h3><ChatIA storeName={store.name} products={products} whatsapp={store.whatsapp} onAddToCart={addToCart} /></div>
            <NewsletterForm clientId={store.id} />
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 px-6 py-6 text-center text-sm text-zinc-600">Powered by <span className="text-violet-400">Robô Vendedor</span></footer>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={addToCart} />
      {showCart && <CartDrawer items={cart} onClose={() => setShowCart(false)} onRemove={removeFromCart} onCheckout={() => { setShowCart(false); setShowCheckout(true); }} />}
      {showCheckout && <CheckoutModal items={cart} storeName={store.name} clientDbId={store.id} store={store}
        onClose={() => { setShowCheckout(false); }}
        onPaid={() => { setCart([]); localStorage.removeItem("public_cart"); }} />}
    </div>
  );
}
