"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { githubService } from "@/services/githubService";
import ContributionGraph from "@/components/ContributionGraph";
import Terminal from "@/components/Terminal";

interface GitHubRepo {
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
}

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);

    async function fetchGitHubData() {
      try {
        const [reposData, contributionsData] = await Promise.all([
          githubService.getTopRepositories(),
          githubService.getContributions(),
        ]);
        setRepos(reposData);
        setContributions(contributionsData);
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubData();
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

  const techStack = [
    { name: "Node.js", color: "bg-green-500" },
    { name: "TypeScript", color: "bg-blue-500" },
    { name: "NestJS", color: "bg-red-500" },
    { name: "Azure", color: "bg-blue-600" },
    { name: "Kubernetes", color: "bg-blue-400" },
    { name: "Docker", color: "bg-blue-700" },
    { name: "PostgreSQL", color: "bg-indigo-500" },
    { name: "MongoDB", color: "bg-green-600" },
    { name: "Redis", color: "bg-red-600" },
    { name: "RabbitMQ", color: "bg-orange-500" },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-900 to-black">
      <motion.div className="max-w-4xl mx-auto px-4" initial="hidden" animate="show" variants={container}>
        <motion.div className="text-center mb-12 glass-card p-8 relative overflow-hidden" variants={item}>
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent opacity-50" />
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-300 font-cyberpunk glow-text relative z-10">
            Mahdi Rashidi
          </h1>
          <p className="text-2xl text-gray-300 mb-3 font-terminal relative z-10">Senior Backend Engineer & Cloud Architect</p>
          <p className="text-lg text-gray-400 mb-6 relative z-10 max-w-2xl mx-auto">
            Experienced in building scalable cloud-native applications and microservices architectures. 
            Passionate about DevOps practices and optimizing cloud infrastructure for performance and cost efficiency.
          </p>
          <p className="text-lg text-gray-400 mb-8 relative z-10 flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Istanbul, Turkey
          </p>

          <div className="flex justify-center space-x-4 relative z-10">
            <motion.a
              href="mailto:m8rashidi@gmail.com"
              className="neon-button text-sm px-4 py-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Email
            </motion.a>
            <motion.a
              href="https://github.com/mrdevx"
              target="_blank"
              rel="noopener noreferrer"
              className="neon-button text-sm px-4 py-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4 inline-block mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/mrdevx"
              target="_blank"
              rel="noopener noreferrer"
              className="neon-button text-sm px-4 py-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4 inline-block mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              LinkedIn
            </motion.a>
          </div>
          
          <div className="scanline absolute inset-0 pointer-events-none" />
        </motion.div>

        {/* Interactive Terminal */}
        <motion.section className="mb-16" variants={item}>
          <h2 className="text-2xl font-bold mb-6 text-orange-500 font-cyberpunk glow-text">Interactive Terminal</h2>
          <Terminal />
        </motion.section>

        {/* Tech Stack Section */}
        <motion.div className="mb-16" variants={item}>
          <h2 className="text-2xl font-bold mb-6 text-center text-orange-500 font-cyberpunk glow-text">Tech Stack</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                className="tech-badge"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
              >
                {tech.name}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* GitHub Section */}
        <motion.div className="mb-16" variants={item}>
          <h2 className="text-2xl font-bold mb-6 text-center text-orange-500 font-cyberpunk glow-text">GitHub Activity</h2>

          {loading ? (
            <div className="flex justify-center">
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Contribution Graph */}
              <motion.div className="glass-card p-6 mb-8" variants={item}>
                <h3 className="text-lg font-semibold text-orange-500 mb-4">Contribution Activity</h3>
                <ContributionGraph data={contributions} />
              </motion.div>

              {/* Top Repositories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {repos.map((repo) => (
                  <motion.a
                    key={repo.name}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card p-6 hover:border-orange-500/40 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="text-lg font-semibold text-orange-500 mb-2">{repo.name}</h3>
                    <p className="text-gray-300 text-sm mb-4">{repo.description}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      {repo.language && (
                        <span className="flex items-center text-gray-400">
                          <span className="w-3 h-3 rounded-full bg-green-400 mr-2"></span>
                          {repo.language}
                        </span>
                      )}
                      <span className="flex items-center text-gray-400">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {repo.stargazers_count}
                      </span>
                      <span className="flex items-center text-gray-400">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                        </svg>
                        {repo.forks_count}
                      </span>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          )}
        </motion.div>

      </motion.div>
    </div>
  );
}
