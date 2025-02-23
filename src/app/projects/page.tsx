"use client";

import { motion } from "framer-motion";

const projects = [
  {
    title: "Distributed Cache System",
    description: "A high-performance distributed caching system built with Go",
    tech: ["Go", "Redis", "gRPC", "Docker"],
    link: "#",
  },
  {
    title: "API Gateway",
    description: "A scalable API gateway with rate limiting and auth middleware",
    tech: ["TypeScript", "Node.js", "Redis", "PostgreSQL"],
    link: "#",
  },
  {
    title: "Data Pipeline Framework",
    description: "ETL framework for processing large-scale data streams",
    tech: ["Python", "Apache Kafka", "Elasticsearch"],
    link: "#",
  },
  {
    title: "Microservices Platform",
    description: "Cloud-native microservices infrastructure with service mesh",
    tech: ["Go", "Kubernetes", "Istio", "AWS"],
    link: "#",
  },
];

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

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-900 to-black">
      <motion.div className="max-w-4xl mx-auto px-4" initial="hidden" animate="show" variants={container}>
        <motion.h1 className="text-4xl font-bold mb-8 text-orange-500 font-cyberpunk glow-text" variants={item}>
          Featured Projects
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <motion.div key={project.title} className="feature-card group" variants={item} whileHover={{ scale: 1.02 }}>
              <h2 className="text-xl font-bold mb-2 text-orange-500 group-hover:text-orange-400 transition-colors">
                {project.title}
              </h2>
              <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span key={tech} className="tech-badge">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <a
                  href={project.link}
                  className="text-orange-500 hover:text-orange-400 transition-colors flex items-center gap-1"
                >
                  View Project
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
