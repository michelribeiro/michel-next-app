const steps = [
  {
    number: "1",
    title: "Cadastre seus produtos",
    description: "Adicione fotos, descrições e preços dos seus produtos ou serviços. A IA aprende tudo sobre o que você vende.",
    color: "from-amber-600/20 to-amber-600/5 text-amber-400 border-amber-500/20",
    iconColor: "rgba(245, 158, 11, 0.094)",
    iconStroke: "rgb(245, 158, 11)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: "2",
    title: "Compartilhe o link",
    description: "Você recebe um link exclusivo da sua página de vendas. Publique no WhatsApp, Instagram ou no status — seus clientes abrem e veem tudo.",
    color: "from-blue-600/20 to-blue-600/5 text-blue-400 border-blue-500/20",
    iconColor: "rgba(59, 130, 246, 0.094)",
    iconStroke: "rgb(59, 130, 246)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: "3",
    title: "IA atende e captura leads",
    description: "A IA tira dúvidas 24h, recomenda os produtos certos e captura nome e WhatsApp de quem quer comprar.",
    color: "from-violet-600/20 to-violet-600/5 text-violet-400 border-violet-500/20",
    iconColor: "rgba(139, 92, 246, 0.094)",
    iconStroke: "rgb(139, 92, 246)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="border-t border-white/5 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Como funciona
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Você cadastra os produtos, recebe uma página com IA e compartilha o link
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
              style={{ background: "rgb(17, 17, 17)", border: "1px solid rgb(31, 31, 31)" }}
            >
              {/* Number */}
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold transition-all group-hover:scale-110"
                style={{ background: step.iconColor, color: step.iconStroke }}
              >
                {step.number}
              </div>

              <h3 className="mb-2 text-base font-bold text-white">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "oklch(55.1% 0.027 264.364)" }}>
                {step.description}
              </p>

              {/* Connector line (desktop) */}
              {index < steps.length - 1 && (
                <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 md:block">
                  <svg className="h-5 w-5" style={{ color: "rgb(42, 42, 42)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
