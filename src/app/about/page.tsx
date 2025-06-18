"use client";

import { motion } from "framer-motion";

export default function About() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold mb-8 text-orange-500 font-cyberpunk glow-text">About Me</h1>
        </motion.div>

        <div className="prose dark:prose-invert max-w-none">
          <motion.section className="mb-12" initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.2 }}>
            <p className="text-lg mb-6 leading-relaxed text-gray-300">
              Backend Engineer with 9+ years experience, including 6+ years building scalable TypeScript/Node.js applications
              and cloud‑native solutions. Experienced in microservices architecture, Kubernetes, and multi‑cloud platforms
              including Azure, AWS, and GCP. Focused on delivering reliable enterprise solutions with emphasis on high
              availability and performance optimization.
            </p>
          </motion.section>

          <motion.section className="mb-12" initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.4 }}>
            <h2 className="text-3xl font-bold mb-8 text-orange-500 font-cyberpunk glow-text">Technical Skills</h2>

            {/* Cyberpunk Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  category: "Programming Languages",
                  skills: [
                    { name: "TypeScript", level: "advanced" },
                    { name: "JavaScript (ES6+)", level: "advanced" },
                    { name: "Java", level: "intermediate" },
                    { name: "C#", level: "intermediate" },
                    { name: "Python", level: "intermediate" },
                    { name: "Bash", level: "intermediate" },
                    { name: "Go", level: "familiar" },
                    { name: "Kotlin", level: "familiar" },
                  ],
                },
                {
                  category: "Backend Frameworks",
                  skills: [
                    { name: "NestJS", level: "advanced" },
                    { name: "Node.js", level: "advanced" },
                    { name: "Express.js", level: "advanced" },
                    { name: "Spring Boot", level: "intermediate" },
                    { name: "Fastify", level: "familiar" },
                    { name: "Deno", level: "familiar" },
                    { name: "Fiber", level: "familiar" },
                    { name: "Django", level: "familiar" },
                  ],
                },
                {
                  category: "Architecture Patterns",
                  skills: [
                    { name: "Microservices", level: "advanced" },
                    { name: "Event-Driven Architecture", level: "advanced" },
                    { name: "Monolithic Architecture", level: "intermediate" },
                    { name: "API Gateway Pattern", level: "intermediate" },
                    { name: "Domain-Driven Design", level: "familiar" },
                  ],
                },
                {
                  category: "APIs & Data Protocols",
                  skills: [
                    { name: "RESTful APIs", level: "advanced" },
                    { name: "JSON", level: "advanced" },
                    { name: "XML", level: "advanced" },
                    { name: "gRPC", level: "advanced" },
                    { name: "WebSockets", level: "advanced" },
                    { name: "GraphQL", level: "familiar" },
                    { name: "SOAP", level: "familiar" },
                  ],
                },
                {
                  category: "Cloud Platforms",
                  skills: [
                    { name: "Azure (AKS, Key Vault, Blob, PostgreSQL Flexible Server)", level: "advanced" },
                    { name: "AWS (ECS, S3, RDS)", level: "intermediate" },
                    { name: "GCP", level: "intermediate" },
                  ],
                },
                {
                  category: "DevOps & Infrastructure",
                  skills: [
                    { name: "Kubernetes", level: "advanced" },
                    { name: "Docker", level: "advanced" },
                    { name: "GitLab CI/CD", level: "advanced" },
                    { name: "Terraform", level: "intermediate" },
                    { name: "Helm", level: "intermediate" },
                    { name: "GitHub Actions", level: "intermediate" },
                  ],
                },
                {
                  category: "Monitoring & Observability",
                  skills: [
                    { name: "Sentry", level: "advanced" },
                    { name: "Azure Monitor", level: "advanced" },
                    { name: "Redash", level: "advanced" },
                    { name: "Grafana/Prometheus", level: "advanced" },
                    { name: "K8s Lens", level: "intermediate" },
                  ],
                },
                {
                  category: "Databases, ORMs & Caching",
                  skills: [
                    { name: "PostgreSQL", level: "advanced" },
                    { name: "TypeORM", level: "advanced" },
                    { name: "MongoDB", level: "advanced" },
                    { name: "Mongoose", level: "advanced" },
                    { name: "Redis", level: "advanced" },
                    { name: "Sequelize", level: "familiar" },
                    { name: "Prisma", level: "familiar" },
                    { name: "Drizzle", level: "familiar" },
                  ],
                },
                {
                  category: "Messaging & Streaming",
                  skills: [
                    { name: "RabbitMQ", level: "advanced" },
                    { name: "Redis Pub/Sub", level: "advanced" },
                    { name: "Apache Kafka", level: "intermediate" },
                    { name: "Azure Service Bus", level: "intermediate" },
                    { name: "Azure Event Grid", level: "intermediate" },
                  ],
                },
                {
                  category: "Security Standards",
                  skills: [
                    { name: "JWT", level: "advanced" },
                    { name: "API Security", level: "advanced" },
                    { name: "Zero Trust Architecture", level: "advanced" },
                    { name: "OAuth2/OpenID Connect (OIDC)", level: "advanced" },
                    { name: "OWASP", level: "intermediate" },
                    { name: "The 12-Factor App", level: "intermediate" },
                  ],
                },
                {
                  category: "Testing & Quality Assurance",
                  skills: [
                    { name: "Jest", level: "advanced" },
                    { name: "Postman", level: "advanced" },
                    { name: "Unit/Integration/End-to-End Testing", level: "advanced" },
                    { name: "SonarQube", level: "intermediate" },
                  ],
                },
                {
                  category: "Tools & Platforms",
                  skills: [
                    { name: "Git (GitFlow)", level: "advanced" },
                    { name: "GitLab", level: "advanced" },
                    { name: "VS Code", level: "advanced" },
                    { name: "Cursor AI", level: "advanced" },
                    { name: "WebStorm", level: "advanced" },
                    { name: "Docker Hub", level: "advanced" },
                    { name: "Jira", level: "intermediate" },
                    { name: "Confluence", level: "intermediate" },
                    { name: "Figma", level: "intermediate" },
                    { name: "Miro", level: "intermediate" },
                  ],
                },
                {
                  category: "AI & Machine Learning",
                  skills: [
                    { name: "Google AI Studio", level: "familiar" },
                    { name: "Fine-tuning Models (Gemini-1.5-flash, Ollama)", level: "familiar" },
                    { name: "AI Agents (N8N)", level: "familiar" },
                  ],
                },
              ].map((cat, idx) => (
                <div key={cat.category} className="mb-6">
                  <h3 className="text-xl font-bold mb-3 text-orange-500 font-cyberpunk glow-text">{cat.category}</h3>
                  <ul className="space-y-2">
                    {cat.skills.map((skill) => (
                      <li key={skill.name} className="flex items-center gap-3">
                        <span className="text-gray-300 font-medium">{skill.name}</span>
                        <span
                          className={
                            skill.level === "advanced"
                              ? "px-2 py-0.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500 glow-text"
                              : skill.level === "intermediate"
                                ? "px-2 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500 glow-text"
                                : "px-2 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500 glow-text"
                          }
                        >
                          {skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}
                        </span>
                        <div className="flex-1 ml-2">
                          <div className="w-full bg-gray-800 rounded-full h-1.5">
                            <motion.div
                              className={
                                skill.level === "advanced"
                                  ? "bg-orange-500 h-1.5 rounded-full shadow-orange-500/50 shadow-md"
                                  : skill.level === "intermediate"
                                    ? "bg-blue-500 h-1.5 rounded-full shadow-blue-500/50 shadow-md"
                                    : "bg-purple-500 h-1.5 rounded-full shadow-purple-500/50 shadow-md"
                              }
                              initial={{ width: 0 }}
                              animate={{
                                width: skill.level === "advanced" ? "100%" : skill.level === "intermediate" ? "66%" : "33%",
                              }}
                              transition={{ duration: 0.8, delay: 0.2 + idx * 0.1 }}
                            />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section className="mb-12" initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.8 }}>
            <h2 className="text-3xl font-bold mb-6 text-orange-500 font-cyberpunk glow-text">Languages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { language: "Persian", level: "Native Proficiency", progress: 100 },
                { language: "English", level: "Fluent (C1)", progress: 90 },
                { language: "German", level: "Pre-Intermediate (A2)", progress: 40 },
                { language: "Turkish", level: "Elementary (A1)", progress: 20 },
              ].map((lang, index) => (
                <motion.div
                  key={lang.language}
                  className="feature-card group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-orange-500 group-hover:text-orange-400 transition-colors">
                      {lang.language}
                    </span>
                    <span className="text-gray-400 group-hover:text-gray-300 transition-colors">{lang.level}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2.5">
                    <motion.div
                      className="bg-orange-500 h-2.5 rounded-full"
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
            <h2 className="text-3xl font-bold mb-6 text-orange-500 font-cyberpunk glow-text">Education</h2>
            <div className="feature-card group">
              <h3 className="text-xl font-bold text-orange-500 group-hover:text-orange-400 transition-colors">
                B.Sc. in Computer Software Engineering
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors mt-2">
                Bu-Ali Sina University, Hamedan, Iran
              </p>
              <p className="text-gray-500 mt-1">Sep 2011 – Sep 2015</p>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
