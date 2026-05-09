"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { config } from "@/data";
import { ResumeFilamentDivider } from "@/features/resume";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { ContactMotionFade } from "./ContactMotionFade";
import { ContactSectionShell } from "./ContactSectionShell";

const SITE_REPO = config.social.githubRepo;

export function ContactContributionSection() {
  const { getTextColor } = useThemeConfig();

  return (
    <>
      <PageHeader iconName="GitFork" title="Open source & collaboration" titleHeading="h2" />
      <ContactSectionShell delay={0.04} className="mt-2 md:mt-4">
        <div className="relative isolate z-0 w-full p-6 sm:p-8 feature-card group">
          <div className="relative z-10 mx-auto w-full max-w-5xl text-center font-albert">
            <ContactMotionFade
              as="p"
              delay={0.04}
              className="text-lg font-semibold leading-snug tracking-tight text-balance text-foreground sm:text-xl"
            >
              Code is more useful when it&apos;s shared
            </ContactMotionFade>

            <div className="my-5">
              <ResumeFilamentDivider align="center" symmetric />
            </div>

            <div
              className={`space-y-5 text-sm leading-relaxed text-pretty sm:text-base sm:leading-7 ${getTextColor("secondary")}`}
            >
              <ContactMotionFade as="p" delay={0.1}>
                I ship things publicly by default instead of tucking repos away quietly. This portfolio is no different:{" "}
                <Link
                  href={SITE_REPO}
                  className="font-semibold text-foreground underline decoration-primary/55 underline-offset-4 transition-colors hover:decoration-primary"
                  prefetch={false}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  the full source is here
                </Link>
                , open to issues and pull requests.
              </ContactMotionFade>
              <ContactMotionFade as="p" delay={0.13}>
                Want more repos to explore? Browse the{" "}
                <Link
                  href="/projects"
                  className="font-semibold text-foreground underline decoration-primary/55 underline-offset-4 transition-colors hover:decoration-primary"
                >
                  Projects
                </Link>{" "}
                page. It&apos;s where I catalogue public work you can skim, fork, or improve. Most repos there leave the
                door open for contributors too.
              </ContactMotionFade>
              <ContactMotionFade as="p" delay={0.16}>
                Seen something else worth contributing to? Send a link and a sentence. I&apos;m always looking.
              </ContactMotionFade>
            </div>
          </div>
        </div>
      </ContactSectionShell>
    </>
  );
}
