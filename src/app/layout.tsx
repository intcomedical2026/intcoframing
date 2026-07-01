import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Montserrat } from "next/font/google";
import Script from "next/script";
import { HUBSPOT_PORTAL_ID, HUBSPOT_REGION } from "@/lib/hubspot";
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
const CLARITY_PROJECT_ID = "xcusp9mr3y";

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
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NFFXV4DP"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <Script id="intco-gtm" strategy="lazyOnload">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NFFXV4DP');`}
        </Script>
        <Script id="intco-clarity" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_PROJECT_ID}");`}
        </Script>
        <Script id="hs-script-loader" src={`https://js-${HUBSPOT_REGION}.hs-scripts.com/${HUBSPOT_PORTAL_ID}.js`} strategy="lazyOnload" />
      </body>
    </html>
  );
}
