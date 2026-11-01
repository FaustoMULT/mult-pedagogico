import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MULT Manager",
  description: "Painel de Gestão e Monitoramento de Bots de Atendimento",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
