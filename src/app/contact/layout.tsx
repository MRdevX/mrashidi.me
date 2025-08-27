import type { Metadata } from "next";
import { coreConfig, personalInfo } from "@/data";

export const metadata: Metadata = {
  title: `Contact - ${personalInfo.name} | Get In Touch`,
  description: `Get in touch with ${personalInfo.name}, a ${personalInfo.title} based in ${personalInfo.location}. Available for freelance work, collaboration, and technical discussions.`,
  keywords: `${personalInfo.name}, contact, freelance, software engineer, collaboration, ${personalInfo.location}, backend developer`,
  openGraph: {
    title: `Contact - ${personalInfo.name}`,
    description: `Get in touch with ${personalInfo.name} for freelance work, collaboration, or technical discussions.`,
    url: `${coreConfig.site.url}/contact`,
    type: "website",
    images: [
      {
        url: `${coreConfig.site.url}/og-contact.jpg`,
        width: 1200,
        height: 630,
        alt: `${personalInfo.name} - Contact`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Contact - ${personalInfo.name}`,
    description: `Get in touch with ${personalInfo.name} for freelance work, collaboration, or technical discussions.`,
    images: [`${coreConfig.site.url}/og-contact.jpg`],
  },
  alternates: {
    canonical: `${coreConfig.site.url}/contact`,
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
