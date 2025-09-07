import Script from "next/script";
import {
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generatePersonSchema,
  generateWebsiteSchema,
} from "@/lib/structuredData";

interface StructuredDataProps {
  type: "person" | "website" | "organization" | "breadcrumb";
  path?: string;
  title?: string;
}

export default function StructuredData({ type, path, title }: StructuredDataProps) {
  const getSchema = () => {
    switch (type) {
      case "person":
        return generatePersonSchema();
      case "website":
        return generateWebsiteSchema();
      case "organization":
        return generateOrganizationSchema();
      case "breadcrumb":
        return path && title ? generateBreadcrumbSchema(path, title) : null;
      default:
        return null;
    }
  };

  const schema = getSchema();

  if (!schema) {
    return null;
  }

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Safe to use JSON.stringify for structured data
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
