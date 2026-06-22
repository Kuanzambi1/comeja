import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TrackerInit from "./TrackerInit";
import RealtimeProvider from "./RealtimeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Come Já - Fast Food Delivery",
  description: "Peça comida rápida dos melhores restaurantes e receba em casa ou no trabalho com entrega em até 30 minutos.",
  keywords: ["delivery", "comida", "fast food", "restaurante", "entrega"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-zinc-50 text-zinc-900 antialiased">
        {children}
        <TrackerInit />
        <RealtimeProvider />
      </body>
    </html>
  );
}
