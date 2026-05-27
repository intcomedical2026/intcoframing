import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "INTCO Framing | Premier Interior Decoration Manufacturer",
  description:
    "INTCO Framing manufactures mirrors, picture frames, wall art, furniture and memo boards with turnkey retail solutions.",
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
      className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
