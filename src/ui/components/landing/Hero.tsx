"use client";

export function Hero() {
  const scrollToDemo = () => {
    const el = document.querySelector("#experimente");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToCTA = () => {
    const el = document.querySelector("#cta");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(124, 58, 237, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(124, 58, 237, 0.07) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[120px]" />
        </div>
        <div className="absolute right-0 top-0 h-[300px] w-[300px] rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-violet-600/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 md:flex-row">
        {/* Left content */}
        <div className="flex-1 text-center md:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
            <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
            IA em tempo real
          </div>

          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            Seu{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              robô vendedor
            </span>{" "}
            24 horas por dia
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-400 md:text-xl">
            IA que atende, tira dúvidas e captura leads enquanto você trabalha.
            Nunca mais perca uma venda por demora no atendimento.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 md:flex-row md:items-start">
            <button
              onClick={scrollToCTA}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-600/35 transition-all hover:shadow-xl hover:shadow-violet-600/45 active:scale-95 md:w-auto"
            >
              Quero meu robô vendedor
            </button>
            <button
              onClick={scrollToDemo}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-8 py-4 text-base font-medium text-zinc-300 transition-all hover:border-zinc-600 hover:text-white active:scale-95 md:w-auto"
            >
              Ver demonstração
            </button>
          </div>

          {/* Social proof */}
          <div className="mt-10 flex items-center justify-center gap-4 md:justify-start">
            <div className="flex -space-x-3">
              {["/avatars/av1.png", "/avatars/av2.png", "/avatars/av3.png"].map((src, i) => (
                <div
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-zinc-900 bg-gradient-to-br from-violet-500 to-blue-500 text-[10px] font-bold text-white"
                >
                  {["M", "J", "R"][i]}
                </div>
              ))}
              <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-zinc-900 bg-zinc-800 text-[10px] font-medium text-zinc-400">
                +
              </div>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">+240 negócios</p>
              <p className="text-xs text-zinc-500">já usam o robô vendedor</p>
            </div>
          </div>
        </div>

        {/* Right - Phone mockup */}
        <div className="flex-1">
          <div className="relative mx-auto w-[280px] md:w-[320px]">
            {/* Phone frame */}
            <div className="relative rounded-[2.5rem] border-4 border-zinc-700 bg-zinc-900 p-4 shadow-2xl shadow-violet-600/20">
              {/* Notch */}
              <div className="mx-auto mb-4 h-5 w-24 rounded-full bg-zinc-800" />

              {/* Chat messages */}
              <div className="space-y-3">
                {/* AI message */}
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-zinc-800 px-4 py-3 text-sm text-zinc-200">
                    👋 Olá! Me conta qual seu negócio que eu te explico como posso ajudar a vender mais.
                  </div>
                </div>

                {/* User message */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-3 text-sm text-white">
                    Tenho uma loja de roupas
                  </div>
                </div>

                {/* AI response */}
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-zinc-800 px-4 py-3 text-sm text-zinc-200">
                    Legal! Com o Robô Vendedor, seus clientes veem o catálogo, tiram dúvidas sobre tamanho e tecido, e já deixam o contato pra você. Tudo automático! 🚀
                  </div>
                </div>

                {/* AI typing indicator */}
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-zinc-800 px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" style={{ animationDelay: "0.1s" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Input field */}
              <div className="mt-4 rounded-full bg-zinc-800 px-4 py-2.5 text-sm text-zinc-500">
                Digite sua mensagem...
              </div>
            </div>

            {/* Glow effect */}
            <div className="pointer-events-none absolute -inset-4 rounded-[3rem] bg-gradient-to-r from-violet-600/10 to-blue-600/10 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
