import { motion } from "framer-motion";
import { ContactSection, ADPListWidget as ADPListWidgetType } from "./types";
import ADPListWidget from "./ADPListWidget";

interface ReviewsSectionProps {
  section: ContactSection;
  impactWidget: ADPListWidgetType;
  reviewsWidget: ADPListWidgetType;
}

export default function ReviewsSection({ section, impactWidget, reviewsWidget }: ReviewsSectionProps) {
  return (
    <motion.div
      className="mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: section.delay || 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-orange-500 font-cyberpunk glow-text">{section.title}</h2>
      <p className="text-gray-400 mb-6">{section.description}</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ADPListWidget widget={impactWidget} />
        <ADPListWidget widget={reviewsWidget} />
      </div>
    </motion.div>
  );
}
