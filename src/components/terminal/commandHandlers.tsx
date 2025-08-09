import { ReactElement } from "react";
import { CommandType, AVAILABLE_COMMANDS } from "./types";
import { skillCategories } from "@/components/skills/skillsData";
import personalInfo from "@/data/personalInfo";
import { blogService } from "@/services/blogService";
import { projects } from "@/data/projects";

export const handleCommand = async (command: CommandType): Promise<string | ReactElement> => {
  switch (command) {
    case "help":
      return (
        <div className="mt-2">
          <p className="text-orange-500 font-bold mb-2">Available commands:</p>
          {Object.entries(AVAILABLE_COMMANDS).map(([cmd, desc]) => (
            <div key={cmd} className="grid grid-cols-[120px,1fr] gap-2 mt-1 group">
              <span className="text-green-400 font-bold group-hover:text-green-300 transition-colors">{cmd}</span>
              <span className="text-gray-400 group-hover:text-gray-300 transition-colors">{desc}</span>
            </div>
          ))}
        </div>
      );

    case "about":
      return (
        <div className="mt-2 space-y-2">
          <p>{personalInfo.bio}</p>
        </div>
      );

    case "skills":
      return (
        <pre className="font-mono text-sm text-gray-200 mt-2 whitespace-pre-wrap">
          {skillCategories.map((cat) => {
            const expert = cat.skills.filter((s) => s.level === "expert");
            const proficient = cat.skills.filter((s) => s.level === "proficient");
            const experienced = cat.skills.filter((s) => s.level === "experienced");
            const familiar = cat.skills.filter((s) => s.level === "familiar");
            const noLevel = cat.skills.filter((s) => !s.level);
            return [
              <span key={cat.category + "-cat"} className="text-orange-400">
                {cat.category + "\n"}
              </span>,
              expert.length > 0 && [
                <span key={cat.category + "-exp"} className="text-green-400">
                  {" "}
                  Expert:{" "}
                </span>,
                expert.map((s) => s.name).join(", "),
                "\n",
              ],
              proficient.length > 0 && [
                <span key={cat.category + "-prof"} className="text-green-400">
                  {" "}
                  Proficient:{" "}
                </span>,
                proficient.map((s) => s.name).join(", "),
                "\n",
              ],
              experienced.length > 0 && [
                <span key={cat.category + "-exp"} className="text-green-400">
                  {" "}
                  Experienced:{" "}
                </span>,
                experienced.map((s) => s.name).join(", "),
                "\n",
              ],
              familiar.length > 0 && [
                <span key={cat.category + "-fam"} className="text-green-400">
                  {" "}
                  Familiar:{" "}
                </span>,
                familiar.map((s) => s.name).join(", "),
                "\n",
              ],
              noLevel.length > 0 && [
                <span key={cat.category + "-tools"} className="text-green-400">
                  {" "}
                  Tools:{" "}
                </span>,
                noLevel.map((s) => s.name).join(", "),
                "\n",
              ],
              "----------------------------------------\n",
            ]
              .flat()
              .filter(Boolean);
          })}
        </pre>
      );

    case "projects":
      return (
        <div className="mt-2 space-y-4">
          {projects.map((project, idx) => (
            <div key={project.title + idx}>
              <p className="text-orange-500 font-bold">{project.title}</p>
              <p className="text-gray-400">{project.description}</p>
              <p className="text-green-400 text-sm">Tech: {project.stack.join(", ")}</p>
              <div className="flex gap-2 text-xs mt-1">
                <span
                  className={`px-2 py-0.5 rounded font-semibold ${project.visibility === "public" ? "bg-green-700 text-green-200" : "bg-gray-700 text-gray-300"}`}
                >
                  {project.visibility}
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-semibold ${project.type === "personal" ? "bg-blue-700 text-blue-200" : "bg-orange-700 text-orange-200"}`}
                >
                  {project.type}
                </span>
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-orange-400 underline"
                  >
                    GitHub
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-green-400 underline"
                  >
                    Live
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      );

    case "contact":
      return (
        <div className="mt-2 space-y-2">
          <p className="flex items-center gap-2">
            <span className="text-orange-500">Email:</span>
            <a href="mailto:contact@mrashidi.me" className="text-green-400 hover:underline">
              contact@mrashidi.me
            </a>
          </p>
          <p className="flex items-center gap-2">
            <span className="text-orange-500">GitHub:</span>
            <a
              href="https://github.com/mrdevx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:underline"
            >
              github.com/mrdevx
            </a>
          </p>
          <p className="flex items-center gap-2">
            <span className="text-orange-500">LinkedIn:</span>
            <a
              href="https://linkedin.com/in/deerashidi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:underline"
            >
              linkedin.com/in/deerashidi
            </a>
          </p>
          <p className="flex items-center gap-2">
            <span className="text-orange-500">Location:</span>
            <span className="text-green-400">Berlin, Germany</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="text-orange-500">Languages:</span>
            <span className="text-green-400">English (C1), Persian (Native), German (A2), Turkish (A1)</span>
          </p>
        </div>
      );

    case "experience":
      return (
        <div className="mt-2 space-y-4">
          <div>
            <p className="text-orange-500 font-bold">Senior Backend Engineer & Technical Lead</p>
            <p className="text-green-400">Fakir Technology Consultants GmbH (2022 - 2025)</p>
            <p className="text-gray-400">• Led GCP to Azure migration with zero downtime</p>
            <p className="text-gray-400">• Managed AKS infrastructure for EV charging platform</p>
            <p className="text-gray-400">• Architected monorepo solution using Lerna and NX</p>
            <p className="text-gray-400">• Upgraded core systems and migrated to PostgreSQL Flexible Server</p>
            <p className="text-gray-400">• Optimized cloud infrastructure costs and implemented observability stack</p>
          </div>
          <div>
            <p className="text-orange-500 font-bold">Senior Backend Engineer</p>
            <p className="text-green-400">Fakir Technology Consultants GmbH (2021 - 2022)</p>
            <p className="text-gray-400">• Built eConsultant MVP for CO2 emissions and EV transition</p>
            <p className="text-gray-400">• Developed RESTful APIs using NestJS/TypeScript</p>
            <p className="text-gray-400">• Optimized database performance and API response times</p>
            <p className="text-gray-400">• Refactored billing service into modular components</p>
          </div>
          <div>
            <p className="text-orange-500 font-bold">Senior Backend Engineer</p>
            <p className="text-green-400">Mehrpardaz Co (2020 - 2021)</p>
            <p className="text-gray-400">• Built backend architecture for aviation operations platform</p>
            <p className="text-gray-400">• Developed RESTful APIs for React dashboard and iPadOS app</p>
            <p className="text-gray-400">• Integrated weather forecast APIs and offline sync system</p>
            <p className="text-gray-400">• Designed MongoDB schema for aviation data</p>
          </div>
          <div>
            <p className="text-orange-500 font-bold">Backend Engineer</p>
            <p className="text-green-400">Iran Kish Credit Card Co (2018 - 2019)</p>
            <p className="text-gray-400">• Developed REST backend services using Express.js</p>
            <p className="text-gray-400">• Integrated third-party financial APIs</p>
            <p className="text-gray-400">• Improved security with AES encryption</p>
            <p className="text-gray-400">• Automated data migration with Python</p>
          </div>
        </div>
      );

    case "achievements":
      return (
        <div className="mt-2 space-y-4">
          <div>
            <p className="text-orange-500 font-bold mb-2">Recent Certifications:</p>
            <ul className="space-y-1">
              <li className="text-green-400">• AWS Cloud Technical Essentials (2025)</li>
              <li className="text-green-400">• Introduction to Generative AI by Google Cloud (2025)</li>
              <li className="text-green-400">• Advanced Terraform (2024)</li>
              <li className="text-green-400">• Microservices: Security (2024)</li>
              <li className="text-green-400">• Azure Administration Essential Training (2024)</li>
              <li className="text-green-400">• Building High-Throughput Data Microservices (2024)</li>
            </ul>
          </div>
          <div>
            <p className="text-orange-500 font-bold mb-2">Key Achievements:</p>
            <ul className="space-y-1">
              <li className="text-gray-400">• Led successful GCP to Azure migration with zero downtime</li>
              <li className="text-gray-400">• Optimized cloud infrastructure costs through resource monitoring</li>
              <li className="text-gray-400">• Improved API response times through database optimization</li>
              <li className="text-gray-400">• Implemented comprehensive observability stack</li>
              <li className="text-gray-400">• Developed offline sync system for flight operations</li>
            </ul>
          </div>
        </div>
      );

    case "blog":
      try {
        const response = await blogService.getBlogPosts(1, 5);
        return (
          <div className="mt-2">
            <p className="mb-4">Visit my blog for articles on backend development and cloud architecture:</p>
            <a href="/blog" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
              mrashidi.me/blog
            </a>
            <div className="mt-4 space-y-2">
              <p className="text-orange-500 font-bold">Recent Articles:</p>
              {response.posts.length > 0 ? (
                <ul className="space-y-1">
                  {response.posts.map((post) => (
                    <li key={post.url} className="text-gray-400">
                      •{" "}
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:underline"
                      >
                        {post.title}
                      </a>
                      <span className="text-gray-500 text-xs ml-2">({new Date(post.publishedAt).toLocaleDateString()})</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No recent articles found.</p>
              )}
            </div>
          </div>
        );
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
        return (
          <div className="mt-2">
            <p className="mb-4">Visit my blog for articles on backend development and cloud architecture:</p>
            <a href="/blog" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
              mrashidi.me/blog
            </a>
            <div className="mt-4 space-y-2">
              <p className="text-orange-500 font-bold">Recent Articles:</p>
              <p className="text-red-500">Failed to load recent articles. Please visit the blog page.</p>
            </div>
          </div>
        );
      }

    case "view-source":
      return (
        <div className="mt-2 space-y-2">
          <p>This website is open source! 🎉</p>
          <p className="text-orange-500 font-bold">Repository:</p>
          <a
            href="https://github.com/MRdevX/mrashidi.me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:underline"
          >
            github.com/MRdevX/mrashidi.me
          </a>
          <p className="text-gray-500 text-sm mt-2">Built with Next.js, TypeScript, and Tailwind CSS</p>
          <p className="text-gray-500 text-sm">Features: Interactive terminal, GitHub integration, blog posts</p>
          <p className="text-gray-500 text-xs mt-2">Feel free to explore, contribute, or use as inspiration!</p>
          <p className="text-gray-500 text-xs">— Mahdi Rashidi</p>
        </div>
      );

    default:
      return 'Command not found. Type "help" for available commands.';
  }
};
