const audienceList = [
  {
    emoji: "🏪",
    title: "Lojas físicas que vendem no WhatsApp",
    subtitle: "Roupas, calçados, eletrônicos, pet shop...",
  },
  {
    emoji: "💪",
    title: "Profissionais autônomos",
    subtitle: "Personal trainers, nutricionistas, consultores...",
  },
  {
    emoji: "🔧",
    title: "Prestadores de serviço",
    subtitle: "Encanadores, eletricistas, salões, clínicas...",
  },
  {
    emoji: "⚡",
    title: "Quem perde venda por demora",
    subtitle: "Qualquer negócio que depende de agilidade no atendimento",
  },
];

const stats = [
  { value: "24h", label: "de atendimento por dia", color: "rgb(124, 58, 237)" },
  { value: "3s", label: "tempo médio de resposta", color: "rgb(59, 130, 246)" },
  { value: "+68%", label: "aumento em conversões", color: "rgb(16, 185, 129)" },
  { value: "0", label: "vendas perdidas por demora", color: "rgb(245, 158, 11)" },
];

export function TargetAudience() {
  return (
    <section className="border-t border-white/5 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-16 md:grid-cols-2">
          {/* Left side - audience list */}
          <div>
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium"
              style={{
                background: "rgba(59, 130, 246, 0.1)",
                borderColor: "rgba(59, 130, 246, 0.25)",
                color: "rgb(96, 165, 250)",
              }}
            >
              Pra quem vende no digital
            </div>

            <h2 className="mb-6 text-3xl font-black tracking-tight text-white md:text-4xl">
              Pra quem quer{" "}
              <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                vender 24h por dia
              </span>
            </h2>

            <p className="mb-8 leading-relaxed text-gray-500">
              Se você vende pelo WhatsApp, Instagram ou loja física, o Robô Vendedor atende, dispara e finaliza por você.
            </p>

            <div className="space-y-4">
              {audienceList.map((item, index) => (
                <div key={index} className="group flex items-start gap-3">
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                    style={{ background: "rgb(26, 26, 26)", border: "1px solid rgb(42, 42, 42)" }}
                  >
                    <span className="text-lg">{item.emoji}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{item.title}</div>
                    <div className="mt-0.5 text-xs text-gray-600">{item.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-2xl p-6"
                style={{ background: "rgb(17, 17, 17)", border: "1px solid rgb(31, 31, 31)" }}
              >
                <div className="mb-1 text-3xl font-black" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-xs leading-snug text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
