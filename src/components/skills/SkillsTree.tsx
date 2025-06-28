import { motion } from "framer-motion";
import { useState } from "react";
import { skillCategories, type SkillLevel } from "@/data/skills";

const getLevelColor = (level: SkillLevel) => {
  switch (level) {
    case "expert":
      return "bg-green-500";
    case "proficient":
      return "bg-blue-500";
    case "experienced":
      return "bg-orange-500";
    case "familiar":
      return "bg-gray-500";
    default:
      return "bg-gray-400";
  }
};

const getLevelWidth = (level: SkillLevel) => {
  switch (level) {
    case "expert":
      return 95;
    case "proficient":
      return 80;
    case "experienced":
      return 65;
    case "familiar":
      return 45;
    default:
      return 30;
  }
};

const getLevelLabel = (level: SkillLevel) => {
  switch (level) {
    case "expert":
      return "Expert";
    case "proficient":
      return "Proficient";
    case "experienced":
      return "Experienced";
    case "familiar":
      return "Familiar";
    default:
      return "Basic";
  }
};

export default function SkillsTree() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  return (
    <div className="py-10">
      {skillCategories.map((category, categoryIndex) => (
        <motion.div
          key={category.category}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: categoryIndex * 0.1 }}
          className="mb-8"
        >
          <motion.h3
            className="text-xl font-bold mb-4 glow-text cursor-pointer"
            onClick={() => setSelectedCategory(selectedCategory === category.category ? null : category.category)}
            whileHover={{ scale: 1.02 }}
          >
            {category.category}
          </motion.h3>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-hidden"
            initial={false}
            animate={{
              height: selectedCategory === category.category ? "auto" : 0,
              opacity: selectedCategory === category.category ? 1 : 0,
            }}
          >
            {category.skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                className={`feature-card ${hoveredSkill === skill.name ? "ring-2 ring-orange-500/50" : ""}`}
                whileHover={{ scale: 1.02 }}
                onMouseEnter={() => setHoveredSkill(skill.name)}
                onMouseLeave={() => setHoveredSkill(null)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-sm">{skill.name}</h4>
                  {skill.level && (
                    <span className={`text-xs px-2 py-1 rounded-full text-white ${getLevelColor(skill.level)}`}>
                      {getLevelLabel(skill.level)}
                    </span>
                  )}
                </div>

                {skill.level && (
                  <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                    <motion.div
                      className={`absolute top-0 left-0 h-full ${getLevelColor(skill.level)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${getLevelWidth(skill.level)}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
