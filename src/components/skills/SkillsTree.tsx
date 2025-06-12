import { motion } from "framer-motion";
import { useState } from "react";

interface Skill {
  name: string;
  level: number;
  category: string;
  description: string;
  relatedSkills: string[];
}

const skills: Skill[] = [
  {
    name: "Backend Development",
    level: 95,
    category: "Core",
    description: "Extensive experience in building scalable backend systems",
    relatedSkills: ["Node.js", "TypeScript", "Python", "Go"],
  },
  {
    name: "Cloud & DevOps",
    level: 90,
    category: "Infrastructure",
    description: "Expert in cloud architecture and DevOps practices",
    relatedSkills: ["AWS", "Docker", "Kubernetes", "Terraform"],
  },
  {
    name: "Database Design",
    level: 85,
    category: "Data",
    description: "Proficient in designing and optimizing databases",
    relatedSkills: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch"],
  },
  // Add more skills here
];

export default function SkillsTree() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <div className="py-10">
      {categories.map((category, categoryIndex) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: categoryIndex * 0.2 }}
          className="mb-8"
        >
          <h3 className="text-xl font-bold mb-4 glow-text">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills
              .filter((skill) => skill.category === category)
              .map((skill, index) => (
                <motion.div
                  key={skill.name}
                  className={`feature-card ${selectedSkill === skill.name ? "ring-2 ring-orange-500/50" : ""}`}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedSkill(selectedSkill === skill.name ? null : skill.name)}
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">{skill.name}</h4>
                    <div className="relative w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="absolute top-0 left-0 h-full bg-orange-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </div>

                  <motion.div
                    initial={false}
                    animate={{ height: selectedSkill === skill.name ? "auto" : 0 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-4 text-gray-600 dark:text-gray-300">{skill.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {skill.relatedSkills.map((related, i) => (
                        <span key={i} className={`tech-badge ${hoveredSkill === skill.name ? "scale-105" : ""}`}>
                          {related}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
