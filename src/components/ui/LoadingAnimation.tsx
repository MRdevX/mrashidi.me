import { motion } from "framer-motion";

interface LoadingAnimationProps {
  size?: "small" | "medium" | "large";
  color?: "orange" | "green" | "blue" | "white";
  text?: string;
  fullScreen?: boolean;
}

const LoadingAnimation = ({
  size = "medium",
  color = "orange",
  text = "Loading...",
  fullScreen = false,
}: LoadingAnimationProps) => {
  // Define size values
  const sizeValues = {
    small: {
      container: "w-4 h-4",
      dot: "w-1 h-1",
    },
    medium: {
      container: "w-8 h-8",
      dot: "w-2 h-2",
    },
    large: {
      container: "w-12 h-12",
      dot: "w-3 h-3",
    },
  };

  // Define color values
  const colorValues = {
    orange: "bg-orange-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    white: "bg-white",
  };

  // Animation variants for dots
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const dotVariants = {
    initial: {
      y: "0%",
    },
    animate: {
      y: ["0%", "-100%", "0%"],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullScreen ? "fixed inset-0 bg-black/80 backdrop-blur-sm z-50" : ""
      }`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <motion.div
        className={`flex items-center justify-center gap-2 ${sizeValues[size].container}`}
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`${sizeValues[size].dot} ${colorValues[color]} rounded-full`}
            variants={dotVariants}
            animate="animate"
            initial="initial"
            custom={i}
          />
        ))}
      </motion.div>
      {text && (
        <div className="mt-3 text-center">
          <span className={`text-${color === 'white' ? 'gray-200' : color}-500 text-sm`}>
            {text}
          </span>
        </div>
      )}
      <div className="sr-only">Loading content, please wait</div>
    </div>
  );
};

export default LoadingAnimation; 