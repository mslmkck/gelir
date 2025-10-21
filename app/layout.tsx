import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Modern Full-Stack App",
    template: "%s | Modern Full-Stack App",
  },
  description:
    "Built with Next.js 14, TypeScript, TailwindCSS, and Headless UI — now enhanced with offline-first PWA features.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/icon-192x192.svg", type: "image/svg+xml" },
      { url: "/icons/icon-512x512.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icons/icon-192x192.svg" }],
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  appleWebApp: {
    capable: true,
    title: "Modern App",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "Modern Full-Stack App",
    description:
      "A modern full-stack starter with offline-ready PWA support, built with Next.js, TypeScript, and Tailwind CSS.",
    url: "https://modern-app.local",
    siteName: "Modern App",
    images: [{ url: "/icons/screenshot-light.svg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Modern Full-Stack App",
    description:
      "A modern full-stack starter with offline-ready PWA support, built with Next.js, TypeScript, and Tailwind CSS.",
    images: ["/icons/screenshot-light.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <link rel="prefetch" href="/api/dictionary" as="fetch" crossOrigin="anonymous" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100`}>
        {children}
      </body>
    </html>
  );
}
