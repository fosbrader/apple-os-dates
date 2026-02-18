import type { Metadata, Viewport } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://art.bfosler.com"
  ),
  title: {
    default: "Apple Release Tracker",
    template: "%s | Apple Release Tracker",
  },
  description:
    "Track every Apple OS beta release date — iOS, iPadOS, macOS, watchOS, tvOS, and visionOS",
  openGraph: {
    title: "Apple Release Tracker",
    description:
      "Every beta, RC, and public release date for iOS, iPadOS, macOS, watchOS, tvOS, and visionOS",
    siteName: "Apple Release Tracker",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apple Release Tracker",
    description:
      "Every beta, RC, and public release date for iOS, iPadOS, macOS, watchOS, tvOS, and visionOS",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Release Tracker",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#f8f8f7" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Header />
        <main className="max-w-6xl mx-auto px-5 sm:px-6 py-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
