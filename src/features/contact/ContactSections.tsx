import { motion } from "framer-motion";
import type { ContactSection } from "./types";

interface ContactSectionsProps {
  sections: ContactSection[];
}

export function ContactSections({ sections }: ContactSectionsProps) {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      {/* No widgets - clean contact page */}
    </motion.div>
  );
}
