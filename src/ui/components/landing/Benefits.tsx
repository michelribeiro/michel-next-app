const benefits = [
  {
    title: "Atendimento 24h",
    description: "Nunca mais perca uma venda por demora. O robô responde na hora, a qualquer hora.",
    bg: "rgba(245, 158, 11, 0.094)",
    color: "rgb(245, 158, 11)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11 6v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Disparo WhatsApp",
    description: "IA chama o lead no privado automaticamente. Cliente responde, robô continua a conversa.",
    bg: "rgba(59, 130, 246, 0.094)",
    color: "rgb(59, 130, 246)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M17 2a3 3 0 013 3v8a3 3 0 01-3 3h-5l-5 5v-5H5a3 3 0 01-3-3V5a3 3 0 013-3h12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Checkout integrado",
    description: "PIX, boleto e cartão de crédito. O cliente compra sem sair do robô.",
    bg: "rgba(139, 92, 246, 0.094)",
    color: "rgb(139, 92, 246)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="5" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="11" cy="11.5" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Dashboard completo",
    description: "Gráficos de leads, vendas e conversão. Você vê exatamente onde está ganhando dinheiro.",
    bg: "rgba(16, 185, 129, 0.094)",
    color: "rgb(16, 185, 129)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="16 7 22 7 22 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function Benefits() {
  return (
    <section className="border-t border-white/5 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Por que escolher?
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Seu negócio merece uma IA que vende por você
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
              style={{ background: "rgb(17, 17, 17)", border: "1px solid rgb(31, 31, 31)" }}
            >
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl transition-all group-hover:scale-110"
                style={{ background: benefit.bg, color: benefit.color }}
              >
                {benefit.icon}
              </div>
              <h3 className="mb-2 text-base font-bold text-white">
                {benefit.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
