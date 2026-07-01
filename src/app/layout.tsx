import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Montserrat } from "next/font/google";
import { ConsentAnalytics } from "@/components/consent-analytics";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "INTCO Framing | Premier Interior Decoration Manufacturer",
  description:
    "INTCO Framing manufactures mirrors, picture frames, wall art, furniture and memo boards with turnkey retail solutions.",
  verification: {
    google: "XxIbPVYkAfTn87yksZcHyjNaILrUXOCBthdp9uhcLr0",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const supportedHtmlLangs = new Set(["en", "es", "pt", "fr", "de", "ja"]);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const requestedLocale = requestHeaders.get("x-intco-locale") || "en";
  const htmlLang = supportedHtmlLangs.has(requestedLocale) ? requestedLocale : "en";

  return (
    <html
      lang={htmlLang}
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <ConsentAnalytics />
      </body>
    </html>
  );
}
