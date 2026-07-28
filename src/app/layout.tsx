import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@/ui/components/atoms/GoogleAnalytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Robô Vendedor com IA — Atendimento 24h para seu negócio",
  description:
    "IA que atende, tira dúvidas e captura leads enquanto você trabalha. Nunca mais perca uma venda por demora no atendimento.",
  keywords: [
    "robô vendedor",
    "ia vendas",
    "atendimento automático whatsapp",
    "chatbot inteligente",
    "vender mais",
  ],
  openGraph: {
    title: "Robô Vendedor com IA",
    description:
      "IA que atende, tira dúvidas e captura leads 24h por dia.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-zinc-100">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
