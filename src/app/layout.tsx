import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import "./globals.css";
import Navbar from "@/components/navigation/Navbar";
import BackgroundEffects from "@/components/ui/BackgroundEffects";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { GoogleTagManager } from "@next/third-parties/google";
import personalInfo from "@/data/personalInfo";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "Arial", "sans-serif"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ff5f1f",
};

export const metadata: Metadata = {
  title: "Mahdi Rashidi | Software Backend Engineer",
  description: personalInfo.intro,
  keywords: "Software Backend Engineer, web developer, react developer, node.js, javascript, portfolio, software engineer",
  creator: "Mahdi Rashidi",
  authors: [{ name: "Mahdi Rashidi", url: "https://mrashidi.me" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mrashidi.me",
    siteName: "Mahdi Rashidi - Software Backend Engineer",
    title: "Mahdi Rashidi | Software Backend Engineer",
    description: personalInfo.intro,
    images: [
      {
        url: "https://mrashidi.me/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mahdi Rashidi - Software Backend Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mahdi Rashidi | Software Backend Engineer",
    description: personalInfo.intro,
    creator: "@your_twitter_handle",
    images: ["https://mrashidi.me/twitter-image.jpg"],
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://mrashidi.me",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} dark`}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f97316" />
        <meta name="msapplication-TileColor" content="#f97316" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MR Portfolio" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="MR Portfolio" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} bg-black text-gray-100 min-h-screen relative`}>
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-orange-500 focus:text-black focus:outline-none focus:ring-2 focus:ring-white"
          >
            Skip to content
          </a>

          <BackgroundEffects />
          <Navbar />
          <main id="main-content" className="pt-16 relative z-10">
            {children}
          </main>
          <footer className="mt-20 py-8 relative z-10" role="contentinfo" aria-label="Site Footer">
            <div className="max-w-4xl mx-auto px-4">
              <div className="glass-card p-8 text-center">
                <p className="text-gray-400 mb-4 flex items-center justify-center gap-2">
                  © {new Date().getFullYear()} Mahdi Rashidi. All rights reserved.
                </p>
                <div className="flex justify-center space-x-6" aria-label="Social Media Links">
                  <a
                    href="https://github.com/mrdevx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link focus-visible:outline-offset-4 focus-visible:outline-orange-500"
                    aria-label="Visit Mahdi Rashidi's GitHub Profile"
                  >
                    <FaGithub className="h-6 w-6" />
                  </a>
                  <a
                    href="https://linkedin.com/in/deerashidi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link focus-visible:outline-offset-4 focus-visible:outline-orange-500"
                    aria-label="Visit Mahdi Rashidi's LinkedIn Profile"
                  >
                    <FaLinkedin className="h-6 w-6" />
                  </a>
                  <a
                    href="mailto:contact@mrashidi.me"
                    className="social-link focus-visible:outline-offset-4 focus-visible:outline-orange-500"
                    aria-label="Email Mahdi Rashidi"
                  >
                    <Mail className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </footer>
          <SpeedInsights />
          <Analytics />
          <GoogleTagManager gtmId="GTM-T27QBF7L" />
        </ThemeProvider>
      </body>
    </html>
  );
}
