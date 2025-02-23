"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { githubService } from "@/services/githubService";

interface GitHubRepo {
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
}

export default function Projects() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRepos() {
      try {
        const repositories = await githubService.getTopRepositories();
        setRepos(repositories);
      } catch (error) {
        console.error("Error fetching repositories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, []);

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

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {repos.map((repo) => (
              <motion.div
                key={repo.name}
                className="feature-card group"
                variants={item}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 hover:text-orange-300 transition-colors text-xl font-bold"
                      >
                        {repo.name}
                      </a>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500/60 hover:text-orange-500 transition-colors"
                        title="View on GitHub"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                    </div>
                    <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors">
                      {repo.description || "No description available"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4 items-center">
                    {repo.language && (
                      <span className="tech-badge flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                        {repo.language}
                      </span>
                    )}
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-gray-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {repo.stargazers_count}
                      </span>
                      <span className="flex items-center gap-1 text-gray-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                        </svg>
                        {repo.forks_count}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div className="mt-12" variants={item}>
          <h2 className="text-2xl font-bold mb-6 text-orange-500 font-cyberpunk glow-text">Featured Professional Projects</h2>
          <div className="grid grid-cols-1 gap-6">
            <motion.div className="feature-card group" variants={item} whileHover={{ scale: 1.02 }}>
              <h3 className="text-xl font-bold mb-2 text-orange-500 group-hover:text-orange-400 transition-colors">
                E-Mobility Services Platform
              </h3>
              <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors">
                Cloud-native platform managing 1,500+ European charging stations, featuring real-time monitoring, automated scaling,
                and GDPR-compliant data handling. Achieved 45% cost reduction through infrastructure optimization.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Azure", "Kubernetes", "NestJS", "TypeScript", "PostgreSQL", "Redis"].map((tech) => (
                  <span key={tech} className="tech-badge">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div className="feature-card group" variants={item} whileHover={{ scale: 1.02 }}>
              <h3 className="text-xl font-bold mb-2 text-orange-500 group-hover:text-orange-400 transition-colors">
                Flight Operations Platform
              </h3>
              <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors">
                Real-time aviation operations management system with flight tracking, weather data integration, and pilot
                communication features. Implemented robust authentication and logging systems.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Node.js", "MongoDB", "Redis", "WebSocket", "Docker", "AWS"].map((tech) => (
                  <span key={tech} className="tech-badge">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div className="feature-card group" variants={item} whileHover={{ scale: 1.02 }}>
              <h3 className="text-xl font-bold mb-2 text-orange-500 group-hover:text-orange-400 transition-colors">
                Open Banking System
              </h3>
              <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors">
                Secure banking integration platform with enhanced authentication, rate limiting, and comprehensive error logging.
                Built with a focus on security and reliability.
              </p>
              <div className="flex flex-wrap gap-2">
                {["NestJS", "PostgreSQL", "Redis", "RabbitMQ", "Docker", "Kubernetes"].map((tech) => (
                  <span key={tech} className="tech-badge">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
