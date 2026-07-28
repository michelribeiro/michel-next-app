"use client";

import { useState } from "react";

const navLinks = [
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Contato", href: "#contato" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2 text-lg font-bold text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-bold text-white">
            R
          </span>
          Robô Vendedor
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => scrollToSection("#cta")}
            className="rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-violet-600/25 transition-all hover:shadow-violet-600/40"
          >
            Quero meu robô
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="text-white md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-white/5 bg-black px-6 pb-6 md:hidden">
          <nav className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="text-left text-sm text-zinc-400 transition-colors hover:text-white"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection("#cta")}
              className="rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2 text-sm font-medium text-white"
            >
              Quero meu robô
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
