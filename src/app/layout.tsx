import type { Metadata, Viewport } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  siteDescription,
  siteName,
  siteOrigin,
  withBasePath,
} from "@/lib/site";
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

const socialDescription =
  "Every beta, release candidate, and public release date for iOS, iPadOS, macOS, watchOS, tvOS, and visionOS.";
const googleVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
const bingVerification =
  process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  applicationName: siteName,
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "Apple release dates",
    "Apple beta releases",
    "iOS beta dates",
    "iPadOS beta dates",
    "macOS beta dates",
    "watchOS beta dates",
    "tvOS beta dates",
    "visionOS beta dates",
  ],
  alternates: {
    canonical: withBasePath("/"),
  },
  openGraph: {
    title: siteName,
    description: socialDescription,
    url: withBasePath("/"),
    siteName,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: withBasePath("/opengraph-image.png"),
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: socialDescription,
    images: [withBasePath("/opengraph-image.png")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification:
    googleVerification || bingVerification
      ? {
          ...(googleVerification ? { google: googleVerification } : {}),
          ...(bingVerification
            ? { other: { "msvalidate.01": bingVerification } }
            : {}),
        }
      : undefined,
  icons: {
    icon: withBasePath("/icon.svg"),
    apple: withBasePath("/icon.svg"),
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Release Tracker",
  },
  manifest: withBasePath("/manifest.json"),
  category: "technology",
  formatDetection: {
    telephone: false,
  },
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
