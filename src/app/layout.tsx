import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import "@/styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import { BlogPreloader } from "@/features/blog";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { GoogleTagManager } from "@next/third-parties/google";
import { personalInfo, siteConfig, siteMetadata } from "@/data";
import { ThemeProvider } from "@/context/ThemeContext";
import { StructuredData } from "@/components/SEO";
import { BackgroundEffects } from "@/components/ui";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ["system-ui", "arial"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: siteConfig.themeColor,
};

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: personalInfo.intro,
  keywords: siteMetadata.keywords,
  creator: siteMetadata.creator,
  authors: siteMetadata.authors,
  openGraph: {
    ...siteMetadata.openGraph,
    description: personalInfo.intro,
  },
  twitter: {
    ...siteMetadata.twitter,
    description: personalInfo.intro,
  },
  robots: siteMetadata.robots,
  alternates: siteMetadata.alternates,
  icons: siteMetadata.icons,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable}`}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content={siteConfig.themeColor} />
        <meta name="msapplication-TileColor" content={siteConfig.msTileColor} />
        <meta name="apple-mobile-web-app-capable" content={siteConfig.appleMobileWebAppCapable ? "yes" : "no"} />
        <meta name="apple-mobile-web-app-status-bar-style" content={siteConfig.appleMobileWebAppStatusBarStyle} />
        <meta name="apple-mobile-web-app-title" content={siteConfig.appleMobileWebAppTitle} />
        <meta name="mobile-web-app-capable" content={siteConfig.mobileWebAppCapable ? "yes" : "no"} />
        <meta name="application-name" content={siteConfig.appName} />

        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn-images-1.medium.com" />
        <link rel="dns-prefetch" href="https://miro.medium.com" />
        <link rel="dns-prefetch" href="https://git-graph.vercel.app" />

        {/* Structured Data */}
        <StructuredData type="person" />
        <StructuredData type="website" />
        <StructuredData type="organization" />
      </head>
      <body className={`${inter.className} min-h-screen relative`}>
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-orange-500 focus:text-black focus:outline-none focus:ring-2 focus:ring-white"
          >
            Skip to content
          </a>

          <BackgroundEffects />
          <BlogPreloader />
          <Navbar />
          <main id="main-content" className="pt-16 relative z-10">
            {children}
          </main>
          <footer className="mt-12 py-8 relative z-10" role="contentinfo" aria-label="Site Footer">
            <div className="max-w-4xl mx-auto px-4">
              <div className="glass-card p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4 flex items-center justify-center gap-2">
                  © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
                </p>
                <div className="flex justify-center space-x-6" aria-label="Social Media Links">
                  <a
                    href={personalInfo.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link focus-visible:outline-offset-4 focus-visible:outline-orange-500"
                    aria-label={`Visit ${personalInfo.name}'s GitHub Profile`}
                  >
                    <FaGithub className="h-6 w-6" />
                  </a>
                  <a
                    href={personalInfo.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link focus-visible:outline-offset-4 focus-visible:outline-orange-500"
                    aria-label={`Visit ${personalInfo.name}'s LinkedIn Profile`}
                  >
                    <FaLinkedin className="h-6 w-6" />
                  </a>
                  <a
                    href={`mailto:${personalInfo.social.email}`}
                    className="social-link focus-visible:outline-offset-4 focus-visible:outline-orange-500"
                    aria-label={`Email ${personalInfo.name}`}
                  >
                    <Mail className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </footer>
          <SpeedInsights />
          <Analytics />
          <GoogleTagManager gtmId={siteConfig.gtmId} />
        </ThemeProvider>
      </body>
    </html>
  );
}
