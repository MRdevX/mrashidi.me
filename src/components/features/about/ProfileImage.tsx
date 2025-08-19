import { motion } from "framer-motion";
import Image from "next/image";
import { slideInRightVariants } from "@/lib/animations";

interface ProfileImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export function ProfileImage({ src, alt, width = 256, height = 256 }: ProfileImageProps) {
  return (
    <motion.div
      className="float-right ml-8 mb-6 lg:ml-12 lg:mb-8"
      variants={slideInRightVariants}
      transition={{ delay: 0.4 }}
    >
      <div className="relative group">
        <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-lg overflow-hidden border-4 border-orange-500/30 shadow-2xl relative bg-gray-800 glitch-image">
          <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 to-transparent z-10"></div>
          <Image src={src} alt={alt} width={width} height={height} className="w-full h-full object-cover" priority />
          <div className="absolute inset-0 glitch-overlay pointer-events-none"></div>
        </div>
        <div className="absolute -inset-2 bg-linear-to-r from-orange-500/50 to-purple-500/50 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
      </div>
    </motion.div>
  );
}
