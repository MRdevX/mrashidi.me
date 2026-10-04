"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Award, CheckCircle, ExternalLink } from "lucide-react";
import { certificates } from "@/data";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { pageEnterTransition } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { ResumeHeadingBlock, ResumeSubsectionHeading } from "./ResumeHeadingBlock";

const certRowClass =
  "relative z-10 flex items-center rounded-lg border p-3 transition-all duration-300 hover:border-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]";

export function CertificatesSection() {
  const { getTextColor, getBorderColor, getCardPattern } = useThemeConfig();
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="mb-16">
      <ResumeHeadingBlock icon={Award} title="Recent Certifications" />
      <div className="space-y-8">
        {certificates.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            className={cn(getCardPattern(), "feature-card--static relative isolate z-0")}
            initial={{ opacity: 1, y: prefersReducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={pageEnterTransition(prefersReducedMotion, { delay: 0.1 * categoryIndex })}
          >
            <div className="relative z-10">
              <ResumeSubsectionHeading title={category.category} />
              <ul className="not-prose space-y-2">
                {category.certificates.map((cert) => {
                  const body = (
                    <>
                      <CheckCircle className="mr-3 size-5 shrink-0 text-orange-500" aria-hidden />
                      <div className="min-w-0 flex-1">
                        <div className={cn("flex items-center font-medium", getTextColor("primary"))}>
                          {cert.name}
                          {cert.url && <ExternalLink className="ml-2 size-4 shrink-0 text-orange-500" aria-hidden />}
                        </div>
                      </div>
                      <div className="ml-4 text-right text-sm text-gray-800 dark:text-gray-200">
                        <div>{cert.year}</div>
                        <div className="text-xs text-gray-700 dark:text-gray-300">{cert.provider}</div>
                      </div>
                    </>
                  );

                  return (
                    <li key={cert.name}>
                      {cert.url ? (
                        <a
                          href={cert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${cert.name} (opens in new tab)`}
                          className={cn(
                            certRowClass,
                            getBorderColor("primary"),
                            "hover:bg-gray-100 dark:hover:bg-gray-800"
                          )}
                        >
                          {body}
                        </a>
                      ) : (
                        <div className={cn(certRowClass, getBorderColor("primary"))}>{body}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
