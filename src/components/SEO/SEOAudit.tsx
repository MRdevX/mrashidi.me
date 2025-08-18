"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

interface SEOAuditItem {
  id: string;
  title: string;
  description: string;
  status: "pass" | "fail" | "warning" | "info";
  fix?: string;
}

export default function SEOAudit() {
  const [auditResults, setAuditResults] = useState<SEOAuditItem[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const audit = performSEOAudit();
    setAuditResults(audit);
  }, []);

  const performSEOAudit = (): SEOAuditItem[] => {
    const results: SEOAuditItem[] = [];

    // Check title
    const title = document.title;
    if (title && title.length > 10 && title.length < 60) {
      results.push({
        id: "title",
        title: "Page Title",
        description: `Title is ${title.length} characters long`,
        status: "pass",
      });
    } else {
      results.push({
        id: "title",
        title: "Page Title",
        description: `Title should be 10-60 characters (current: ${title.length})`,
        status: "fail",
        fix: "Optimize page title length",
      });
    }

    // Check meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      const content = metaDescription.getAttribute("content") || "";
      if (content.length > 50 && content.length < 160) {
        results.push({
          id: "description",
          title: "Meta Description",
          description: `Description is ${content.length} characters long`,
          status: "pass",
        });
      } else {
        results.push({
          id: "description",
          title: "Meta Description",
          description: `Description should be 50-160 characters (current: ${content.length})`,
          status: "fail",
          fix: "Optimize meta description length",
        });
      }
    } else {
      results.push({
        id: "description",
        title: "Meta Description",
        description: "Meta description is missing",
        status: "fail",
        fix: "Add meta description tag",
      });
    }

    // Check headings
    const h1s = document.querySelectorAll("h1");
    if (h1s.length === 1) {
      results.push({
        id: "h1",
        title: "H1 Tags",
        description: "One H1 tag found",
        status: "pass",
      });
    } else {
      results.push({
        id: "h1",
        title: "H1 Tags",
        description: `Found ${h1s.length} H1 tags (should be 1)`,
        status: "fail",
        fix: "Ensure only one H1 tag per page",
      });
    }

    // Check images
    const images = document.querySelectorAll("img");
    let imagesWithAlt = 0;
    images.forEach((img) => {
      if (img.alt && img.alt.trim() !== "") {
        imagesWithAlt++;
      }
    });

    if (images.length === 0) {
      results.push({
        id: "images",
        title: "Image Alt Text",
        description: "No images found",
        status: "info",
      });
    } else if (imagesWithAlt === images.length) {
      results.push({
        id: "images",
        title: "Image Alt Text",
        description: `All ${images.length} images have alt text`,
        status: "pass",
      });
    } else {
      results.push({
        id: "images",
        title: "Image Alt Text",
        description: `${imagesWithAlt}/${images.length} images have alt text`,
        status: "warning",
        fix: "Add alt text to all images",
      });
    }

    // Check links
    const links = document.querySelectorAll("a");
    let linksWithRel = 0;
    links.forEach((link) => {
      const href = link.getAttribute("href");
      const rel = link.getAttribute("rel");
      if (href && href.startsWith("http") && rel && rel.includes("noopener")) {
        linksWithRel++;
      }
    });

    if (links.length === 0) {
      results.push({
        id: "links",
        title: "External Links",
        description: "No external links found",
        status: "info",
      });
    } else {
      results.push({
        id: "links",
        title: "External Links",
        description: `${linksWithRel} external links have proper rel attributes`,
        status: linksWithRel === links.length ? "pass" : "warning",
        fix: "Add rel='noopener noreferrer' to external links",
      });
    }

    // Check structured data
    const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
    if (structuredData.length > 0) {
      results.push({
        id: "structured-data",
        title: "Structured Data",
        description: `${structuredData.length} structured data blocks found`,
        status: "pass",
      });
    } else {
      results.push({
        id: "structured-data",
        title: "Structured Data",
        description: "No structured data found",
        status: "fail",
        fix: "Add JSON-LD structured data",
      });
    }

    return results;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "fail":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass":
        return "border-green-500 bg-green-50 dark:bg-green-900/20";
      case "fail":
        return "border-red-500 bg-red-50 dark:bg-red-900/20";
      case "warning":
        return "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
      case "info":
        return "border-blue-500 bg-blue-50 dark:bg-blue-900/20";
      default:
        return "border-gray-300 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
      >
        SEO Audit
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-96 overflow-y-auto bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">SEO Audit</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ×
        </button>
      </div>

      <div className="space-y-3">
        {auditResults.map((item) => (
          <div key={item.id} className={`p-3 rounded-lg border ${getStatusColor(item.status)}`}>
            <div className="flex items-start gap-3">
              {getStatusIcon(item.status)}
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">{item.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                {item.fix && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">💡 {item.fix}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
