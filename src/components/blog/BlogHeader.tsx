import { motion } from "framer-motion";

export default function BlogHeader() {
  return (
    <motion.h1
      className="text-4xl font-bold mb-8 text-orange-500 font-cyberpunk glow-text"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      Blog Posts
    </motion.h1>
  );
}
