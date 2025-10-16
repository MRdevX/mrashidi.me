import { motion } from "framer-motion";

export function ContactSections() {
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
