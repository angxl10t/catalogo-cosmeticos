import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://catalogo-cosmeticos.vercel.app'),
  title: "LuKa | Catálogo Oficial de Cosméticos & Belleza",
  description: "Catálogo digital exclusivo LuKa: Maquillaje, Fragancias, Cuidado Facial y Belleza de Cyzone, Ésika, L'BEL, Yanbal, Natura y Electro Hogar. Consulta precios y coordina tus pedidos directamente por WhatsApp.",
  keywords: ["LuKa", "Cyzone", "Ésika", "L'BEL", "Yanbal", "Unique", "Natura", "Cosméticos Perú", "Catálogo digital", "Maquillaje", "Perfumes"],
  authors: [{ name: "LuKa Cosméticos" }],
  openGraph: {
    title: "LuKa | Catálogo Oficial de Cosméticos & Belleza",
    description: "Explora 500 productos reales de Cyzone, Ésika, L'BEL, Yanbal, Natura y Electro Hogar. Consulta precios de campaña al instante por WhatsApp.",
    type: "website",
    locale: "es_PE",
    images: [
      {
        url: "/hero-cyzone.jpg",
        width: 1200,
        height: 630,
        alt: "LuKa Catálogo Cosméticos & Belleza",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-neutral-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
