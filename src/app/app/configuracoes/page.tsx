"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/core/infrastructure/auth-context";
import { Upload, Smartphone, CreditCard, Percent, DollarSign, MessageCircle, Palette, Image, Save, Check, Store } from "lucide-react";

interface HeaderImage {
  id: number;
  name: string;
  url: string;
}

interface Settings {
  store_description?: string;
  header_image_id?: number | null;
  whatsapp?: string;
  primary_color?: string;
  logo_url?: string;
  pix_key?: string;
  absorb_fees?: boolean;
  pixel_id?: string;
}

function maskPixKey(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return value;
  if (value.includes("@") || digits.length > 14) return value;
  // CNPJ
  if (digits.length > 11) {
    return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*$/, "$1.$2.$3/$4-$5");
  }
  // CPF ou telefone: tenta detectar telefone (começa com 0 ou 2 dígitos + 9)
  if (digits.length === 11 && /^\d{2}9/.test(digits)) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  // CPF
  return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*$/, "$1.$2.$3-$4");
}

function maskWhatsApp(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function LogoUpload({ logoUrl, onLogoChange, token }: { logoUrl: string; onLogoChange: (url: string) => void; token: string }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST", headers: { authorization: `Bearer ${token}` }, body: fd,
    });
    if (res.ok) {
      const data = await res.json();
      onLogoChange(data.url);
    }
    setUploading(false);
  };

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Upload className="h-4 w-4 text-violet-400" />
        <label className="text-sm font-medium text-zinc-300">Logo da loja</label>
      </div>
      <p className="mb-2 text-xs text-zinc-600">Imagem que aparece no topo da página.</p>
      <div className="flex items-center gap-3">
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="h-14 w-14 rounded-xl object-cover" />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-800 text-2xl">🛒</div>
        )}
        <label className="cursor-pointer rounded-xl border border-white/10 bg-zinc-800 px-4 py-2 text-xs text-zinc-400 hover:text-white">
          {uploading ? "Enviando..." : "Trocar logo"}
          <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
            const f = e.target.files?.[0]; if (f) { await handleUpload(f); e.target.value = ""; }
          }} />
        </label>
        {logoUrl && (
          <button onClick={() => onLogoChange("")} className="text-xs text-red-400 hover:text-red-300">Remover</button>
        )}
      </div>
    </div>
  );
}

const HEADER_IMAGES = [
  { id: 1, name: "Loja moderna", url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200" },
  { id: 2, name: "Roupas", url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200" },
  { id: 3, name: "Tênis", url: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200" },
  { id: 4, name: "Comida", url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200" },
  { id: 5, name: "Tecnologia", url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200" },
  { id: 6, name: "Natureza", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200" },
];

export default function ConfiguracoesPage() {
  const { token } = useAuth();
  const [settings, setSettings] = useState<Settings>({});
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [absorbFees, setAbsorbFees] = useState(true);
  const [pixelId, setPixelId] = useState("");
  const [selectedHeader, setSelectedHeader] = useState<number | null>(null);
  const [color, setColor] = useState("#8B5CF6");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch("/api/client/settings", {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const s = data.settings || {};
        setSettings(s);
        setStoreName(data.store_name || "");
        setDescription(s.store_description || "");
        setWhatsapp(s.whatsapp || "");
        setPixKey(s.pix_key || "");
        setAbsorbFees(s.absorb_fees !== false);
        setPixelId(s.pixel_id || "");
        setSelectedHeader(s.header_image_id || null);
        setColor(s.primary_color || "#8B5CF6");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    const updated = {
      ...settings,
      store_description: description,
      whatsapp,
      pix_key: pixKey,
      absorb_fees: absorbFees,
      pixel_id: pixelId,
      header_image_id: selectedHeader,
      primary_color: color,
    };

    const res = await fetch("/api/client/settings", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ settings: updated, name: storeName }),
    });

    if (res.ok) {
      setSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }

    setSaving(false);
  };

  if (loading) {
    return <div className="py-20 text-center text-zinc-500">Carregando...</div>;
  }

  const selectedImage = HEADER_IMAGES.find((img) => img.id === selectedHeader);

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Configurações</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Personalize sua página de vendas
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Column 1 - Store info */}
        <div className="space-y-8">
          {/* Store Name */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Store className="h-4 w-4 text-violet-400" />
              <label className="text-sm font-medium text-zinc-300">
                Nome da loja
              </label>
            </div>
            <p className="mb-2 text-xs text-zinc-600">
              Nome que aparece no topo da sua página.
            </p>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Minha Loja"
              className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
            />
          </div>

          {/* Logo */}
          <LogoUpload logoUrl={settings.logo_url || ""} onLogoChange={(url) => setSettings({ ...settings, logo_url: url })} token={token || ""} />

          {/* WhatsApp */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-violet-400" />
              <label className="text-sm font-medium text-zinc-300">
                WhatsApp de contato
              </label>
            </div>
            <p className="mb-2 text-xs text-zinc-600">
              Número que aparece na sua página para os clientes chamarem.
            </p>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(maskWhatsApp(e.target.value))}
              placeholder="(21) 99999-9999"
              className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
            />
          </div>

          {/* PIX Key */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-violet-400" />
              <label className="text-sm font-medium text-zinc-300">Chave PIX</label>
            </div>
            <p className="mb-2 text-xs text-zinc-600">
              Chave PIX para receber o dinheiro das suas vendas (CPF, CNPJ, e-mail ou telefone).
            </p>
            <input
              type="text"
              value={pixKey}
              onChange={(e) => setPixKey(maskPixKey(e.target.value))}
              placeholder="CPF, CNPJ, telefone ou e-mail"
              className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
            />
          </div>

          {/* Facebook Pixel */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-violet-400" />
              <label className="text-sm font-medium text-zinc-300">Facebook Pixel ID</label>
            </div>
            <p className="mb-2 text-xs text-zinc-600">
              ID do Pixel do Facebook para rastrear visitas e vendas na sua página.
            </p>
            <input
              type="text"
              value={pixelId}
              onChange={(e) => setPixelId(e.target.value)}
              placeholder="Ex: 123456789012345"
              className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
            />
          </div>

          {/* Description */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-violet-400" />
              <label className="text-sm font-medium text-zinc-300">
                Descrição da loja
              </label>
            </div>
            <p className="mb-2 text-xs text-zinc-600">
              Texto que aparece no topo da sua página.
            </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Descreva seu negócio em poucas palavras..."
              className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {/* Column 2 - Visual */}
        <div className="space-y-8">
          {/* Header Image */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Image className="h-4 w-4 text-violet-400" />
              <label className="text-sm font-medium text-zinc-300">
                Imagem de fundo
              </label>
            </div>
            <p className="mb-3 text-xs text-zinc-600">
              Escolha uma imagem para o topo da página.
            </p>

            {selectedImage && (
              <div
                className="mb-4 flex h-28 items-end rounded-xl bg-cover bg-center px-4 py-3"
                style={{ backgroundImage: `url(${selectedImage.url})` }}
              >
                <span className="rounded-lg bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-sm">
                  {selectedImage.name}
                </span>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              {HEADER_IMAGES.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedHeader(img.id)}
                  className={`relative h-16 overflow-hidden rounded-xl bg-cover bg-center transition-all ${
                    selectedHeader === img.id
                      ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-zinc-900"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  style={{ backgroundImage: `url(${img.url})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-1 left-2 text-[10px] text-white drop-shadow">
                    {img.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Primary Color */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Palette className="h-4 w-4 text-violet-400" />
              <label className="text-sm font-medium text-zinc-300">
                Cor principal
              </label>
            </div>
            <p className="mb-2 text-xs text-zinc-600">
              Usada nos botões e destaques da página.
            </p>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded-lg border border-white/10 bg-transparent"
              />
              <span className="font-mono text-sm text-zinc-400">{color}</span>
            </div>
          </div>

          {/* Fees */}
          <div className="rounded-xl border border-white/5 bg-zinc-900/50 p-4">
            <p className="mb-3 flex items-center gap-2 text-xs font-medium text-violet-400"><Percent className="h-3.5 w-3.5" /> Taxas de operação</p>
            <div className="mb-3 space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="flex items-center gap-1.5 text-zinc-400"><Smartphone className="h-3.5 w-3.5 text-violet-400" /> PIX</span><span className="text-zinc-500">R$ 0,99</span></div>
              <div className="flex justify-between"><span className="flex items-center gap-1.5 text-zinc-400"><CreditCard className="h-3.5 w-3.5 text-violet-400" /> Cartão débito</span><span className="text-zinc-500">1,99%</span></div>
              <div className="flex justify-between"><span className="flex items-center gap-1.5 text-zinc-400"><CreditCard className="h-3.5 w-3.5 text-violet-400" /> Cartão crédito</span><span className="text-zinc-500">3,99%</span></div>
              <div className="flex justify-between"><span className="flex items-center gap-1.5 text-zinc-400"><DollarSign className="h-3.5 w-3.5 text-violet-400" /> Cartão parcelado</span><span className="text-zinc-500">4,99% a 6,99%</span></div>
            </div>
            <div className="flex items-center justify-between border-t border-white/5 pt-3">
              <div>
                <p className="text-xs font-medium text-white">Absorver taxas</p>
                <p className="text-[10px] text-zinc-600">
                  {absorbFees
                    ? "Você paga as taxas. Cliente paga o valor do produto."
                    : "Cliente paga as taxas. Você recebe o valor integral."}
                </p>
              </div>
              <button type="button" onClick={() => setAbsorbFees(!absorbFees)}
                className={`relative h-6 w-11 rounded-full transition-colors ${absorbFees ? "bg-violet-600" : "bg-zinc-700"}`}>
                <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${absorbFees ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="mt-10 flex items-center gap-4 border-t border-white/5 pt-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-3 text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
        >
          {saving ? (
            "Salvando..."
          ) : (
            <>
              <Save className="h-4 w-4" />
              Salvar configurações
            </>
          )}
        </button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-green-400">
            <Check className="h-4 w-4" /> Salvo com sucesso!
          </span>
        )}
      </div>
    </div>
  );
}
