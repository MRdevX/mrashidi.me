"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { ContactContainer, ContactHeader, useContactData } from "@/features/contact";
import { fadeInVariants } from "@/lib/animations";

export default function Contact() {
  const { header, sections, adpListWidgets } = useContactData();

  return (
    <ContactContainer>
      <motion.div initial="hidden" animate="visible" variants={fadeInVariants} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-3 mb-8">
          <MessageCircle className="w-8 h-8 text-orange-500" />
          <h1 className="text-4xl font-bold text-orange-500 font-cyberpunk glow-text">{header.title}</h1>
        </div>
      </motion.div>

      <div className="glass-card p-8">
        <ContactHeader
          title={header.title}
          description={header.description}
          sections={sections}
          adpListWidgets={adpListWidgets}
        />
      </div>
    </ContactContainer>
  );
}
