import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LoverTest.AI",
  description: "Analyze your love journey with AI! Upload chat history, get relationship insights, personalized love advice, and even generate a romantic love story. Discover your compatibility and keep your love alive! 💞",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}


