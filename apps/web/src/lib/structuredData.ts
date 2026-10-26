import type { Profile } from "@mrashidi/types";
import { SITE_URL } from "@/data";

export interface PersonSchema {
  "@context": "https://schema.org";
  "@type": "Person";
  name: string;
  jobTitle: string;
  url: string;
  email: string;
  address: {
    "@type": "PostalAddress";
    addressLocality: string;
    addressCountry: string;
  };
  sameAs: string[];
  worksFor: {
    "@type": "Organization";
    name: string;
  };
  knowsAbout: string[];
  alumniOf: {
    "@type": "Organization";
    name: string;
  };
}

export interface WebsiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
  author: {
    "@type": "Person";
    name: string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
    logo: {
      "@type": "ImageObject";
      url: string;
    };
  };
}

export interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  description: string;
  founder: {
    "@type": "Person";
    name: string;
  };
  contactPoint: {
    "@type": "ContactPoint";
    contactType: "customer service";
    email: string;
  };
}

export function generatePersonSchema(profile: Profile): PersonSchema {
  const [locality, country = ""] = profile.person.location.split(",").map((part) => part.trim());
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.person.name,
    jobTitle: profile.person.title,
    url: profile.person.website,
    email: profile.person.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: locality,
      addressCountry: country,
    },
    sameAs: [profile.social.github, profile.social.linkedin, profile.social.telegram],
    worksFor: {
      "@type": "Organization",
      name: "Freelance",
    },
    knowsAbout: [
      "Software Engineering",
      "Backend Development",
      "Node.js",
      "TypeScript",
      "Cloud Architecture",
      "System Design",
      "API Development",
      "Database Design",
    ],
    alumniOf: {
      "@type": "Organization",
      name: "Software Engineering Education",
    },
  };
}

export function generateWebsiteSchema(profile: Profile): WebsiteSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: profile.site.name,
    url: SITE_URL,
    description: profile.site.description,
    author: {
      "@type": "Person",
      name: profile.person.name,
    },
    publisher: {
      "@type": "Organization",
      name: profile.person.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/profile.jpeg`,
      },
    },
  };
}

export function generateOrganizationSchema(profile: Profile): OrganizationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: `${profile.person.name} - ${profile.person.title}`,
    url: SITE_URL,
    logo: `${SITE_URL}/profile.jpeg`,
    description: profile.site.description,
    founder: {
      "@type": "Person",
      name: profile.person.name,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: profile.person.email,
    },
  };
}

export function generateBreadcrumbSchema(path: string, _title: string) {
  const baseUrl = SITE_URL;
  const pathSegments = path.split("/").filter(Boolean);

  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: baseUrl,
    },
  ];

  let currentPath = "";
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    breadcrumbItems.push({
      "@type": "ListItem",
      position: index + 2,
      name: segment.charAt(0).toUpperCase() + segment.slice(1),
      item: `${baseUrl}${currentPath}`,
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };
}
