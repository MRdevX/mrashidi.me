"use client";

import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import ProjectCard from "@/components/projects/ProjectCard";

export default function Projects() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const professionalProjects = projects.filter((p) => p.type === "client");
  const personalProjects = projects.filter((p) => p.type === "personal");

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-900 to-black">
      <motion.div className="max-w-4xl mx-auto px-4" initial="hidden" animate="show" variants={container}>
        <motion.h1 className="text-4xl font-bold mb-8 text-orange-500 font-cyberpunk glow-text" variants={item}>
          Projects
        </motion.h1>

        {/* Professional Projects Section */}
        {professionalProjects.length > 0 && (
          <motion.div className="mb-12" variants={item}>
            <h2 className="text-2xl font-bold mb-6 text-orange-500 font-cyberpunk glow-text">Professional Projects</h2>
            <div className="grid grid-cols-1 gap-6">
              {professionalProjects.map((project, idx) => (
                <ProjectCard key={project.title + idx} project={project} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Personal Projects Section */}
        {personalProjects.length > 0 && (
          <motion.div className="mb-12" variants={item}>
            <h2 className="text-2xl font-bold mb-6 text-orange-500 font-cyberpunk glow-text">Personal Projects</h2>
            <div className="grid grid-cols-1 gap-6">
              {personalProjects.map((project, idx) => (
                <ProjectCard key={project.title + idx} project={project} />
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
