import { StructuredData } from "@/components/SEO";
import { siteConfig } from "@/data";

export function HeadMeta() {
  return (
    <>
      {/* Favicon and App Icons */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" type="image/png" sizes="192x192" href="/icons/web/icon-192.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="/icons/web/icon-512.png" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />

      {/* Theme and App Meta */}
      <meta name="theme-color" content={siteConfig.themeColor} />
      <meta name="msapplication-TileColor" content={siteConfig.msTileColor} />
      <meta name="apple-mobile-web-app-capable" content={siteConfig.appleMobileWebAppCapable ? "yes" : "no"} />
      <meta name="apple-mobile-web-app-status-bar-style" content={siteConfig.appleMobileWebAppStatusBarStyle} />
      <meta name="apple-mobile-web-app-title" content={siteConfig.appleMobileWebAppTitle} />
      <meta name="mobile-web-app-capable" content={siteConfig.mobileWebAppCapable ? "yes" : "no"} />
      <meta name="application-name" content={siteConfig.appName} />

      {/* Performance Optimizations */}
      <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://cdn-images-1.medium.com" />
      <link rel="dns-prefetch" href="https://miro.medium.com" />
      <link rel="dns-prefetch" href="https://git-graph.vercel.app" />

      {/* Structured Data */}
      <StructuredData type="person" />
      <StructuredData type="website" />
      <StructuredData type="organization" />
    </>
  );
}
