import { ReactElement } from "react";
import { CommandType, AVAILABLE_COMMANDS } from "./types";
import { skillCategories } from "@/components/skills/skillsData";
import personalInfo from "@/data/personalInfo";
import { blogService } from "@/services/blogService";

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
          <p>{personalInfo.summary}</p>
          <p>{personalInfo.description}</p>
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
          <div>
            <p className="text-orange-500 font-bold">E-Mobility Services Platform</p>
            <p className="text-gray-400">Cloud-native platform for EV charging services</p>
            <p className="text-green-400 text-sm">Tech: Azure, Kubernetes, NestJS, TypeScript, PostgreSQL, RabbitMQ</p>
            <p className="text-gray-400 text-sm">• Led GCP to Azure migration with zero downtime</p>
            <p className="text-gray-400 text-sm">• Optimized cloud infrastructure costs</p>
            <p className="text-gray-400 text-sm">• Implemented comprehensive observability stack</p>
          </div>
          <div>
            <p className="text-orange-500 font-bold">Flight Operations Platform</p>
            <p className="text-gray-400">Aviation operations and crew management system</p>
            <p className="text-green-400 text-sm">Tech: Express.js, MongoDB, WebSocket, Redis</p>
            <p className="text-gray-400 text-sm">• Built backend architecture from scratch</p>
            <p className="text-gray-400 text-sm">• Developed offline sync system for flight crews</p>
            <p className="text-gray-400 text-sm">• Integrated weather forecast APIs</p>
          </div>
          <div>
            <p className="text-orange-500 font-bold">Mobile Banking & Payment Gateway</p>
            <p className="text-gray-400">Banking services platform with POS integration</p>
            <p className="text-green-400 text-sm">Tech: Express.js, MongoDB, REST/SOAP APIs</p>
            <p className="text-gray-400 text-sm">• Migrated from Java to Node.js ecosystem</p>
            <p className="text-gray-400 text-sm">• Improved security with AES encryption</p>
            <p className="text-gray-400 text-sm">• Automated data migration with Python</p>
          </div>
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

    default:
      return 'Command not found. Type "help" for available commands.';
  }
};
