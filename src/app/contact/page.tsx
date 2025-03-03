"use client";

import { motion } from "framer-motion";
import ContactForm from "@/components/ContactForm";

export default function Contact() {
  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-4">
        <motion.h1
          className="text-4xl font-bold mb-8 text-orange-500 font-cyberpunk glow-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Get In Touch
        </motion.h1>

        <motion.p
          className="text-gray-400 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Have a question or want to discuss a potential project? Feel free to reach out using the form below.
          I&apos;ll get back to you as soon as possible.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ContactForm />
        </motion.div>
      </div>
    </div>
  );
} 