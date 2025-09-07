import { config, personalInfo } from "@/data";

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
    name: config.person.name,
    jobTitle: config.person.title,
    url: config.person.website,
    email: config.person.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Berlin",
      addressCountry: "DE",
    },
    sameAs: [config.social.github, config.social.linkedin, config.social.telegram],
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
    name: config.site.name,
    url: config.site.url,
    description: config.site.description,
    author: {
      "@type": "Person",
      name: config.person.name,
    },
    publisher: {
      "@type": "Organization",
      name: config.person.name,
      logo: {
        "@type": "ImageObject",
        url: `${config.site.url}/profile.jpeg`,
      },
    },
  };
}

export function generateOrganizationSchema(): OrganizationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: `${config.person.name} - ${config.person.title}`,
    url: config.site.url,
    logo: `${config.site.url}/profile.jpeg`,
    description: config.site.description,
    founder: {
      "@type": "Person",
      name: config.person.name,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: config.person.email,
    },
  };
}

export function generateBreadcrumbSchema(path: string, _title: string) {
  const baseUrl = config.site.url;
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
