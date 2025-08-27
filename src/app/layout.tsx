import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { AnalyticsWrapper, Footer, HeadMeta, MainContent, Navbar } from "@/components/layout";
import { BackgroundEffects } from "@/components/ui";
import { ThemeProvider } from "@/context/ThemeContext";
import { personalInfo, siteConfig, siteMetadata } from "@/data";
import { BlogPreloader } from "@/features/blog";
import { inter } from "@/lib/fonts";

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
        <HeadMeta />
      </head>
      <body className={`${inter.className} min-h-screen relative`}>
        <ThemeProvider>
          <BackgroundEffects />
          <BlogPreloader />
          <Navbar />
          <MainContent>{children}</MainContent>
          <Footer />
          <AnalyticsWrapper />
        </ThemeProvider>
      </body>
    </html>
  );
}
