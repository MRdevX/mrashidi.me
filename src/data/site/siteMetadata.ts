export interface SiteMetadata {
  title: string;
  keywords: string;
  creator: string;
  authors: Array<{ name: string; url: string }>;
  openGraph: {
    type: string;
    locale: string;
    url: string;
    siteName: string;
    title: string;
    images: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
  };
  twitter: {
    card: string;
    title: string;
    creator: string;
    images: string[];
  };
  robots: string;
  alternates: {
    canonical: string;
  };
  icons: {
    icon: string;
    shortcut: string;
    apple: string;
  };
}

import { config } from "../config";

const siteMetadata: SiteMetadata = {
  title: config.site.title,
  keywords: config.site.keywords,
  creator: config.person.name,
  authors: [{ name: config.person.name, url: config.site.url }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: config.site.url,
    siteName: `${config.person.name} - ${config.person.title}`,
    title: config.site.title,
    images: [
      {
        url: `${config.site.url}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${config.person.name} - ${config.person.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: config.site.title,
    creator: config.person.twitterHandle,
    images: [`${config.site.url}/twitter-image.jpg`],
  },
  robots: "index, follow",
  alternates: {
    canonical: config.site.url,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default siteMetadata;
