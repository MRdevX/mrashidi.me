"use client";

import { motion } from "framer-motion";
import { Award, CheckCircle, ExternalLink } from "lucide-react";
import { certificates } from "@/data";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { ResumeFilamentDivider } from "./ResumeFilamentDivider";

export function CertificatesSection() {
  const { getSectionTitle, getTextColor, getBackgroundColor, getBorderColor, getCardPattern } = useThemeConfig();

  return (
    <section className="mb-16">
      <header className="mb-8 space-y-5">
        <div className="flex items-center gap-3">
          <Award className="size-8 shrink-0 text-orange-500" aria-hidden />
          <h2 className={getSectionTitle()}>Recent Certifications</h2>
        </div>
        <ResumeFilamentDivider />
      </header>
      <div className="space-y-8">
        {certificates.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            className={`${getCardPattern()} relative isolate z-0`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * categoryIndex }}
          >
            <div className="relative z-10">
              <div className="mb-6 space-y-3">
                <h3 className="text-2xl font-semibold text-orange-500 transition-colors group-hover:text-orange-400">
                  {category.category}
                </h3>
                <ResumeFilamentDivider />
              </div>
              <div className="space-y-2">
                {category.certificates.map((cert, i) => (
                  <motion.div
                    key={cert.name}
                    className={`flex items-center p-3 rounded-lg border ${getBorderColor(
                      "primary"
                    )} hover:border-orange-500 transition-all duration-300 relative z-10 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-orange-500/30 ${
                      cert.url ? `cursor-pointer hover:${getBackgroundColor("muted")}` : ""
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    role={cert.url ? "button" : undefined}
                    tabIndex={cert.url ? 0 : undefined}
                    aria-label={cert.url ? `Open ${cert.name} in new tab` : undefined}
                    onClick={() => cert.url && window.open(cert.url, "_blank")}
                    onKeyDown={(e) => {
                      if (!cert.url) {
                        return;
                      }
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        window.open(cert.url, "_blank");
                      }
                    }}
                  >
                    <CheckCircle className="w-5 h-5 text-orange-500 shrink-0 mr-3" aria-hidden />
                    <div className="flex-1 min-w-0">
                      <div
                        className={`font-medium ${getTextColor("primary")} hover:${getTextColor(
                          "primary"
                        )} transition-colors flex items-center`}
                      >
                        {cert.name}
                        {cert.url && <ExternalLink className="w-4 h-4 ml-2 text-orange-500 shrink-0" aria-hidden />}
                      </div>
                    </div>
                    <div className="text-sm text-gray-800 dark:text-gray-200 text-right ml-4">
                      <div>{cert.year}</div>
                      <div className="text-xs text-gray-700 dark:text-gray-300">{cert.provider}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
