import type { Profile } from "@mrashidi/types";
import type { Metadata, Viewport } from "next";
import { SITE_URL, siteConfig } from "@/data";

interface PageMetadataConfig {
  page: string;
  title: string;
  description: string;
  keywords: readonly string[] | string[];
  ogType?: "website" | "profile";
  ogImage?: string;
}

export type MetadataPage = keyof ReturnType<typeof pageMetadataConfigs>;

export function generatePageMetadata(profile: Profile, pageKey: MetadataPage): Metadata {
  const pageConfig: PageMetadataConfig = pageMetadataConfigs(profile)[pageKey];
  const { page, title, description, keywords, ogType = "website", ogImage = `og-${page}.png` } = pageConfig;

  const fullTitle = `${title} - ${profile.person.name}`;
  const fullDescription = description;
  const fullKeywords = keywords.join(", ");

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: fullKeywords,
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: `${SITE_URL}/${page}`,
      type: ogType,
      images: [
        {
          url: `${SITE_URL}/${ogImage}`,
          width: 1200,
          height: 630,
          alt: `${profile.person.name} - ${title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [`${SITE_URL}/${ogImage}`],
    },
    alternates: {
      canonical: `${SITE_URL}/${page}`,
    },
  };
}

export function generateRootMetadata(profile: Profile): Metadata {
  const baseMetadata = generatePageMetadata(profile, "home");

  return {
    ...baseMetadata,
    creator: profile.person.name,
    authors: [{ name: profile.person.name, url: SITE_URL }],
    robots: "index, follow",
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
  };
}

export function generateViewport(): Viewport {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    minimumScale: 1,
    userScalable: true,
    themeColor: siteConfig.themeColor,
    viewportFit: "cover",
  };
}

export const pageMetadataConfigs = (profile: Profile) =>
  ({
    home: {
      page: "",
      title: "Home",
      description: profile.site.description,
      keywords: [
        profile.person.name,
        profile.person.title,
        "software engineer",
        "backend developer",
        "portfolio",
        "full-stack",
        "node.js",
        "typescript",
        "react",
        profile.person.location,
      ],
      ogImage: "og-image.png",
    },
    about: {
      page: "about",
      title: "About",
      description: `Learn more about ${profile.person.name}, a ${profile.person.title} based in ${profile.person.location}. Discover my background, skills, and experience in software development.`,
      keywords: [
        profile.person.name,
        "about",
        "software engineer",
        "backend developer",
        profile.person.location,
        "skills",
        "experience",
      ],
      ogType: "profile" as const,
    },
    blog: {
      page: "blog",
      title: "Blog",
      description: `Read ${profile.person.name}'s software engineering articles, technical insights, and development tutorials. Learn about backend development, system design, and modern web technologies.`,
      keywords: [
        profile.person.name,
        "blog",
        "software engineering",
        "technical articles",
        "backend development",
        "tutorials",
        "system design",
        "web development",
      ],
    },
    contact: {
      page: "contact",
      title: "Contact",
      description: `Get in touch with ${profile.person.name}, a ${profile.person.title} based in ${profile.person.location}. Available for freelance work, collaboration, and technical discussions.`,
      keywords: [
        profile.person.name,
        "contact",
        "freelance",
        "software engineer",
        "collaboration",
        profile.person.location,
        "backend developer",
      ],
    },
    projects: {
      page: "projects",
      title: "Projects",
      description: `Explore ${profile.person.name}'s software engineering projects. View open source contributions, full-stack applications, and technical solutions built with modern technologies.`,
      keywords: [
        profile.person.name,
        "projects",
        "portfolio",
        "software engineer",
        "open source",
        "github",
        "node.js",
        "typescript",
        "react",
        "full-stack",
      ],
    },
    resume: {
      page: "resume",
      title: "Resume",
      description: `Download ${profile.person.name}'s professional resume and CV. View work experience, skills, and qualifications as a ${profile.person.title} based in ${profile.person.location}.`,
      keywords: [
        profile.person.name,
        "resume",
        "cv",
        "professional experience",
        profile.person.title,
        profile.person.location,
        "software engineer",
        "backend developer",
      ],
    },
    privacy: {
      page: "privacy",
      title: "Privacy Policy",
      description: `Privacy Policy for ${profile.person.name}'s portfolio and PWA. Learn how we collect, use, and protect your data.`,
      keywords: [profile.person.name, "privacy policy", "data protection", "GDPR", "personal data", "portfolio"],
    },
  }) as const;
