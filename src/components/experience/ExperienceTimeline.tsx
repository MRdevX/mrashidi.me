import { motion } from "framer-motion";
import { useState } from "react";

interface Experience {
  company: string;
  role: string;
  period: string;
  description: string[];
  technologies: string[];
}

const experiences: Experience[] = [
  {
    company: "Current Company",
    role: "Senior Backend Engineer",
    period: "2021 - Present",
    description: [
      "Led development of high-performance microservices",
      "Implemented CI/CD pipelines and DevOps practices",
      "Mentored junior developers and conducted code reviews",
    ],
    technologies: ["Node.js", "TypeScript", "Docker", "Kubernetes", "AWS"],
  },
];

export default function ExperienceTimeline() {
  const [selectedExp, setSelectedExp] = useState<number | null>(null);

  return (
    <div className="relative py-10">
      <div className="absolute left-1/2 h-full w-0.5 bg-gradient-to-b from-orange-500/20 to-transparent"></div>

      {experiences.map((exp, index) => (
        <motion.div
          key={index}
          className={`relative ${index % 2 === 0 ? "mr-auto pr-8" : "ml-auto pl-8"} w-1/2 mb-8`}
          initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div
            className={`feature-card cursor-pointer ${selectedExp === index ? "ring-2 ring-orange-500/50" : ""}`}
            onClick={() => setSelectedExp(selectedExp === index ? null : index)}
          >
            <h3 className="text-xl font-bold glow-text">{exp.company}</h3>
            <p className="text-orange-500 font-medium mt-1">{exp.role}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{exp.period}</p>

            <motion.div initial={false} animate={{ height: selectedExp === index ? "auto" : 0 }} className="overflow-hidden">
              <ul className="mt-4 space-y-2">
                {exp.description.map((desc, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-2">
                {exp.technologies.map((tech, i) => (
                  <span key={i} className="tech-badge">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          <div
            className={`absolute top-1/2 ${
              index % 2 === 0 ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2"
            } -translate-y-1/2 w-4 h-4 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50`}
          >
            <div className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-20"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
