import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { fadeInVariants } from "@/lib/animations";
import { useThemeConfig } from "@/hooks/useThemeConfig";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  className?: string;
}

export function PageHeader({ icon: Icon, title, className = "" }: PageHeaderProps) {
  const { getSectionTitle } = useThemeConfig();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <div className="page-header">
        <Icon className="page-header-icon" />
        <h1 className={`text-3xl sm:text-4xl font-bold ${getSectionTitle()} text-center sm:text-left`}>{title}</h1>
      </div>
    </motion.div>
  );
}
