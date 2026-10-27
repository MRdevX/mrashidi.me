import Script from "next/script";
import { getSiteContent } from "@/lib/content/server";
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

export default async function StructuredData({ type, path, title }: StructuredDataProps) {
  const content = await getSiteContent();
  const { profile } = content;
  const getSchema = () => {
    switch (type) {
      case "person":
        return generatePersonSchema(content);
      case "website":
        return generateWebsiteSchema(profile);
      case "organization":
        return generateOrganizationSchema(profile);
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
    <Script id={`structured-data-${type}`} type="application/ld+json" strategy="afterInteractive">
      {JSON.stringify(schema)}
    </Script>
  );
}
