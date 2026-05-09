"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  pageContainerVariants,
  pageItemVariants,
  reducedMotionPageContainerVariants,
  reducedMotionPageItemVariants,
} from "@/lib/animations";
import { getMainTechStack } from "@/lib/tech";
import { HomeContactSection } from "./HomeContactSection";
import { HomeContributionSection } from "./HomeContributionSection";
import { HomeHero } from "./HomeHero";
import { HomeTechStackSection } from "./HomeTechStackSection";
import { HomeTerminalSection } from "./HomeTerminalSection";

export function HomePage() {
  const techStack = getMainTechStack();
  const prefersReducedMotion = useReducedMotion();
  const containerVariants = prefersReducedMotion ? reducedMotionPageContainerVariants : pageContainerVariants;
  const itemVariants = prefersReducedMotion ? reducedMotionPageItemVariants : pageItemVariants;

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants}>
      <HomeHero variants={itemVariants} />
      <HomeTerminalSection variants={itemVariants} />
      <HomeTechStackSection variants={itemVariants} techStack={techStack} />
      <HomeContributionSection variants={itemVariants} />
      <HomeContactSection variants={itemVariants} reducedMotion={prefersReducedMotion ?? false} />
    </motion.div>
  );
}
