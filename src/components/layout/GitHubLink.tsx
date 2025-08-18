import { motion } from "framer-motion";
import { Disclosure } from "@headlessui/react";
import { Github } from "lucide-react";
import { githubLink } from "@/data";

interface GitHubLinkProps {
  variant?: "desktop" | "mobile";
}

export const GitHubLink = ({ variant = "desktop" }: GitHubLinkProps) => {
  const isMobile = variant === "mobile";

  const mobileProps = isMobile
    ? {
        as: "a" as const,
        className:
          "flex items-center py-2 pl-3 pr-4 text-base font-medium border-l-4 border-transparent text-gray-400 hover:text-orange-400 hover:border-orange-400 hover:bg-gray-800/30 focus-visible:outline-offset-4 focus-visible:outline-orange-500",
      }
    : {};

  const desktopProps = !isMobile
    ? {
        className:
          "hidden sm:flex items-center space-x-2 px-3 py-1 text-sm text-gray-400 hover:text-orange-500 transition-colors duration-200 focus-visible:outline-offset-4 focus-visible:outline-orange-500 border border-gray-600 hover:border-orange-500 rounded-md",
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
      }
    : {};

  const iconSize = isMobile ? "h-5 w-5" : "h-4 w-4";
  const iconMargin = isMobile ? "mr-3" : "";
  const label = isMobile ? githubLink.mobileLabel : githubLink.label;

  const linkContent = (
    <>
      <Github className={`${iconSize} ${iconMargin}`} aria-hidden="true" />
      {!isMobile && <span>{label}</span>}
      {isMobile && label}
    </>
  );

  if (isMobile) {
    return (
      <Disclosure.Button
        as="a"
        href={githubLink.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={githubLink.ariaLabel}
        {...mobileProps}
      >
        {linkContent}
      </Disclosure.Button>
    );
  }

  return (
    <motion.a
      href={githubLink.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={githubLink.ariaLabel}
      {...desktopProps}
    >
      {linkContent}
    </motion.a>
  );
};
