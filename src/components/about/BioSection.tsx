import { motion } from "framer-motion";
import personalInfo from "@/data/personalInfo";
import ProfileImage from "./ProfileImage";
import { fadeInVariants } from "@/lib/animations";

export default function BioSection() {
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
        <p className="text-lg leading-relaxed text-gray-300 font-albert text-justify">{personalInfo.bio}</p>
      </div>
    </motion.section>
  );
}
