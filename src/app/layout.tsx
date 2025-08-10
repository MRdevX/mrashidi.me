import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navigation/Navbar";
import BackgroundEffects from "@/components/ui/BackgroundEffects";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
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
    <html lang="en" className={`scroll-smooth ${inter.variable}`}>
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
                <p className="text-gray-400 mb-4">© {new Date().getFullYear()} Mahdi Rashidi. All rights reserved.</p>
                <div className="flex justify-center space-x-6" aria-label="Social Media Links">
                  <a
                    href="https://github.com/mrdevx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link focus-visible:outline-offset-4 focus-visible:outline-orange-500"
                    aria-label="Visit Mahdi Rashidi's GitHub Profile"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com/in/deerashidi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link focus-visible:outline-offset-4 focus-visible:outline-orange-500"
                    aria-label="Visit Mahdi Rashidi's LinkedIn Profile"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  <a
                    href="mailto:contact@mrashidi.me"
                    className="social-link focus-visible:outline-offset-4 focus-visible:outline-orange-500"
                    aria-label="Email Mahdi Rashidi"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </footer>
          <SpeedInsights />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
