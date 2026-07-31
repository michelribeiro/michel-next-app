"use client";

import { useState, useCallback } from "react";

// ─── Helpers ─────────────────────────────────────────────

function maskWhatsApp(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7)
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatPrice(price: number) {
  return `R$ ${price.toFixed(2).replace(".", ",")}`;
}

// ─── Mock data ───────────────────────────────────────────

const MOCK_CLIENT = {
  name: "Salto Duplo Rio",
  logo: "👟",
  description:
    "Tênis importados com qualidade e estilo. Frete grátis para todo o Brasil.",
  primaryColor: "#8B5CF6",
};

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Air Max 90",
    type: "product" as const,
    price: 599.9,
    image: null,
    description:
      "Tênis <b>Nike Air Max 90</b> original. Conforto e estilo para o dia a dia.<br/><br/>✅ Original<br/>✅ Garantia 12 meses<br/>✅ Frete grátis",
  },
  {
    id: 2,
    name: "Ultraboost 22",
    type: "product" as const,
    price: 799.9,
    image: null,
    description:
      "Adidas Ultraboost 22 — o tênis mais confortável do mercado.<br/><br/>✅ Original<br/>✅ Para corrida e casual",
  },
  {
    id: 3,
    name: "Vans Old Skool",
    type: "product" as const,
    price: 349.9,
    image: null,
    description: "Vans Old Skool preto e branco. Clássico e atemporal.",
  },
  {
    id: 4,
    name: "Consultoria de Estilo",
    type: "service" as const,
    price: 197.0,
    image: null,
    description: "Sessão online de 1h para montar seu guarda-roupa ideal.",
  },
];

type Product = (typeof MOCK_PRODUCTS)[0];

interface CartItem {
  product: Product;
  quantity: number;
}

// ─── Product Modal ───────────────────────────────────────

function ProductModal({
  product,
  onClose,
  onAddToCart,
}: {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}) {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-zinc-900 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image placeholder */}
        <div className="mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-zinc-800/50">
          <span className="text-8xl opacity-20">
            {product.type === "service" ? "🔧" : "👟"}
          </span>
        </div>

        <div className="mb-1 flex items-center gap-2">
          <span className="text-xs text-zinc-500">
            {product.type === "product" ? "📦 Produto físico" : "🔧 Serviço"}
          </span>
        </div>

        <h2 className="mb-2 text-xl font-bold text-white">{product.name}</h2>

        <div
          className="mb-4 text-sm leading-relaxed text-zinc-400"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />

        <div className="mb-6 text-3xl font-bold text-violet-400">
          {formatPrice(product.price)}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 bg-zinc-800 py-3 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            Continuar vendo
          </button>
          <button
            onClick={() => {
              onAddToCart(product);
              onClose();
            }}
            className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3 text-sm font-medium text-white transition-all hover:opacity-90"
          >
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Cart Drawer ─────────────────────────────────────────

function CartDrawer({
  items,
  onClose,
  onRemove,
  onCheckout,
}: {
  items: CartItem[];
  onClose: () => void;
  onRemove: (productId: number) => void;
  onCheckout: () => void;
}) {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-md flex-col bg-zinc-900 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            Carrinho ({items.length})
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto">
          {items.length === 0 ? (
            <p className="py-12 text-center text-zinc-500">Carrinho vazio</p>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-zinc-800/50 p-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-700/50 text-xl">
                  {item.product.type === "service" ? "🔧" : "👟"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {formatPrice(item.product.price)}
                  </p>
                </div>
                <button
                  onClick={() => onRemove(item.product.id)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Remover
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-white/5 pt-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-zinc-400">Total</span>
              <span className="text-xl font-bold text-white">{formatPrice(total)}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3 text-sm font-medium text-white transition-all hover:opacity-90"
            >
              Finalizar pedido
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Checkout Modal ──────────────────────────────────────

function CheckoutModal({
  items,
  onClose,
}: {
  items: CartItem[];
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [step, setStep] = useState<"form" | "payment" | "done">("form");

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const hasPhysicalProducts = items.some((item) => item.product.type === "product");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePayment = () => {
    setStep("done");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-zinc-900 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {step === "done" ? (
          <div className="text-center">
            <div className="mb-3 text-5xl">✅</div>
            <h2 className="mb-2 text-lg font-bold text-white">Pagamento confirmado!</h2>
            <p className="mb-2 text-sm text-zinc-400">
              Seu pedido já foi enviado para <span className="text-violet-400">{MOCK_CLIENT.name}</span>.
              A loja vai preparar seus itens!
            </p>
            <div className="mb-4 rounded-xl bg-zinc-800/50 p-3 text-left text-sm">
              {items.map((item) => (
                <p key={item.product.id} className="text-zinc-300">
                  🛒 {item.product.name} — {formatPrice(item.product.price)}
                </p>
              ))}
              <p className="mt-2 border-t border-white/5 pt-2 font-bold text-white">
                Total pago: {formatPrice(total)}
              </p>
            </div>
            <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-left text-xs text-amber-400">
              ⏳ A loja foi notificada e vai confirmar o pedido em breve.
              Você pode acompanhar pelo WhatsApp.
            </div>
            <button
              onClick={onClose}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3 text-sm font-medium text-white"
            >
              Continuar comprando
            </button>
          </div>
        ) : step === "payment" ? (
          <>
            <h2 className="mb-1 text-lg font-bold text-white">💳 Pagamento</h2>
            <p className="mb-4 text-sm text-zinc-500">
              Escolha a forma de pagamento:
            </p>

            <div className="mb-4 rounded-xl bg-zinc-800/50 p-3 text-sm">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-zinc-300">
                  <span>{item.product.name}</span>
                  <span>{formatPrice(item.product.price)}</span>
                </div>
              ))}
              <div className="mt-2 flex justify-between border-t border-white/5 pt-2 font-bold text-white">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handlePayment}
                className="w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 py-4 text-sm font-medium text-white transition-all hover:opacity-90"
              >
                💳 Pagar com Cartão de Crédito
              </button>
              <button
                onClick={handlePayment}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 py-4 text-sm font-medium text-white transition-all hover:opacity-90"
              >
                📱 Pagar com PIX
              </button>
              <button
                onClick={handlePayment}
                className="w-full rounded-xl border border-white/10 bg-zinc-800 py-4 text-sm font-medium text-zinc-400 transition-all hover:text-white"
              >
                📄 Boleto Bancário
              </button>
            </div>

            <button
              type="button"
              onClick={() => setStep("form")}
              className="mt-4 w-full text-sm text-zinc-500 hover:text-zinc-300"
            >
              Voltar
            </button>
          </>
        ) : (
          <>
            <h2 className="mb-1 text-lg font-bold text-white">Finalizar pedido</h2>
            <p className="mb-4 text-sm text-zinc-500">
              Deixe seus dados para seguir com o pagamento.
            </p>

            {/* Order summary */}
            <div className="mb-4 rounded-xl bg-zinc-800/50 p-3 text-sm">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-zinc-300">
                  <span>{item.product.name}</span>
                  <span>{formatPrice(item.product.price)}</span>
                </div>
              ))}
              <div className="mt-2 flex justify-between border-t border-white/5 pt-2 font-bold text-white">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
                  placeholder="Seu nome"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-500">WhatsApp</label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(maskWhatsApp(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
              {hasPhysicalProducts && (
                <div className="rounded-xl border border-white/5 bg-zinc-800/30 p-4">
                  <p className="mb-3 text-xs font-medium text-zinc-400">
                    📦 Endereço de entrega
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1">
                      <input
                        type="text"
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                        placeholder="CEP"
                        className="w-full rounded-xl border border-white/10 bg-zinc-800 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Endereço"
                        className="w-full rounded-xl border border-white/10 bg-zinc-800 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="Número"
                      className="rounded-xl border border-white/10 bg-zinc-800 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500"
                      required
                    />
                    <input
                      type="text"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="Bairro"
                      className="rounded-xl border border-white/10 bg-zinc-800 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500"
                      required
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Cidade"
                        className="rounded-xl border border-white/10 bg-zinc-800 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500"
                        required
                      />
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="UF"
                        maxLength={2}
                        className="rounded-xl border border-white/10 bg-zinc-800 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={!name || !whatsapp || (hasPhysicalProducts && (!cep || !address || !number || !neighborhood || !city || !state))}
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3 text-sm font-medium text-white transition-all disabled:opacity-50"
              >
                Ir para pagamento 💳
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full text-sm text-zinc-500 hover:text-zinc-300"
              >
                Continuar comprando
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Chat IA ─────────────────────────────────────────────

const IA_KNOWLEDGE = `
Você é a vendedora da loja Salto Duplo Rio.
Você conhece todos os produtos da loja e ajuda os clientes a escolherem.
Se o cliente pedir para comprar, você confirma e ADICIONA ao carrinho.
Seja educada e entusiasta.

Produtos disponíveis:
1. Air Max 90 - R$ 599,90 - Tênis Nike original, conforto e estilo
2. Ultraboost 22 - R$ 799,90 - Tênis Adidas, mais confortável do mercado
3. Vans Old Skool - R$ 349,90 - Clássico e atemporal
4. Consultoria de Estilo - R$ 197,00 - Sessão online 1h
`;

function ChatIA({
  onAddToCart,
}: {
  onAddToCart: (product: Product) => void;
}) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<
    { from: "bot" | "user"; text: string; action?: string }[]
  >([
    {
      from: "bot",
      text: "Olá! 👋 Eu sou a assistente da Salto Duplo Rio! Quer conhecer nossos produtos?",
    },
  ]);

  const handleSend = useCallback(
    (text?: string) => {
      const msg = (text || message).trim();
      if (!msg) return;

      setChat((prev) => [...prev, { from: "user", text: msg }]);
      setMessage("");

      // Simulate IA response
      setTimeout(() => {
        const lower = msg.toLowerCase();

        // Check if user wants to buy something
        const productKeywords: { keyword: string; product: Product }[] = [
          { keyword: "air max", product: MOCK_PRODUCTS[0] },
          { keyword: "ultraboost", product: MOCK_PRODUCTS[1] },
          { keyword: "vans", product: MOCK_PRODUCTS[2] },
          { keyword: "consultoria", product: MOCK_PRODUCTS[3] },
          { keyword: "estilo", product: MOCK_PRODUCTS[3] },
        ];

        const found = productKeywords.find((p) => lower.includes(p.keyword));
        const wantsToBuy =
          lower.includes("quero") ||
          lower.includes("comprar") ||
          lower.includes("adiciona") ||
          lower.includes("coloca");

        if (found && wantsToBuy) {
          onAddToCart(found.product);
          setChat((prev) => [
            ...prev,
            {
              from: "bot",
              text: `✅ Adicionei **${found.product.name}** (${formatPrice(found.product.price)}) ao seu carrinho! Quer mais alguma coisa?`,
              action: "added_to_cart",
            },
          ]);
        } else if (lower.includes("carrinho")) {
          setChat((prev) => [
            ...prev,
            {
              from: "bot",
              text: "🛒 Clique no ícone do carrinho no topo da página pra ver seus itens!",
            },
          ]);
        } else if (lower.includes("obrigado") || lower.includes("valeu")) {
          setChat((prev) => [
            ...prev,
            {
              from: "bot",
              text: "Por nada! 😊 Qualquer dúvida, é só chamar!",
            },
          ]);
        } else {
          setChat((prev) => [
            ...prev,
            {
              from: "bot",
              text: `Legal! 😊 Esses são nossos produtos:\n\n👟 **Air Max 90** — ${formatPrice(MOCK_PRODUCTS[0].price)}\n👟 **Ultraboost 22** — ${formatPrice(MOCK_PRODUCTS[1].price)}\n👟 **Vans Old Skool** — ${formatPrice(MOCK_PRODUCTS[2].price)}\n🔧 **Consultoria de Estilo** — ${formatPrice(MOCK_PRODUCTS[3].price)}\n\nQual te interessou? Posso adicionar ao carrinho pra você!`,
            },
          ]);
        }
      }, 800);
    },
    [message, onAddToCart]
  );

  return (
    <div className="rounded-2xl border border-white/5 bg-zinc-900">
      <div className="border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600 text-sm">
            🤖
          </span>
          <div>
            <p className="text-sm font-medium text-white">IA da Salto Duplo Rio</p>
            <p className="text-xs text-green-400">● Online</p>
          </div>
        </div>
      </div>

      <div className="h-64 space-y-3 overflow-y-auto p-4">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                msg.from === "user"
                  ? "bg-violet-600 text-white"
                  : "bg-zinc-800 text-zinc-300"
              }`}
            >
              {msg.text.split("\n").map((line, j) => (
                <span key={j}>
                  {line}
                  {j < msg.text.split("\n").length - 1 && <br />}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5 p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder='Ex: "Quero um Air Max" ou "Qual o melhor tênis?"'
            className="flex-1 rounded-xl border border-white/10 bg-zinc-800 px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500"
          />
          <button
            onClick={() => handleSend()}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2.5 text-sm text-white transition-all hover:opacity-90"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────

export default function ClienteMockPage() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mock_cart");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [newsletterName, setNewsletterName] = useState("");
  const [newsletterWpp, setNewsletterWpp] = useState("");

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      const updated = existing
        ? prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev, { product, quantity: 1 }];
      localStorage.setItem("mock_cart", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFromCart = (productId: number) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.product.id !== productId);
      localStorage.setItem("mock_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Header images disponíveis no admin
  const HEADER_IMAGES = [
    { id: 1, name: "Loja moderna", url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200" },
    { id: 2, name: "Roupas", url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200" },
    { id: 3, name: "Tênis", url: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200" },
    { id: 4, name: "Comida", url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200" },
    { id: 5, name: "Tecnologia", url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200" },
    { id: 6, name: "Natureza", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200" },
  ];

  const selectedHeader = HEADER_IMAGES[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Header com imagem de fundo */}
      <div className="relative">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${selectedHeader.url})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0a0a0a]" />

        <header className="relative px-6 py-12">
          <div className="mx-auto flex max-w-6xl items-start justify-between">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{MOCK_CLIENT.logo}</span>
              <div>
                <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                  {MOCK_CLIENT.name}
                </h1>
                <p className="mt-1 text-base text-zinc-300 drop-shadow">
                  {MOCK_CLIENT.description}
                </p>
              </div>
            </div>

            {/* Cart button */}
            <button
              onClick={() => setShowCart(true)}
              className="relative rounded-xl border border-white/20 bg-black/40 px-4 py-2.5 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/60"
            >
              🛒 Carrinho
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </header>
      </div>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Products */}
          <div className="lg:col-span-2">
            <h2 className="mb-6 text-2xl font-bold">
              {MOCK_CLIENT.name === "Salto Duplo Rio" ? "👟 Produtos" : "📦 Produtos"}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {MOCK_PRODUCTS.map((product) => (
                <div
                  key={product.id}
                  className="group cursor-pointer rounded-2xl border border-white/5 bg-zinc-900 p-5 transition-all hover:border-white/10"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-zinc-800/50">
                    <span className="text-6xl opacity-30">
                      {product.type === "service" ? "🔧" : "👟"}
                    </span>
                  </div>

                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-xs text-zinc-600">
                      {product.type === "product" ? "📦 Produto" : "🔧 Serviço"}
                    </span>
                  </div>

                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {product.name}
                  </h3>

                  <div className="mb-3 text-2xl font-bold text-violet-400">
                    {formatPrice(product.price)}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="w-full rounded-xl border border-violet-500/30 bg-violet-500/10 py-2.5 text-sm font-medium text-violet-400 transition-all hover:bg-violet-500/20 active:scale-95"
                  >
                    + Adicionar ao carrinho
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Chat */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-zinc-500">
                💬 Tire dúvidas com a IA
              </h3>
              <ChatIA onAddToCart={addToCart} />
            </div>

            {/* Newsletter */}
            <div className="rounded-2xl border border-white/5 bg-zinc-900 p-5">
              {newsletterSent ? (
                <div className="text-center">
                  <div className="mb-2 text-3xl">🔔</div>
                  <p className="text-sm text-zinc-400">
                    Você receberá novidades no WhatsApp!
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="mb-1 text-sm font-semibold text-white">
                    🔔 Receba novidades
                  </h3>
                  <p className="mb-4 text-xs text-zinc-500">
                    Ofertas exclusivas e lançamentos direto no seu WhatsApp.
                  </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setNewsletterSent(true);
                    }}
                    className="space-y-3"
                  >
                    <input
                      type="text"
                      value={newsletterName}
                      onChange={(e) => setNewsletterName(e.target.value)}
                      placeholder="Seu nome"
                      className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500"
                      required
                    />
                    <input
                      type="tel"
                      value={newsletterWpp}
                      onChange={(e) => setNewsletterWpp(maskWhatsApp(e.target.value))}
                      placeholder="WhatsApp"
                      className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full rounded-xl border border-violet-500/30 bg-violet-500/10 py-2.5 text-sm font-medium text-violet-400 transition-all hover:bg-violet-500/20"
                    >
                      Quero receber ofertas
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-6 text-center text-sm text-zinc-600">
        Powered by <span className="text-violet-400">Robô Vendedor</span>
      </footer>

      {/* Modals */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />

      {showCart && (
        <CartDrawer
          items={cart}
          onClose={() => setShowCart(false)}
          onRemove={removeFromCart}
          onCheckout={() => {
            setShowCart(false);
            setShowCheckout(true);
          }}
        />
      )}

      {showCheckout && (
        <CheckoutModal
          items={cart}
          onClose={() => {
            setShowCheckout(false);
            setCart([]);
            localStorage.removeItem("mock_cart");
          }}
        />
      )}
    </div>
  );
}
