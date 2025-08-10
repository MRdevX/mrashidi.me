import { motion } from "framer-motion";

export default function ResumeHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-orange-500 font-cyberpunk glow-text text-center sm:text-left">
        Professional Experience
      </h1>
      <motion.a
        href="/cv/Mahdi_Rashidi_CV.pdf"
        className="neon-button w-full sm:w-auto flex items-center justify-center space-x-2 rounded-lg"
        target="_blank"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        <span>Download CV</span>
      </motion.a>
    </div>
  );
}
