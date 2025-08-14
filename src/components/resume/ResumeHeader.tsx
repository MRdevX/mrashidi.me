"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download } from "lucide-react";
import ResumeRequestModal from "./ResumeRequestModal";
import { ResumeRequestData } from "@/lib/validation/schemas";

export default function ResumeHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleResumeRequest = async (data: ResumeRequestData): Promise<boolean> => {
    try {
      const response = await fetch("/api/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        return true;
      } else {
        const errorData = await response.json();
        console.error("Resume request failed:", errorData);
        return false;
      }
    } catch (error) {
      console.error("Resume request error:", error);
      return false;
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-orange-500" />
          <h1 className="text-3xl sm:text-4xl font-bold text-orange-500 font-cyberpunk glow-text text-center sm:text-left">
            Professional Experience
          </h1>
        </div>
        <motion.button
          onClick={() => {
            console.log("Resume request button clicked");
            setIsModalOpen(true);
          }}
          className="neon-button w-full sm:w-auto flex items-center justify-center space-x-2 rounded-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download className="w-5 h-5" />
          <span>Request CV</span>
        </motion.button>
      </div>

      <ResumeRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleResumeRequest} />
    </>
  );
}
