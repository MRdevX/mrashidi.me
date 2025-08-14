import { motion } from "framer-motion";
import { ContactSection, ADPListWidget as ADPListWidgetType } from "./types";
import ADPListWidget from "./ADPListWidget";

interface MentorshipSectionProps {
  section: ContactSection;
  widget: ADPListWidgetType;
}

export default function MentorshipSection({ section, widget }: MentorshipSectionProps) {
  return (
    <motion.div
      className="mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: section.delay || 0.4 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-orange-500 font-cyberpunk glow-text">{section.title}</h2>
      <p className="text-gray-400 mb-6">{section.description}</p>
      <ADPListWidget widget={widget} />
    </motion.div>
  );
}
