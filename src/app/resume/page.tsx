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
      title: "Senior Backend Engineer & Technical Lead",
      company: "Fakir Technology Consultants GmbH (Client: SE (inno2fleet E-Mobility Services))",
      location: "Berlin, Germany (Full-Time, Remote)",
      period: "Mar 2022 – Jan 2025",
      achievements: [
        "Aligned with Head of Product to translate business needs into technical specs and development roadmaps",
        "Led GCP to Azure migration, ensuring GDPR compliance and zero downtime across 3 major products",
        "Managed Azure Kubernetes Service (AKS) infrastructure supporting EV charging platform with high availability and scalability requirements",
        "Architected monorepo solution using Lerna and NX, developing reusable generic libraries deployed across multiple microservices",
        "Upgraded core systems: NestJS major versions and PostgreSQL Flexible Server migration",
        "Migrated messaging infrastructure from Redis Pub/Sub to RabbitMQ for enhanced monitoring capabilities and system stability",
        "Optimized cloud infrastructure costs through resource monitoring and implementing comprehensive observability stack",
        "Deployed monitoring solutions including Grafana, Prometheus, and Redash via Helm Charts for improved system visibility",
        "Enhanced CI/CD pipeline efficiency in GitLab, integrating automated testing and improving deployment reliability across core microservices",
        "Mentored and onboarded backend developers to accelerate team productivity and knowledge transfer",
        "Conducted technical interviews for team expansion and candidate evaluation",
        "Created comprehensive documentation for infrastructure architecture and incident management processes",
        "Managed technical debt resolution by upgrading outdated libraries and improving code maintainability across the entire codebase",
      ],
    },
    {
      title: "Senior Backend Engineer",
      company: "Fakir Technology Consultants GmbH (Client: SE (inno2fleet E-Mobility Services))",
      location: "Berlin, Germany (Full-Time, Remote)",
      period: "Mar 2021 – Feb 2022",
      achievements: [
        "Built eConsultant MVP from ground up, to calculate CO2 emissions and EV transition investment for European fleets",
        "Developed RESTful APIs using NestJS/TypeScript to support consultation, installation, and charging services for enterprise clients",
        "Integrated Postman and Jest tests into GitLab CI/CD, improving coverage across key services",
        "Optimized database performance through PostgreSQL query optimization, reducing API response times for high-traffic consultation endpoints",
        "Refactored billing service into modular components, enabling parallel development and improving system maintainability",
        "Documented technical architecture and processes to streamline team workflows and facilitate knowledge transfer across development team",
      ],
    },
    {
      title: "Senior Backend Engineer",
      company: "Mehrpardaz Co (EN-Route Flight Operations Platform)",
      location: "Tehran, Iran (Full-Time, Remote)",
      period: "Jan 2020 – Feb 2021",
      achievements: [
        "Built backend architecture from scratch using Express.js and JavaScript for aviation operations and crew management",
        "Designed and implemented RESTful APIs serving a React dashboard and iPadOS app for flight crew",
        "Integrated weather forecast APIs to deliver flight-specific meteorological data",
        "Developed features for weight/luggage management, crew scheduling, and document handling",
        "Architected offline sync system to provide flight crews with latest data before takeoff",
        "Onboarded and mentored 2 junior developers, creating onboarding docs and dev guidelines",
        "Established agile workflows using Jira and Mattermost for project and team management",
        "Designed MongoDB schema tailored to aviation data (crew schedules, flight plans, docs)",
        "Collaborated with frontend and iOS teams to ensure smooth API integration and UX",
        "Created technical documentation for backend services, APIs, and overall architecture",
      ],
    },
    {
      title: "Backend Engineer",
      company: "Iran Kish Credit Card Co (Mobile Banking, POS & Payment Gateway Services)",
      location: "Tehran, Iran (Full-Time, On-Site)",
      period: "Oct 2018 – Dec 2019",
      achievements: [
        "Developed REST backend services using Express.js, JavaScript, and MongoDB, migrating from Java to Node.js ecosystem",
        "Integrated third-party RESTful and SOAP financial APIs to expand banking features",
        "Improved security by migrating from legacy 3DES to modern AES encryption standards",
        "Automated data migration via Python scripts converting legacy data to JSON format",
      ],
    },
    {
      title: "Software Developer",
      company: "Baharan Sarv Gostar (Learning Management System)",
      location: "Tehran, Iran (Full-Time, On-Site)",
      period: "Oct 2015 – Sep 2018",
      achievements: [
        "Participated in migrating legacy ASP.NET WebForms LMS to Java Spring framework",
        "Maintained and debugged ASP.NET WebForms/MVC applications, resolving user issues and implementing feature enhancements",
        "Assisted with VMware ESXi server administration including VM deployment and monitoring",
      ],
    },
  ];

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-900 to-black">
      <motion.div className="max-w-4xl mx-auto px-4" initial="hidden" animate="show" variants={container}>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12">
          <motion.h1
            className="text-3xl sm:text-4xl font-bold text-orange-500 font-cyberpunk glow-text text-center sm:text-left"
            variants={item}
          >
            Professional Experience
          </motion.h1>
          <motion.a
            href="/cv/Mahdi_Rashidi_CV.pdf"
            className="neon-button w-full sm:w-auto flex items-center justify-center space-x-2 rounded-lg"
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
                      <span className="inline-block px-4 py-2 glass-card text-orange-500 rounded-lg">{job.period}</span>
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
