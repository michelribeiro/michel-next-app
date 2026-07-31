"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { PRODUCT_TYPE_LABELS, PRODUCT_TYPE_ICONS, ProductType } from "@/core/domain/product/value-objects/ProductType";
import { Plus, Package } from "lucide-react";
import { useAuth } from "@/core/infrastructure/auth-context";

interface Product {
  id: number;
  name: string;
  type: ProductType;
  description: string;
  price: number;
  images: string[];
  active: boolean;
  created_at: string;
}

const MAX_IMAGES = 2;

const PLAN_LIMITS: Record<string, { maxProducts: number }> = {
  basic: { maxProducts: 30 },
  evolution: { maxProducts: 50 },
  pro: { maxProducts: 999999 },
};

const FORMATS = [
  "header", "bold", "italic", "underline", "strike",
  "list", "bullet", "ordered",
  "link", "blockquote", "code-block",
  "color", "background",
  "align", "clean",
];

const MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "blockquote", "code-block"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["clean"],
  ],
};

function getToken() {
  return sessionStorage.getItem("client_token");
}

// ─── Image Uploader (sem crop) ───────────────────────────

function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[], newBlobs?: Blob[]) => void;
}) {
  const slots = Array.from({ length: MAX_IMAGES }, (_, i) => images[i] || null);
  const busy = useRef(false);

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const processFile = async (file: File, index: number) => {
    if (busy.current) return;
    busy.current = true;

    const img = new window.Image();
    const url = URL.createObjectURL(file);
    await new Promise<void>((res) => { img.onload = () => res(); img.src = url; });
    URL.revokeObjectURL(url);

    let { width, height } = img;
    const maxDim = 1200;
    if (width > maxDim || height > maxDim) {
      const s = Math.min(maxDim / width, maxDim / height);
      width = Math.round(width * s);
      height = Math.round(height * s);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.85));
    busy.current = false;
    if (!blob) return;

    const newImages = [...images];
    newImages[index] = URL.createObjectURL(blob);
    onChange(newImages, [blob]);
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {slots.map((url, index) => (
        <div key={index} className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-zinc-800/50">
          {url ? (
            <>
              <img src={url} alt={`Imagem ${index + 1}`} className="h-full w-full object-contain p-2" />
              <button type="button" onClick={() => handleRemove(index)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/80 text-xs text-white hover:bg-red-500">✕</button>
            </>
          ) : (
            <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1 text-zinc-600 hover:text-zinc-400">
              <span className="text-xl">📷</span>
              <span className="text-xs">Adicionar</span>
              <input type="file" accept="image/*" className="hidden"
                onChange={async (e) => { const f = e.target.files?.[0]; if (f) { await processFile(f, index); e.target.value = ""; } }} />
            </label>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Product Modal ───────────────────────────────────────

function ProductModal({
  open, onClose, onSaved, editProduct,
}: {
  open: boolean; onClose: () => void; onSaved: () => void; editProduct: Product | null;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<ProductType>("product");
  const [priceCents, setPriceCents] = useState("");
  const displayPrice = priceCents
    ? (Number(priceCents) / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
    : "";
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const pendingBlobs = useRef<Blob[]>([]);
  const token = getToken();

  useEffect(() => {
    if (editProduct) {
      setName(editProduct.name);
      setType(editProduct.type);
      setPriceCents(String(Math.round(editProduct.price * 100)));
      setDescription(editProduct.description);
      setImages(editProduct.images || []);
    } else {
      setName(""); setType("product"); setPriceCents(""); setDescription(""); setImages([]);
    }
    pendingBlobs.current = [];
  }, [editProduct, open]);

  if (!open) return null;

  const handleImagesChange = (newImages: string[], newBlobs?: Blob[]) => {
    setImages(newImages);
    if (newBlobs) pendingBlobs.current.push(...newBlobs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    // Upload blobs pendentes
    const finalImages: string[] = [];
    for (const url of images) {
      if (url.startsWith("blob:")) {
        const blob = pendingBlobs.current.shift();
        if (blob) {
          const fd = new FormData();
          fd.append("file", blob, "image.webp");
          const res = await fetch("/api/upload", {
            method: "POST", headers: { authorization: `Bearer ${token}` }, body: fd,
          });
          if (!res.ok) throw new Error("Erro ao enviar imagem");
          finalImages.push((await res.json()).url);
        }
      } else {
        finalImages.push(url);
      }
    }
    pendingBlobs.current = [];

    try {
      const res = await fetch("/api/products", {
        method: editProduct ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...(editProduct ? { id: editProduct.id } : {}),
          name, type,
      price: Number(priceCents) / 100,
      description, images: finalImages,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Erro ao salvar");
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-12">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-zinc-900 p-6">
        <h2 className="mb-6 text-lg font-bold text-white">
          {editProduct ? "Editar" : "Novo"} {type === "product" ? "Produto" : "Serviço"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Nome</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
              placeholder="Ex: Camiseta branca / Consultoria de marketing" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Tipo</label>
              <select value={type} onChange={(e) => setType(e.target.value as ProductType)}
                className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-violet-500">
                <option value="product">📦 Produto físico</option>
                <option value="service">🔧 Serviço</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Preço (R$)</label>
              <input type="text" inputMode="decimal" value={displayPrice}
                onChange={(e) => setPriceCents(e.target.value.replace(/\D/g, ""))}
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
                placeholder="49,90" required />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-zinc-500">Imagens ({images.length}/{MAX_IMAGES})</label>
            <ImageUploader images={images} onChange={handleImagesChange} />
          </div>

          <div>
            <label className="mb-1 block text-xs text-zinc-500">Descrição</label>
            <p className="mb-2 text-xs text-zinc-600">
              Aqui você precisa deixar uma descrição rica para que a IA entenda seu produto e saiba explicar para seu cliente.
            </p>
            <ReactQuill value={description} onChange={setDescription}
              modules={MODULES} formats={FORMATS}
              placeholder="Descreva seu produto ou serviço..."
              theme="snow"
              className="[&_.ql-editor]:min-h-[150px] [&_.ql-toolbar]:border-white/10 [&_.ql-container]:border-white/10 [&_.ql-toolbar]:bg-zinc-800/50 [&_.ql-container]:bg-zinc-800/30" />
          </div>

          {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 bg-zinc-800 py-3 text-sm text-zinc-400 hover:text-white">Cancelar</button>
            <button type="submit" disabled={saving || !name || !priceCents}
              className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3 text-sm font-medium text-white disabled:opacity-50">
              {saving ? "Salvando..." : editProduct ? "Salvar alterações" : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Produtos Page ───────────────────────────────────────

export default function ProdutosPage() {
  const { client } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const plan = client?.plan || "basic";
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.basic;
  const maxProducts = limits.maxProducts;
  const remaining = maxProducts === 999999 ? "∞" : maxProducts - products.length;
  const canAdd = maxProducts === 999999 || products.length < maxProducts;

  const fetchProducts = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/products", { headers: { authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Erro ao carregar produtos");
      setProducts(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar");
      setTimeout(() => setError(""), 5000);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id: number) => {
    setConfirmDeleteId(null);
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE", headers: { authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Erro ao excluir");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) { setError(err instanceof Error ? err.message : "Erro ao excluir"); }
  };

  if (loading) return <div className="py-20 text-center text-zinc-500">Carregando produtos...</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Produtos & Serviços</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {products.length}/{remaining === "∞" ? "∞" : maxProducts} cadastrados
            {remaining !== "∞" && <span className="ml-2 text-zinc-600">({remaining === 0 ? "limite atingido" : `${remaining} restantes`})</span>}
          </p>
        </div>
        {canAdd && (
          <button onClick={() => { setEditProduct(null); setShowModal(true); }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            <Plus className="h-4 w-4" /> Novo item
          </button>
        )}
      </div>

      {error && <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">{error}</div>}

      {products.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-zinc-900 p-12 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-zinc-600" />
          <h2 className="mb-2 text-xl font-bold text-white">Nenhum item cadastrado</h2>
          <p className="mb-6 text-sm text-zinc-500">
            {canAdd ? "Cadastre seus produtos e serviços para aparecerem na sua página." : "Você atingiu o limite do seu plano."}
          </p>
          {canAdd && (
            <button onClick={() => setShowModal(true)}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 text-sm font-medium text-white hover:opacity-90">
              + Cadastrar primeiro item
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="rounded-2xl border border-white/5 bg-zinc-900 p-5 transition-all hover:border-white/10">
              {product.images && product.images.length > 0 && (
                <div className="mb-3 grid grid-cols-2 gap-2">
                  {product.images.slice(0, 2).map((url, i) => (
                    <img key={i} src={url} alt={`${product.name} ${i + 1}`} className="aspect-square w-full rounded-xl object-contain bg-zinc-800/50 p-2" />
                  ))}
                </div>
              )}
              <div className="mb-1">
                <span className="text-xs text-zinc-600">{PRODUCT_TYPE_ICONS[product.type]} {PRODUCT_TYPE_LABELS[product.type]}</span>
                <h3 className="mt-1 text-base font-semibold text-white">{product.name}</h3>
              </div>
              <div className="mb-3 text-xl font-bold text-violet-400">R$ {product.price.toFixed(2).replace(".", ",")}</div>
              {product.description && <div className="line-clamp-2 text-sm text-zinc-400" dangerouslySetInnerHTML={{ __html: product.description }} />}
              <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-3">
                <button onClick={() => { setEditProduct(product); setShowModal(true); }}
                  className="rounded-lg border border-white/10 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-400 hover:text-white">Editar</button>
                {confirmDeleteId === product.id ? (
                  <button onClick={() => handleDelete(product.id)}
                    className="rounded-lg border border-red-500/40 bg-red-500/30 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500/50">Confirmar</button>
                ) : (
                  <button onClick={() => setConfirmDeleteId(product.id)}
                    className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/30">Excluir</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ProductModal
        open={showModal}
        onClose={() => { setShowModal(false); setEditProduct(null); }}
        onSaved={fetchProducts}
        editProduct={editProduct}
      />
    </div>
  );
}
