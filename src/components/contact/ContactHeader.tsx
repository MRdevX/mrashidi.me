import { motion } from "framer-motion";

interface ContactHeaderProps {
  title: string;
  description: string;
}

export default function ContactHeader({ title, description }: ContactHeaderProps) {
  return (
    <>
      <motion.h1
        className="text-4xl font-bold mb-8 text-orange-500 font-cyberpunk glow-text"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {title}
      </motion.h1>

      <motion.p
        className="text-gray-400 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {description}
      </motion.p>
    </>
  );
}
