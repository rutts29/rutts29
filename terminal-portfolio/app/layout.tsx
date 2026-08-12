import type { Metadata } from "next";
import { Geist_Mono, Instrument_Sans, Newsreader } from "next/font/google";

import { portfolioContent } from "@/config/portfolioContent";

import "./globals.css";

/** Runs before paint — resolves theme so simple portfolio never FOUC. */
const themeBootScript = `
(function () {
  try {
    var key = "simple-portfolio-theme";
    var stored = localStorage.getItem(key);
    var pref = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
    var dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var resolved = pref === "system" ? (dark ? "dark" : "light") : pref;
    var root = document.documentElement;
    root.dataset.simpleTheme = pref;
    root.dataset.simpleResolved = resolved;
    root.style.colorScheme = resolved;
  } catch (e) {
    document.documentElement.dataset.simpleTheme = "system";
    document.documentElement.dataset.simpleResolved = "light";
  }
})();
`;

const instrumentSans = Instrument_Sans({
  variable: "--font-portfolio-sans",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-portfolio-display",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const { siteUrl, identity, experience, skills, contact } = portfolioContent;
const currentRole = experience.find((role) => role.isCurrent);
const pageTitle = `${identity.name} | ${identity.title}`;
const pageDescription = `${identity.name} is an ${identity.title.replace(" · ", " and ")} based in ${identity.location}. ${identity.hero}`;
const profileUrls = contact.links
  .map((link) => link.href)
  .filter((href) => href.startsWith("https://"));

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  authors: [{ name: identity.name, url: siteUrl }],
  creator: identity.name,
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: identity.name,
    title: pageTitle,
    description: pageDescription,
    images: [
      {
        url: "/core-image.jpg",
        width: 800,
        height: 800,
        alt: identity.name,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: pageTitle,
    description: pageDescription,
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
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="RSyOabK11drnh_q3AKVZsECax5d06kYUYOlF94gHHRo" />
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfilePage",
              name: pageTitle,
              description: pageDescription,
              url: siteUrl,
              mainEntity: {
                "@type": "Person",
                name: identity.name,
                alternateName: [identity.shortName, identity.handle],
                description: identity.hero,
                url: siteUrl,
                image: `${siteUrl}/core-image.jpg`,
                jobTitle: identity.title,
                worksFor: currentRole
                  ? {
                      "@type": "Organization",
                      name: currentRole.company,
                      url: currentRole.companyUrl,
                    }
                  : undefined,
                knowsAbout: [
                  "Artificial Intelligence",
                  "Machine Learning",
                  ...identity.specialties,
                  ...skills.flatMap((group) =>
                    group.items.map((item) => item.label),
                  ),
                ],
                sameAs: profileUrls,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Toronto",
                  addressRegion: "Ontario",
                  addressCountry: "CA",
                },
              },
            }),
          }}
        />
      </head>
      <body
        className={`${instrumentSans.variable} ${newsreader.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
