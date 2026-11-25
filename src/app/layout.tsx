import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { LogoSprite } from "@/components/layout/Logo";
import { ScrollReveal } from "@/components/layout/ScrollReveal";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

// Self-hosted at build time, preloaded, with metric-matched fallbacks (no layout shift on swap).
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["500", "700"],
});

const description =
  "From enterprise challenge to production-scale intelligence. MoogleLabs finds high-value AI opportunities, defines the technology and data strategy, engineers production-grade solutions and runs them at scale.";

export const metadata: Metadata = {
  title: { default: "MoogleLabs Enterprise AI", template: "%s | MoogleLabs" },
  description,
  applicationName: "MoogleLabs",
  openGraph: {
    type: "website",
    siteName: "MoogleLabs",
    title: "MoogleLabs Enterprise AI",
    description,
  },
  twitter: { card: "summary", title: "MoogleLabs Enterprise AI", description },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${mono.variable}`} data-scroll-behavior="smooth">
      {/* Browser extensions (e.g. Grammarly) add attributes to <body> before React loads; ignore those. */}
      <body suppressHydrationWarning>
        <LogoSprite />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <ScrollReveal />
      </body>
    </html>
  );
}
