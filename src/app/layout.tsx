import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SITE } from "@/config/site";
import { SEO_KEYWORDS, buildJsonLd } from "@/config/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const TITLE = "StudySetu — Free Class 9-12 Notes, PYQs & Practice | CBSE, HBSE, BSEB & Kerala Board";

const DESCRIPTION =
  "Free original study notes, previous year question paper (PYQ) guides and daily MCQ practice for Class 9-12 students of CBSE schools in Noida & Delhi (DPS, Amity, Lotus Valley, Apeejay…), CBSE/HBSE Haryana, CBSE/BSEB Bihar and Kerala DHSE board. Chapter-wise NCERT-based notes, updated automatically every day.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: TITLE,
    template: `%s | ${SITE.name}`,
  },
  description: DESCRIPTION,
  keywords: SEO_KEYWORDS,
  authors: [{ name: SITE.name, url: SITE.url }],
  applicationName: SITE.name,
  category: "education",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_IN",
    type: "website",
    countryName: "India",
    images: [
      {
        url: "/hero-students.png",
        alt: "StudySetu — Indian school students studying with books and laptops",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/hero-students.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    title: SITE.name,
    statusBarStyle: "default",
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "Noida, Delhi, Haryana, Kerala, Bihar, India",
    "revisit-after": "1 day",
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { "google-site-verification": process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
  },
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        {/* Structured data — WebSite + EducationalOrganization + Courses + FAQPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: buildJsonLd() }}
        />
        {/* Google AdSense — loads only after you set NEXT_PUBLIC_ADSENSE_CLIENT_ID in .env */}
        {SITE.adsenseClientId ? (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE.adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
