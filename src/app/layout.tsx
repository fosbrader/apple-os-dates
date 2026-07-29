import type { Metadata, Viewport } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { AnalyticsConsentManager } from "@/components/analytics/AnalyticsConsent";
import { VercelWebAnalytics } from "@/components/analytics/VercelWebAnalytics";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  siteDescription,
  siteName,
  siteOrigin,
  withBasePath,
} from "@/lib/site";
import { googleAdsenseAccount } from "@/lib/ads";
import {
  publicContactEmail,
  publicOperatorName,
} from "@/lib/contact";
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
  "Browse recorded beta, release candidate, and public release dates for iOS, iPadOS, macOS, watchOS, tvOS, and visionOS.";
const googleVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
const bingVerification =
  process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();
const configuredGaMeasurementId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const gaMeasurementId =
  configuredGaMeasurementId &&
  /^G-[A-Z0-9]+$/i.test(configuredGaMeasurementId)
    ? configuredGaMeasurementId
    : undefined;

if (configuredGaMeasurementId && !gaMeasurementId) {
  throw new Error(
    "NEXT_PUBLIC_GA_MEASUREMENT_ID must be a valid GA4 ID beginning with G-.",
  );
}

if (
  (gaMeasurementId || googleAdsenseAccount) &&
  (!publicContactEmail || !publicOperatorName)
) {
  throw new Error(
    "SITE_CONTACT_EMAIL and SITE_OPERATOR_NAME are required before GA4 or AdSense verification is enabled.",
  );
}

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
  other: googleAdsenseAccount
    ? { "google-adsense-account": googleAdsenseAccount }
    : undefined,
  icons: {
    icon: withBasePath("/icon.svg"),
    apple: withBasePath("/icon.svg"),
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: siteName,
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
        {gaMeasurementId ? (
          <Script
            id="google-consent-defaults"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                if (!window.location.pathname.startsWith('/studio')) {
                  window.dataLayer = window.dataLayer || [];
                  window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
                  window.gtag('consent', 'default', {
                    analytics_storage: 'denied',
                    ad_storage: 'denied',
                    ad_user_data: 'denied',
                    ad_personalization: 'denied',
                    wait_for_update: 500
                  });
                  window.__betaCadenceConsentDefaultsInitialized = true;
                  window.__betaCadenceAnalyticsConsent = 'denied';
                  try {
                    if (window.localStorage.getItem('apple-release-tracker:analytics-consent') === 'granted') {
                      window.__betaCadenceAnalyticsConsent = 'granted';
                      window.gtag('consent', 'update', {
                        analytics_storage: 'granted',
                        ad_storage: 'denied',
                        ad_user_data: 'denied',
                        ad_personalization: 'denied'
                      });
                    }
                  } catch {}
                }
              `,
            }}
          />
        ) : null}
        <Header />
        <main className="max-w-6xl mx-auto px-5 sm:px-6 py-10">
          {children}
        </main>
        <Footer />
        <VercelWebAnalytics />
        {gaMeasurementId ? (
          <AnalyticsConsentManager measurementId={gaMeasurementId} />
        ) : null}
      </body>
    </html>
  );
}
