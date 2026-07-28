export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contato" className="border-t border-white/5 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Left: brand */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-blue-500 text-xs font-bold text-white">
                R
              </span>
              Robô Vendedor
            </div>
            <div className="text-xs text-zinc-600">
              CNPJ: 10.453.072/0001-48
            </div>
          </div>

          {/* Right: copyright + dev */}
          <div className="flex flex-col items-center gap-1 md:items-end">
            <div className="text-xs text-zinc-600">
              © {year} Robô Vendedor. Todos os direitos reservados.
            </div>
            <div className="text-xs text-zinc-700">
              Desenvolvido por{" "}
              <a
                href="mailto:michel.ribeiro@michelribeiro.com.br"
                className="text-zinc-600 transition-colors hover:text-zinc-400"
              >
                michelribeiro.com.br
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
