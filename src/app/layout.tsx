import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/siteConfig";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Private Health Insurance Calculator Australia | Is It Worth It? (2026)",
    template: "%s | Private Health Insurance Calculator",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "private health insurance calculator",
    "is private health insurance worth it",
    "medicare levy surcharge calculator",
    "lifetime health cover loading",
    "private health insurance australia 2026",
    "MLS calculator",
    "LHC loading calculator",
    "private vs public health insurance",
  ],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  // Google Search Console verification — set NEXT_PUBLIC_GSC_VERIFICATION in Vercel env vars
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
        },
      }
    : {}),
};

/** Sitewide WebSite + Organization JSON-LD — rendered on every page. */
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-AU",
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      description:
        "Free, independent private health insurance analysis for Australians. No commissions. Based on ATO, APRA, and AIHW data.",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: next-themes sets class="dark" server-side
    // but can only know the correct theme client-side (localStorage/OS pref).
    // This suppresses the React mismatch warning on the html element only.
    <html lang="en-AU" className={inter.className} suppressHydrationWarning>
      <body className="antialiased bg-background text-text-main flex flex-col min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <GoogleAnalytics />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
          />
          <SiteNav />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
