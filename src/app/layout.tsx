import type { Metadata, Viewport } from "next";
import "@/styles/index.css";
import { AnalyticsWrapper, BottomNavigation, Footer, HeadMeta, MainContent, Navbar } from "@/components/layout";
import { BackgroundEffects } from "@/components/ui";
import { ThemeProvider } from "@/context/ThemeContext";

import { BlogPreloader } from "@/features/blog";
import { inter } from "@/lib/fonts";
import { generateRootMetadata, generateViewport } from "@/lib/metadata";

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
          <BackgroundEffects />
          <BlogPreloader />
          <Navbar />
          <MainContent>{children}</MainContent>
          <Footer />
          <BottomNavigation />
          <AnalyticsWrapper />
        </ThemeProvider>
      </body>
    </html>
  );
}
