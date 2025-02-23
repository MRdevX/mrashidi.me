"use client";

import { motion } from "framer-motion";

export default function About() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            About Me
          </h1>
        </motion.div>

        <div className="prose dark:prose-invert max-w-none">
          <motion.section className="mb-12" initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.2 }}>
            <p className="text-lg mb-6 leading-relaxed text-gray-700 dark:text-gray-300">
              Software Engineer with 9+ years of experience in scalable Backend Development, with a primary focus on Node.js
              and TypeScript for the past 5+ years. Specialized in cloud native applications, microservices architecture, and
              DevOps practices. Proven expertise in optimizing cloud infrastructure, improving system reliability, and
              delivering high-impact solutions.
            </p>
          </motion.section>

          <motion.section className="mb-12" initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.4 }}>
            <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Technical Expertise</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Backend Development",
                  skills: "Node.js, TypeScript, NestJS, Express.js, RESTful APIs",
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Cloud & DevOps",
                  skills: "Azure, Kubernetes, Docker, GitLab CI/CD, AWS, GCP, Terraform",
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Architecture",
                  skills: "Microservices, Event-Driven Architecture, Domain-Driven Design (DDD)",
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Databases",
                  skills: "PostgreSQL, MongoDB, Redis, TypeORM, Mongoose, Prisma",
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                      />
                    </svg>
                  ),
                },
              ].map((skill, index) => (
                <motion.div
                  key={skill.title}
                  className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-indigo-500 dark:text-indigo-400 mb-4">{skill.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">{skill.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{skill.skills}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section className="mb-12" initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.8 }}>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Languages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { language: "Persian", level: "Native Proficiency", progress: 100 },
                { language: "English", level: "Fluent (C1)", progress: 90 },
                { language: "German", level: "Pre-Intermediate (A2)", progress: 40 },
                { language: "Turkish", level: "Elementary (A1)", progress: 20 },
              ].map((lang, index) => (
                <motion.div
                  key={lang.language}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-800 dark:text-white">{lang.language}</span>
                    <span className="text-gray-600 dark:text-gray-400">{lang.level}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <motion.div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${lang.progress}%` }}
                      transition={{ duration: 1, delay: 1.2 + index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 1.2 }}>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Education</h2>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">B.Sc. in Computer Software Engineering</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Bu-Ali Sina University, Hamedan, Iran</p>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Sep 2011 – Sep 2015</p>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
