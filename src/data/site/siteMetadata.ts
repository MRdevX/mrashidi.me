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

import coreConfig from "../core";

const siteMetadata: SiteMetadata = {
  title: coreConfig.site.title,
  keywords: coreConfig.site.keywords,
  creator: coreConfig.person.name,
  authors: [{ name: coreConfig.person.name, url: coreConfig.site.url }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: coreConfig.site.url,
    siteName: `${coreConfig.person.name} - ${coreConfig.person.title}`,
    title: coreConfig.site.title,
    images: [
      {
        url: `${coreConfig.site.url}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${coreConfig.person.name} - ${coreConfig.person.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: coreConfig.site.title,
    creator: coreConfig.person.twitterHandle,
    images: [`${coreConfig.site.url}/twitter-image.jpg`],
  },
  robots: "index, follow",
  alternates: {
    canonical: coreConfig.site.url,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default siteMetadata;
