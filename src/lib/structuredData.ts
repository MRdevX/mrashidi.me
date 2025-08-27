import { coreConfig, personalInfo } from "@/data";

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

export function generatePersonSchema(): PersonSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: personalInfo.name,
    jobTitle: personalInfo.title,
    url: personalInfo.website,
    email: personalInfo.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Berlin",
      addressCountry: "DE",
    },
    sameAs: [personalInfo.social.github, personalInfo.social.linkedin, personalInfo.social.telegram],
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

export function generateWebsiteSchema(): WebsiteSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: coreConfig.site.name,
    url: coreConfig.site.url,
    description: coreConfig.site.description,
    author: {
      "@type": "Person",
      name: personalInfo.name,
    },
    publisher: {
      "@type": "Organization",
      name: personalInfo.name,
      logo: {
        "@type": "ImageObject",
        url: `${coreConfig.site.url}/profile.jpeg`,
      },
    },
  };
}

export function generateOrganizationSchema(): OrganizationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: `${personalInfo.name} - ${personalInfo.title}`,
    url: coreConfig.site.url,
    logo: `${coreConfig.site.url}/profile.jpeg`,
    description: coreConfig.site.description,
    founder: {
      "@type": "Person",
      name: personalInfo.name,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: personalInfo.email,
    },
  };
}

export function generateBreadcrumbSchema(path: string, _title: string) {
  const baseUrl = coreConfig.site.url;
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
