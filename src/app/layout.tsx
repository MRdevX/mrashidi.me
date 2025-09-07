import type { Metadata, Viewport } from "next";
import "@/styles/index.css";
import { lazy, Suspense } from "react";

import { HeadMeta, MainContent, Navbar } from "@/components/layout";
import { ThemeProvider } from "@/context/ThemeContext";
import { inter } from "@/lib/fonts";
import { generateRootMetadata, generateViewport } from "@/lib/metadata";

const AnalyticsWrapper = lazy(() =>
  import("@/components/layout").then((module) => ({
    default: module.AnalyticsWrapper,
  }))
);

const BottomNavigation = lazy(() =>
  import("@/components/layout").then((module) => ({
    default: module.BottomNavigation,
  }))
);

const Footer = lazy(() =>
  import("@/components/layout").then((module) => ({
    default: module.Footer,
  }))
);

const BackgroundEffects = lazy(() =>
  import("@/components/ui").then((module) => ({
    default: module.BackgroundEffects,
  }))
);

const BlogPreloader = lazy(() =>
  import("@/features/blog").then((module) => ({
    default: module.BlogPreloader,
  }))
);

export const viewport: Viewport = generateViewport();
export const metadata: Metadata = generateRootMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable}`}>
      <head>
        <HeadMeta />
      </head>
      <body className={`${inter.className} min-h-screen relative`}>
        <ThemeProvider>
          <Suspense fallback={null}>
            <BackgroundEffects />
          </Suspense>
          <Suspense fallback={null}>
            <BlogPreloader />
          </Suspense>
          <Navbar />
          <MainContent>{children}</MainContent>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
          <Suspense fallback={null}>
            <BottomNavigation />
          </Suspense>
          <Suspense fallback={null}>
            <AnalyticsWrapper />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
