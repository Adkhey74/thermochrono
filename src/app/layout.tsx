import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { PromoBar } from "@/components/PromoBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { I18nProvider } from "@/lib/i18n/context";
import { PageTransition } from "@/components/PageTransition";
import { Toaster } from "sonner";
import { StructuredData } from "@/components/StructuredData";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans-app",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: {
    default: "Thermo Chrono — Gourde connectée à affichage température",
    template: "%s | Thermo Chrono",
  },
  description: "Gourde connectée qui affiche la température en temps réel. Livraison rapide, satisfait ou remboursé 30 jours. −50 % en ce moment.",
  keywords: ["gourde connectée", "thermo chrono", "température", "gourde intelligente", "hydratation"],
  authors: [{ name: "Thermo Chrono" }],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.example.com"),
  alternates: {
    canonical: "/",
    languages: {
      fr: "/",
      en: "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Thermo Chrono",
    title: "Thermo Chrono — Gourde connectée à affichage température",
    description: "Gourde connectée qui affiche la température en temps réel. Livraison rapide, satisfait ou remboursé.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/images/favicon.png",
    shortcut: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <StructuredData />
      </head>
      <body
        className={`${plusJakartaSans.variable} font-sans antialiased`}
      >
        <I18nProvider>
          <PromoBar />
          <Header />
          <PageTransition>
            {children}
          </PageTransition>
          <Footer />
          <Toaster
            position="top-center"
            richColors
            duration={6000}
            className="toaster-top-center"
            toastOptions={{
              className: "shadow-lg",
            }}
          />
        </I18nProvider>
      </body>
    </html>
  );
}
