import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { ContactSection, ADPListWidget as ADPListWidgetType } from "./types";
import { ADPListWidget } from "./ADPListWidget";
import { useThemeConfig } from "@/hooks/useThemeConfig";

interface ReviewsSectionProps {
  section: ContactSection;
  impactWidget: ADPListWidgetType;
  reviewsWidget: ADPListWidgetType;
}

export function ReviewsSection({ section, impactWidget, reviewsWidget }: ReviewsSectionProps) {
  const { getSectionHeader, getSectionTitle, getTextColor } = useThemeConfig();

  return (
    <motion.div
      className="mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: section.delay || 0.5 }}
    >
      <div className={getSectionHeader()}>
        <Star className="w-6 h-6 text-orange-500" />
        <h2 className={getSectionTitle()}>{section.title}</h2>
      </div>
      <p className={`${getTextColor("secondary")} mb-6`}>{section.description}</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ADPListWidget widget={impactWidget} />
        <ADPListWidget widget={reviewsWidget} />
      </div>
    </motion.div>
  );
}
