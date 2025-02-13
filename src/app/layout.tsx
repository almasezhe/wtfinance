import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import GoogleAdsense from "./googleadsense";
export const metadata: Metadata = {
  title: "LoverTest.AI",
  description: "Analyze your love journey with AI! Upload chat history, get relationship insights, personalized love advice, and even generate a romantic love story. Discover your compatibility and keep your love alive! 💞",
};
const GTM_ID = "GTM-PBH8ZNDM";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
            <head>
        {/* Google Tag Manager (Script) */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
      </head>
      <body>
      <noscript
          dangerouslySetInnerHTML={{
            __html: `
              <iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `,
          }}
        />
        {children}</body>
      <GoogleAdsense pId="9740683189212798" />

    </html>
  );
}
