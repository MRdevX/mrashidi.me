"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Mail, MapPin, Send } from "lucide-react";
import Link from "next/link";
import { lazy, Suspense } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const ContributionGraph = lazy(() =>
  import("@/components/ui/ContributionGraph").then((module) => ({
    default: module.ContributionGraph,
  }))
);

const Terminal = lazy(() =>
  import("@/components/terminal/Terminal").then((module) => ({
    default: module.Terminal,
  }))
);

const LazyLoader = lazy(() =>
  import("@/components/ui").then((module) => ({
    default: module.LazyLoader,
  }))
);

const TechStackGrid = lazy(() =>
  import("@/components/ui").then((module) => ({
    default: module.TechStackGrid,
  }))
);

import { CyberpunkButton, MotionSection, PageWrapper, SectionHeader, SocialButton } from "@/components/ui";
import { Skeleton } from "@/components/ui/Skeleton";
import { TerminalSkeleton } from "@/components/ui/skeletons/TerminalSkeleton";
import { TypingAnimation } from "@/components/ui/TypingAnimation";
import { config, personalInfo } from "@/data";
import {
  pageContainerVariants,
  pageItemVariants,
  reducedMotionPageContainerVariants,
  reducedMotionPageItemVariants,
} from "@/lib/animations";
import { getMainTechStack } from "@/lib/tech";

export default function Home() {
  const techStack = getMainTechStack();
  const prefersReducedMotion = useReducedMotion();
  const containerVariants = prefersReducedMotion ? reducedMotionPageContainerVariants : pageContainerVariants;
  const itemVariants = prefersReducedMotion ? reducedMotionPageItemVariants : pageItemVariants;

  return (
    <PageWrapper>
      <motion.div initial="hidden" animate="show" variants={containerVariants}>
        <motion.div className="hero-section content-section relative overflow-hidden" variants={itemVariants}>
          <div className="hero-background" />
          <div className="hero-gradient-bg absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-orange-400/5 animate-gradient-shift" />
          <div className="relative z-10">
            <h1 className="cyberpunk-h1">{config.person.name}</h1>
            <p className="hero-subtitle text-body">
              <TypingAnimation
                strings={[
                  config.person.title,
                  "Cloud Practitioner",
                  "Node.js & TypeScript Specialist",
                  "Open Source Contributor",
                ]}
                typeSpeed={80}
                deleteSpeed={40}
                pauseAtEnd={1500}
                className="text-orange-400 font-terminal"
              />
            </p>
            <p className="hero-description text-body">{config.site.description}</p>
            <p className="hero-location text-body">
              <MapPin className="w-5 h-5 icon-primary" aria-hidden />
              {config.person.location}
            </p>

            <div className="social-buttons-container">
              <SocialButton href={`mailto:${config.person.email}`} icon={Mail} isExternal={false}>
                Email
              </SocialButton>
              <SocialButton href={config.social.github} icon={FaGithub}>
                GitHub
              </SocialButton>
              <SocialButton href={config.social.linkedin} icon={FaLinkedin}>
                LinkedIn
              </SocialButton>
              <SocialButton href={config.social.telegram} icon={Send}>
                Telegram
              </SocialButton>
            </div>
          </div>
        </motion.div>

        <MotionSection className="mb-16" variants={itemVariants}>
          <SectionHeader iconName="Terminal" title="Interact with Terminal" size="sm" className="justify-center" />
          <Suspense fallback={<TerminalSkeleton />}>
            <LazyLoader
              loadingText="Loading terminal..."
              loadingColor="green"
              fallbackClassName="terminal-window w-full h-96 content-section overflow-hidden rounded-lg flex items-center justify-center"
              minHeight="384px"
            >
              <Terminal />
            </LazyLoader>
          </Suspense>
        </MotionSection>

        <MotionSection className="mb-16" variants={itemVariants}>
          <SectionHeader iconName="Code2" title="My Tech Stack" size="sm" className="justify-center" />
          <Suspense
            fallback={
              <div className="content-section p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["a", "b", "c", "d", "e", "f", "g", "h"].map((id) => (
                    <div key={`tech-skeleton-${id}`} className="flex flex-col items-center gap-2">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <TechStackGrid techStack={techStack} />
          </Suspense>
        </MotionSection>

        <MotionSection className="mb-16" variants={itemVariants}>
          <SectionHeader iconName="Activity" title="GitHub Activity" size="sm" className="justify-center" />
          <MotionSection variants={itemVariants} className="w-full overflow-x-auto pb-4">
            <Suspense
              fallback={
                <div className="content-section p-6">
                  <Skeleton className="h-32 w-full rounded-lg" />
                </div>
              }
            >
              <LazyLoader loadingText="Loading GitHub activity...">
                <ContributionGraph />
              </LazyLoader>
            </Suspense>
          </MotionSection>
        </MotionSection>

        <MotionSection className="text-center" variants={itemVariants}>
          <div className="contact-section content-section">
            <div className="contact-section-background" />
            <div className="contact-content">
              <SectionHeader
                iconName="MessageCircle"
                title={personalInfo.contactCta}
                size="lg"
                className="justify-center"
              />
              <p className="contact-description text-body">{personalInfo.contactDescription}</p>
              <motion.div
                className="inline-block"
                {...(!prefersReducedMotion ? { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } } : {})}
              >
                <CyberpunkButton
                  asChild
                  variant="neon"
                  icon={<ArrowRight className="w-5 h-5" aria-hidden />}
                  iconPosition="right"
                  className="text-lg px-8 py-3"
                >
                  <Link href="/contact">Get In Touch</Link>
                </CyberpunkButton>
              </motion.div>
            </div>
          </div>
        </MotionSection>
      </motion.div>
    </PageWrapper>
  );
}
