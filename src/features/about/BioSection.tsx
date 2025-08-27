import { motion } from "framer-motion";
import { personalInfo } from "@/data";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { fadeInVariants } from "@/lib/animations";
import { ProfileImage } from "./ProfileImage";

export function BioSection() {
  const { getTextColor } = useThemeConfig();

  return (
    <motion.section
      className="mb-12"
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      transition={{ delay: 0.2 }}
    >
      <div className="relative">
        <ProfileImage src="/profile.jpeg" alt="Mahdi Rashidi" />
        <p className={`text-lg leading-relaxed ${getTextColor("secondary")} font-albert text-justify`}>
          {personalInfo.bio}
        </p>
      </div>
    </motion.section>
  );
}
