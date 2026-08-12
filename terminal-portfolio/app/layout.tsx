import type { Metadata } from "next";
import { Geist_Mono, Instrument_Sans, Newsreader } from "next/font/google";
import "./globals.css";
import "./simple-portfolio.css";

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

/* Anthropic-adjacent stack: refined sans UI + editorial serif for display */
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

export const metadata: Metadata = {
  title: "Ruttansh Bhatelia — AI Engineer & ML Researcher",
  description:
    "Ruttansh Bhatelia is a Toronto-based AI Engineer and ML Researcher building production-grade systems across security, code intelligence, and automation.",
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
    siteName: "Ruttansh Bhatelia",
    title: "Ruttansh Bhatelia — AI Engineer & ML Researcher",
    description:
      "Toronto-based AI Engineer & ML Researcher building production-grade AI systems across security, code intelligence, and automation.",
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
    title: "Ruttansh Bhatelia — AI Engineer & ML Researcher",
    description:
      "Toronto-based AI Engineer & ML Researcher building production-grade AI systems across security, code intelligence, and automation.",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="RSyOabK11drnh_q3AKVZsECax5d06kYUYOlF94gHHRo" />
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            // Static JSON-LD structured data - no user input, safe from XSS
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Ruttansh Bhatelia",
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
        className={`${instrumentSans.variable} ${newsreader.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
