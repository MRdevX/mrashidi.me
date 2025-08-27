"use client";

import { motion } from "framer-motion";
import { Activity, ArrowRight, Code2, Mail, MapPin, MessageCircle, Send, Terminal as TerminalIcon } from "lucide-react";
import Link from "next/link";
import { lazy, useEffect, useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import {
  CyberpunkButton,
  LazyLoader,
  MotionSection,
  PageWrapper,
  SectionHeader,
  SocialButton,
  TechStackGrid,
} from "@/components/ui";
import { personalInfo } from "@/data";
import { pageContainerVariants, pageItemVariants } from "@/lib/animations";
import { getMainTechStack } from "@/lib/skills";

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

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const techStack = getMainTechStack();

  if (!mounted) {
    return null;
  }

  return (
    <PageWrapper>
      <motion.div initial="hidden" animate="show" variants={pageContainerVariants}>
        <motion.div className="hero-section content-section" variants={pageItemVariants}>
          <div className="hero-background" />
          <h1 className="text-5xl font-bold text-orange-500 font-cyberpunk glow-text">{personalInfo.name}</h1>
          <p className="hero-subtitle text-body">{personalInfo.title}</p>
          <p className="hero-description text-body">{personalInfo.intro}</p>
          <p className="hero-location text-body">
            <MapPin className="w-5 h-5 icon-primary" />
            {personalInfo.location}
          </p>

          <div className="social-buttons-container">
            <SocialButton href={`mailto:${personalInfo.email}`} icon={Mail} isExternal={false}>
              Email
            </SocialButton>
            <SocialButton href={personalInfo.social.github} icon={FaGithub}>
              GitHub
            </SocialButton>
            <SocialButton href={personalInfo.social.linkedin} icon={FaLinkedin}>
              LinkedIn
            </SocialButton>
            <SocialButton href={personalInfo.social.telegram} icon={Send}>
              Telegram
            </SocialButton>
          </div>

          <div className="scanline absolute inset-0 pointer-events-none" />
        </motion.div>

        <MotionSection className="mb-16" variants={pageItemVariants}>
          <SectionHeader icon={TerminalIcon} title="Interact with Terminal" size="sm" className="justify-center" />
          <LazyLoader
            loadingText="Loading terminal..."
            loadingColor="green"
            fallbackClassName="terminal-window w-full h-96 content-section overflow-hidden rounded-lg flex items-center justify-center"
            minHeight="384px"
          >
            <Terminal />
          </LazyLoader>
        </MotionSection>

        <MotionSection className="mb-16" variants={pageItemVariants}>
          <SectionHeader icon={Code2} title="My Tech Stack" size="sm" className="justify-center" />
          <TechStackGrid techStack={techStack} />
        </MotionSection>

        <MotionSection className="mb-16" variants={pageItemVariants}>
          <SectionHeader icon={Activity} title="GitHub Activity" size="sm" className="justify-center" />
          <MotionSection variants={pageItemVariants} className="w-full overflow-x-auto pb-4">
            <LazyLoader loadingText="Loading GitHub activity...">
              <ContributionGraph />
            </LazyLoader>
          </MotionSection>
        </MotionSection>

        <MotionSection className="text-center" variants={pageItemVariants}>
          <div className="contact-section content-section">
            <div className="contact-section-background" />
            <div className="contact-content">
              <SectionHeader
                icon={MessageCircle}
                title={personalInfo.contactCta}
                size="lg"
                className="justify-center"
              />
              <p className="contact-description text-body">{personalInfo.contactDescription}</p>
              <Link href="/contact" className="block">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <CyberpunkButton
                    variant="neon"
                    icon={<ArrowRight className="w-5 h-5" />}
                    iconPosition="right"
                    className="text-lg px-8 py-3"
                  >
                    Get In Touch
                  </CyberpunkButton>
                </motion.div>
              </Link>
            </div>
          </div>
        </MotionSection>
      </motion.div>
    </PageWrapper>
  );
}
