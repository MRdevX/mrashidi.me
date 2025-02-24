"use client";

import { motion } from "framer-motion";

export default function Resume() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const workExperience = [
    {
      title: "Software Architect Technical Lead",
      company: "Fakir Technology Consultants GmbH (inno2fleet E-Mobility Services)",
      location: "Berlin, Germany (Remote)",
      period: "Mar 2022 – Jan 2025",
      achievements: [
        "Developed and maintained multiple backend microservices within the Inno2Fleet platform using NestJS and Typescript",
        "Designed and implemented Azure cloud infrastructure (AKS) for inno2fleet services",
        "Scaled system to support 1,500+ European charging stations, processing 20,000+ monthly charging sessions",
        "Led GDPR-compliant cloud migration from GCP to Azure, ensuring data protection compliance",
        "Optimized microservices architecture for 8 core systems, including Fleetbook and Tendergy",
        "Improved deployment efficiency and scalability for enterprise-level performance",
        "Reduced cloud costs by 45% (€5,000 → €2,720/month) through automated scaling and resource optimization",
        "Implemented Kubernetes with GitOps workflows on AKS, achieving 35% faster API response times",
        "Streamlined CI/CD pipelines using GitLab and Terraform, reaching 99% deployment success rate"
      ]
    },
    {
      title: "Senior Backend Engineer",
      company: "Fakir Technology Consultants GmbH (inno2fleet E-Mobility Services)",
      location: "Berlin, Germany (Remote)",
      period: "Mar 2021 – Jan 2025",
      achievements: [
        "Built fleet eConsultant analysis platform using NestJS/TypeScript",
        "Delivered real-time decision-making tools for clients",
        "Improved system reliability 30% by transitioning message queue system from Redis to RabbitMQ",
        "Enhanced code quality through test automation with Jest framework",
        "Increased test coverage up to 65% across core services"
      ]
    },
    {
      title: "Lead Backend Engineer",
      company: "Mehrpardaz (Flight Operations Platform)",
      location: "Tehran, Iran (Remote)",
      period: "May 2020 – Apr 2021",
      achievements: [
        "Developed backend system for aviation iPadOS app enabling real-time flight operations",
        "Created modular architecture patterns for authentication, logging, and error handling",
        "Integrated flight tracking and weather data services including OpenWeatherMap API",
        "Established engineering best practices including code reviews and CI/CD workflows",
        "Mentored and onboarded new backend engineers to improve team productivity"
      ]
    },
    {
      title: "Backend Developer",
      company: "Finnotech (Open Banking Platform)",
      location: "Tehran, Iran (Hybrid)",
      period: "Feb 2020 – May 2020",
      achievements: [
        "Refactored authentication service for banking systems with enhanced security measures",
        "Implemented rate limiting and error logging for improved system reliability"
      ]
    },
    {
      title: "Backend Developer",
      company: "Iran Kish Credit Card Co (KICCC)",
      location: "Tehran, Iran (On-Site)",
      period: "Dec 2018 – Dec 2019",
      achievements: [
        "Modernized legacy systems by introducing Node.js stack for mobile banking APIs",
        "Developed Express.js/MongoDB REST APIs with 15% performance improvement over legacy systems"
      ]
    },
    {
      title: "Backend Developer",
      company: "Jahesh (ImenFood Startup)",
      location: "Tehran, Iran (Hybrid)",
      period: "Sep 2018 – Nov 2018",
      achievements: [
        "Created restaurant safety evaluation system using Python/Django",
        "Sole backend developer responsible for API design and implementation"
      ]
    },
    {
      title: "Junior Software Developer",
      company: "Baharan Sarv Gostar (Learning Management System)",
      location: "Tehran, Iran (On-Site)",
      period: "Oct 2015 – Sep 2018",
      achievements: [
        "Built C#/.NET modules for student enrollment and grading systems",
        "Developed Android companion app for course management and student engagement",
        "Improved system stability by implementing comprehensive error handling"
      ]
    }
  ];

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-900 to-black">
      <motion.div className="max-w-4xl mx-auto px-4" initial="hidden" animate="show" variants={container}>
        <div className="flex justify-between items-center mb-12">
          <motion.h1 className="text-4xl font-bold text-orange-500 font-cyberpunk glow-text" variants={item}>
            Professional Experience
          </motion.h1>
          <motion.a
            href="/cv/Mahdi_Rashidi_CV.pdf"
            className="px-6 py-3 glass-card text-orange-500 rounded-lg hover:text-orange-400 hover:border-orange-500/40 transition-all duration-300 flex items-center space-x-2"
            target="_blank"
            variants={item}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>Download CV</span>
          </motion.a>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <motion.section className="mb-16" variants={item}>
            <h2 className="text-3xl font-bold mb-8 text-orange-500 font-cyberpunk glow-text">Work Experience</h2>

            <div className="space-y-12">
              {workExperience.map((job, index) => (
                <motion.div
                  key={`${job.company}-${job.title}`}
                  className="feature-card group"
                  variants={item}
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-orange-500 group-hover:text-orange-400 transition-colors mb-2">
                        {job.title}
                      </h3>
                      <p className="text-lg text-orange-500/80 group-hover:text-orange-400/80 mb-1">{job.company}</p>
                      <p className="text-gray-400 group-hover:text-gray-300">{job.location}</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className="inline-block px-4 py-2 glass-card text-orange-500 rounded-full">{job.period}</span>
                    </div>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {job.achievements.map((achievement, i) => (
                      <motion.li
                        key={i}
                        className="flex items-start"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                      >
                        <svg
                          className="w-6 h-6 text-orange-500 mr-2 flex-shrink-0 mt-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-gray-300 group-hover:text-gray-200 transition-colors">{achievement}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section className="mb-16" variants={item}>
            <h2 className="text-3xl font-bold mb-8 text-orange-500 font-cyberpunk glow-text">Recent Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div className="feature-card group" whileHover={{ scale: 1.02 }}>
                <h3 className="text-xl font-semibold mb-4 text-orange-500 group-hover:text-orange-400 transition-colors">
                  Cloud & DevOps
                </h3>
                <ul className="space-y-3">
                  {[
                    "Introduction to Generative AI by Google Cloud (2024)",
                    "Advanced Terraform (2024)",
                    "Microservices: Security (2024)",
                    "Azure Administration Essential Training (2024)",
                  ].map((cert, i) => (
                    <motion.li
                      key={i}
                      className="flex items-center text-gray-300 group-hover:text-gray-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                    >
                      <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {cert}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div className="feature-card group" whileHover={{ scale: 1.02 }}>
                <h3 className="text-xl font-semibold mb-4 text-orange-500 group-hover:text-orange-400 transition-colors">
                  Backend Development
                </h3>
                <ul className="space-y-3">
                  {[
                    "Building High-Throughput Data Microservices (2024)",
                    "Object-Oriented Programming in JavaScript",
                    "REST APIs with Flask and Python",
                  ].map((cert, i) => (
                    <motion.li
                      key={i}
                      className="flex items-center text-gray-300 group-hover:text-gray-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                    >
                      <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {cert}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
}
