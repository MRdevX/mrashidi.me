"use client";

import { motion } from "framer-motion";
import { Disclosure } from "@headlessui/react";
import { useState, useEffect } from "react";
import { GitBranch } from "lucide-react";
import { githubLink } from "@/data";

interface VersionBadgeProps {
  variant?: "desktop" | "mobile";
}

export const VersionBadge = ({ variant = "desktop" }: VersionBadgeProps) => {
  const [version, setVersion] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = variant === "mobile";

  useEffect(() => {
    const getVersion = async () => {
      try {
        const response = await fetch("/api/version");
        if (response.ok) {
          const data = await response.json();
          setVersion(data.version);
        } else {
          throw new Error("Failed to fetch version");
        }
      } catch (_error) {
        const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || "0.1.30";
        setVersion(appVersion);
      }
    };

    getVersion();
  }, []);

  if (!version) return null;

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
          "hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg backdrop-blur-sm hover:border-orange-500/40 transition-all duration-200 focus-visible:outline-offset-4 focus-visible:outline-orange-500",
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        onHoverStart: () => setIsHovered(true),
        onHoverEnd: () => setIsHovered(false),
      }
    : {};

  const linkContent = isMobile ? (
    <>
      <GitBranch className="h-5 w-5 mr-3" aria-hidden="true" />
      main v{version}
    </>
  ) : (
    <>
      <motion.div animate={{ rotate: isHovered ? 360 : 0 }} transition={{ duration: 0.6, ease: "easeInOut" }}>
        <GitBranch className="w-3 h-3 text-orange-400" />
      </motion.div>

      <motion.span
        className="text-xs font-mono text-orange-300 tracking-wider"
        animate={{
          textShadow: isHovered ? "0 0 8px rgba(251, 146, 60, 0.8)" : "0 0 2px rgba(251, 146, 60, 0.4)",
        }}
        transition={{ duration: 0.3 }}
      >
        main v{version}
      </motion.span>

      <motion.div
        className="w-1 h-1 bg-green-400 rounded-full"
        animate={{
          scale: isHovered ? [1, 1.5, 1] : 1,
          opacity: isHovered ? [0.7, 1, 0.7] : 0.7,
        }}
        transition={{
          duration: 1.5,
          repeat: isHovered ? Infinity : 0,
          ease: "easeInOut",
        }}
      />
    </>
  );

  if (isMobile) {
    return (
      <Disclosure.Button
        as="a"
        href={githubLink.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${githubLink.ariaLabel} - Version ${version}`}
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
      aria-label={`${githubLink.ariaLabel} - Version ${version}`}
      {...desktopProps}
    >
      {linkContent}
    </motion.a>
  );
};
