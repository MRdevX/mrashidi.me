import type { Metadata, Viewport } from "next";
import { config, siteConfig } from "@/data";

interface PageMetadataConfig {
  page: string;
  title: string;
  description: string;
  keywords: readonly string[] | string[];
  ogType?: "website" | "profile";
  ogImage?: string;
}

export function generatePageMetadata(pageConfig: PageMetadataConfig): Metadata {
  const { page, title, description, keywords, ogType = "website", ogImage = `og-${page}.jpg` } = pageConfig;

  const fullTitle = `${title} - ${config.person.name}`;
  const fullDescription = description;
  const fullKeywords = keywords.join(", ");

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: fullKeywords,
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: `${config.site.url}/${page}`,
      type: ogType,
      images: [
        {
          url: `${config.site.url}/${ogImage}`,
          width: 1200,
          height: 630,
          alt: `${config.person.name} - ${title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [`${config.site.url}/${ogImage}`],
    },
    alternates: {
      canonical: `${config.site.url}/${page}`,
    },
  };
}

export function generateRootMetadata(): Metadata {
  const homeConfig = pageMetadataConfigs.home;
  const baseMetadata = generatePageMetadata(homeConfig);

  return {
    ...baseMetadata,
    creator: config.person.name,
    authors: [{ name: config.person.name, url: config.site.url }],
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

export const pageMetadataConfigs = {
  home: {
    page: "",
    title: "Home",
    description: config.site.description,
    keywords: [
      config.person.name,
      config.person.title,
      "software engineer",
      "backend developer",
      "portfolio",
      "full-stack",
      "node.js",
      "typescript",
      "react",
      config.person.location,
    ],
    ogImage: "og-image.jpg",
  },
  about: {
    page: "about",
    title: "About",
    description: `Learn more about ${config.person.name}, a ${config.person.title} based in ${config.person.location}. Discover my background, skills, and experience in software development.`,
    keywords: [
      config.person.name,
      "about",
      "software engineer",
      "backend developer",
      config.person.location,
      "skills",
      "experience",
    ],
    ogType: "profile" as const,
  },
  blog: {
    page: "blog",
    title: "Blog",
    description: `Read ${config.person.name}'s software engineering articles, technical insights, and development tutorials. Learn about backend development, system design, and modern web technologies.`,
    keywords: [
      config.person.name,
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
    description: `Get in touch with ${config.person.name}, a ${config.person.title} based in ${config.person.location}. Available for freelance work, collaboration, and technical discussions.`,
    keywords: [
      config.person.name,
      "contact",
      "freelance",
      "software engineer",
      "collaboration",
      config.person.location,
      "backend developer",
    ],
  },
  projects: {
    page: "projects",
    title: "Projects",
    description: `Explore ${config.person.name}'s software engineering projects. View open source contributions, full-stack applications, and technical solutions built with modern technologies.`,
    keywords: [
      config.person.name,
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
    description: `Download ${config.person.name}'s professional resume and CV. View work experience, skills, and qualifications as a ${config.person.title} based in ${config.person.location}.`,
    keywords: [
      config.person.name,
      "resume",
      "cv",
      "professional experience",
      config.person.title,
      config.person.location,
      "software engineer",
      "backend developer",
    ],
  },
} as const;
