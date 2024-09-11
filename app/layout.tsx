import type { Metadata } from "next";
import { Inter, Roboto_Mono } from 'next/font/google';
import "./globals.css";
import Script from 'next/script';
import Head from 'next/head';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export const metadata: Metadata = {
  title: "Delfigore's portfolio",
  description: "A showcase of my work as a full-stack developer",
  // ... other metadata
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        <Head>
          <link
            rel="preload"
            href="/fonts/your-critical-font.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        </Head>
        <Script src="https://example.com/analytics.js" strategy="lazyOnload" />
        {children}
      </body>
    </html>
  );
}
