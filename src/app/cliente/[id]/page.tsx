import { supabase } from "@/core/infrastructure/database/supabase";
import { ClientePublicClient } from "./client";

const HEADER_IMAGES = [
  { id: 1, name: "Loja moderna", url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200" },
  { id: 2, name: "Roupas", url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200" },
  { id: 3, name: "Tênis", url: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200" },
  { id: 4, name: "Comida", url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200" },
  { id: 5, name: "Tecnologia", url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200" },
  { id: 6, name: "Natureza", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200" },
];

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: client } = await supabase.from("clients").select("name, settings").eq("id", Number(id)).single();
  const name = client?.name || "Loja";
  const settings = client?.settings || {};
  const desc = settings.store_description || `Conheça nossos produtos na ${name}!`;

  return {
    title: `${name} — Robô Vendedor`,
    description: desc,
    openGraph: { title: name, description: desc },
  };
}

export default async function ClientePublicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const clientId = Number(id);

  const { data: client } = await supabase
    .from("clients")
    .select("id, name, email, whatsapp, plan, status, settings")
    .eq("id", clientId)
    .single();

  if (!client || client.status !== "active") {
    return <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]"><p className="text-zinc-500">Loja não encontrada</p></div>;
  }

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("client_id", clientId)
    .eq("active", true)
    .order("created_at", { ascending: false });

  const settings = client.settings || {};
  const selectedHeader = HEADER_IMAGES.find((img) => img.id === settings.header_image_id) || HEADER_IMAGES[0];

  const storeData = {
    id: client.id,
    name: client.name,
    whatsapp: settings.whatsapp || client.whatsapp,
    description: settings.store_description || "",
    logo: settings.logo_url || "🛒",
    primary_color: settings.primary_color || "#8B5CF6",
    header_image: selectedHeader.url,
    header_name: selectedHeader.name,
    pixel_id: settings.pixel_id || "",
    absorb_fees: settings.absorb_fees === true,
  };

  const productsData = (products || []).map((p) => ({
    id: p.id,
    name: p.name,
    type: p.type,
    price: p.price,
    images: p.images || [],
    description: p.description || "",
  }));

  return (
    <>
      {/* Facebook Pixel */}
      {storeData.pixel_id && (
        <script dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${storeData.pixel_id}');
            fbq('track', 'PageView');
          `
        }} />
      )}
      <ClientePublicClient store={storeData} products={productsData} />
    </>
  );
}
