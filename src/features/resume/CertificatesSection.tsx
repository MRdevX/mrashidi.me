"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, ExternalLink } from "lucide-react";
import { SectionHeader, SurfaceCard } from "@/components/ui";
import { type Certificate, certificates } from "@/data";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { pageEnterTransition } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { accentTextClass } from "./styles";

const certRowClass = "flex h-full items-start gap-3 rounded-lg border p-3 transition-colors duration-200";

function CertificateRow({ cert }: { cert: Certificate }) {
  const { getTextColor, getBorderColor } = useThemeConfig();

  const body = (
    <>
      <BadgeCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className={cn("font-medium leading-snug", getTextColor("primary"))}>{cert.name}</p>
        <p className={cn("mt-1 text-xs", getTextColor("secondary"))}>
          {cert.provider}
          <span aria-hidden> · </span>
          <span className="sr-only">, </span>
          {cert.type}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5 text-xs">
        <span className={cn("tabular-nums", getTextColor("muted"))}>{cert.year}</span>
        {cert.url ? (
          <span className={cn("inline-flex items-center gap-1 font-medium", accentTextClass)}>
            Verify
            <ExternalLink className="size-3" aria-hidden />
            <span className="sr-only">(opens in new tab)</span>
          </span>
        ) : null}
      </div>
    </>
  );

  if (!cert.url) {
    return <div className={cn(certRowClass, getBorderColor("primary"))}>{body}</div>;
  }

  return (
    <a
      href={cert.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        certRowClass,
        getBorderColor("primary"),
        "hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      )}
    >
      {body}
    </a>
  );
}

export function CertificatesSection() {
  const { getTextColor } = useThemeConfig();
  const prefersReducedMotion = useReducedMotion();

  return (
    <section>
      <SectionHeader as="h2" iconName="Award" title="Certifications" />
      <div className="space-y-6">
        {certificates.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 1, y: prefersReducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={pageEnterTransition(prefersReducedMotion, { delay: 0.08 * categoryIndex })}
          >
            <SurfaceCard static className="border-primary/15">
              <div className="relative z-10">
                <h3 className={cn("mb-4 text-lg font-semibold tracking-tight", getTextColor("primary"))}>
                  {category.category}
                </h3>
                <ul className="grid gap-2 md:grid-cols-2">
                  {category.certificates.map((cert) => (
                    <li key={cert.name}>
                      <CertificateRow cert={cert} />
                    </li>
                  ))}
                </ul>
              </div>
            </SurfaceCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
