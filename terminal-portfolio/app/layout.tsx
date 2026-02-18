import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ruttansh (0xRutts) — AI Engineer & ML Researcher",
  description:
    "Ruttansh (Rutts / 0xRutts) — Toronto-based AI Engineer & ML Researcher. Building production-ready AI/ML tooling across security, code intelligence, and automation.",
  keywords: [
    "Ruttansh",
    "Rutts",
    "0xRutts",
    "AI Engineer",
    "ML Researcher",
    "Machine Learning",
    "Full Stack Developer",
    "Toronto",
    "portfolio",
  ],
  authors: [{ name: "Ruttansh", url: "https://0xrutts.com" }],
  creator: "Ruttansh",
  metadataBase: new URL("https://0xrutts.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://0xrutts.com",
    siteName: "0xRutts",
    title: "Ruttansh (0xRutts) — AI Engineer & ML Researcher",
    description:
      "Toronto-based AI Engineer & ML Researcher. Building production-ready AI/ML tooling across security, code intelligence, and automation.",
    images: [
      {
        url: "/core-image.jpg",
        width: 800,
        height: 800,
        alt: "Ruttansh — 0xRutts",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Ruttansh (0xRutts) — AI Engineer & ML Researcher",
    description:
      "Toronto-based AI Engineer & ML Researcher. Building production-ready AI/ML tooling across security, code intelligence, and automation.",
    creator: "@0xRutts",
    images: ["/core-image.jpg"],
  },
  icons: {
    icon: "/core-image.jpg",
    shortcut: "/core-image.jpg",
    apple: "/core-image.jpg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="RSyOabK11drnh_q3AKVZsECax5d06kYUYOlF94gHHRo" />
        <link rel="preconnect" href="https://img.shields.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.simpleicons.org" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                if ('scrollRestoration' in window.history) {
                  window.history.scrollRestoration = 'manual';
                }
                window.scrollTo(0, 0);
              }
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            // Static JSON-LD structured data - no user input, safe from XSS
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Ruttansh",
              alternateName: ["Rutts", "0xRutts"],
              url: "https://0xrutts.com",
              image: "https://0xrutts.com/core-image.jpg",
              jobTitle: "AI Engineer & ML Researcher",
              worksFor: {
                "@type": "Organization",
                name: "CredShields",
                url: "https://credshields.com/",
              },
              alumniOf: {
                "@type": "EducationalOrganization",
                name: "Sheridan College",
              },
              knowsAbout: [
                "Artificial Intelligence",
                "Machine Learning",
                "Full Stack Development",
                "Python",
                "TypeScript",
                "PyTorch",
                "RAG",
                "LLM",
              ],
              sameAs: [
                "https://github.com/rutts29",
                "https://www.linkedin.com/in/ruttansh-bhatelia",
                "https://x.com/0xRutts",
              ],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Toronto",
                addressRegion: "Ontario",
                addressCountry: "CA",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
