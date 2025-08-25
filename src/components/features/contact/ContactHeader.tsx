"use client";

import { motion } from "framer-motion";
import { MessageCircle, Users, Star } from "lucide-react";
import { ADPListWidget } from "./ADPListWidget";
import { ContactSection, ADPListWidget as ADPListWidgetType } from "./types";
import { ContactFormRefactored as ContactForm } from "@/components/forms/ContactForm";

interface ContactHeaderProps {
  title: string;
  description: string;
  sections?: ContactSection[];
  adpListWidgets?: {
    booking: ADPListWidgetType;
    impact: ADPListWidgetType;
    reviews: ADPListWidgetType;
  };
}

export function ContactHeader({ title, description, sections, adpListWidgets }: ContactHeaderProps) {
  return (
    <div className="space-y-12">
      {/* Main Header */}
      <motion.div className="flex items-center gap-3 mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <MessageCircle className="w-8 h-8 text-orange-500" />
        <h1 className="text-4xl font-bold text-orange-500 font-cyberpunk glow-text">{title}</h1>
      </motion.div>

      <motion.p
        className="text-gray-600 dark:text-gray-400 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {description}
      </motion.p>

      {/* Contact Form Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <ContactForm />
      </motion.div>

      {/* ADPList Widgets Section */}
      {adpListWidgets && sections && (
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Mentorship Widget */}
          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-orange-500 font-cyberpunk glow-text">
                {sections[0]?.title || "Book a Session"}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {sections[0]?.description || "Schedule a mentorship session with me"}
            </p>
            <ADPListWidget widget={adpListWidgets.booking} className="w-full" />
          </div>

          {/* Reviews Widgets */}
          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-orange-500 font-cyberpunk glow-text">
                {sections[1]?.title || "Reviews & Impact"}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {sections[1]?.description || "See what others say about our sessions"}
            </p>
            <div className="grid grid-cols-5 gap-6">
              <div className="col-span-3">
                <ADPListWidget widget={adpListWidgets.reviews} className="w-full" />
              </div>
              <div className="col-span-2">
                <ADPListWidget widget={adpListWidgets.impact} className="w-full" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
