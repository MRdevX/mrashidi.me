"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface ContactHeaderProps {
  title: string;
  description: string;
}

export function ContactHeader({ title, description }: ContactHeaderProps) {
  return (
    <>
      <motion.div className="flex items-center gap-3 mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <MessageCircle className="w-8 h-8 text-orange-500" />
        <h1 className="text-4xl font-bold text-orange-500 font-cyberpunk glow-text">{title}</h1>
      </motion.div>

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
