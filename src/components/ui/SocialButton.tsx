import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";
import { CyberpunkButton } from "./CyberpunkButton";

interface SocialButtonProps {
  href: string;
  icon: LucideIcon | IconType;
  children: React.ReactNode;
  isExternal?: boolean;
  className?: string;
}

export function SocialButton({ href, icon: Icon, children, isExternal = true, className = "" }: SocialButtonProps) {
  const linkProps = isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <a href={href} className={`block ${className}`} {...linkProps}>
        <CyberpunkButton variant="neon" icon={<Icon className="w-4 h-4" />} className="w-full sm:w-auto">
          {children}
        </CyberpunkButton>
      </a>
    </motion.div>
  );
}
