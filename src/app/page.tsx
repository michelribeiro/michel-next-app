export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-6 text-center text-white">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-3xl shadow-lg shadow-violet-500/20">
        🚧
      </div>
      <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl">
        Em construção
      </h1>
      <p className="max-w-md text-base text-zinc-400 sm:text-lg">
        Estamos preparando algo incrível para você.
        <br />
        Volte em breve! 👀
      </p>
      <div className="mt-10 h-1 w-32 overflow-hidden rounded-full bg-zinc-800">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-violet-600 to-blue-600" />
      </div>
    </main>
  );
}
