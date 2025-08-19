import { motion } from "framer-motion";
import Link from "next/link";

export const BrandLogo = () => {
  return (
    <Link href="/" className="flex items-center shrink-0" aria-label="Mahdi Rashidi - Home">
      <motion.span
        className="text-xl font-bold text-orange-500 font-cyberpunk glow-text"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        MR
      </motion.span>
    </Link>
  );
};
