import { ChatWidget } from "@/ui/components/chat/ChatWidget";

export function LiveDemo() {
  return (
    <section id="experimente" className="border-t border-white/5 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Experimente agora mesmo
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            O chat abaixo está rodando com IA de verdade. Digite algo! 💬
          </p>
        </div>

        <div className="mt-12 flex justify-center">
          <div className="w-full max-w-md">
            <div className="relative">
              <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-r from-violet-600/10 to-blue-600/10 blur-2xl" />

              {/* Pulse indicator */}
              <div className="absolute -right-2 -top-2 z-10">
                <span className="flex h-6 items-center gap-1.5 rounded-full bg-green-500/20 px-2.5 text-xs text-green-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                  Online
                </span>
              </div>

              <ChatWidget inline />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
