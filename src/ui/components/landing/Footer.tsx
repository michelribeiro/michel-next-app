export function Footer() {
  return (
    <footer id="contato" className="border-t border-white/5 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-blue-500 text-xs font-bold text-white">
              R
            </span>
            Robô Vendedor — {new Date().getFullYear()}
          </div>

          <div className="text-sm text-zinc-600">
            Desenvolvido por{" "}
            <a
              href="mailto:michel.ribeiro@michelribeiro.com.br"
              className="text-zinc-500 transition-colors hover:text-zinc-300"
            >
              michelribeiro.com.br
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
