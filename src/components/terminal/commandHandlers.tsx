import { ReactElement } from "react";
import { CommandType, AVAILABLE_COMMANDS } from "./types";

export const handleCommand = (command: CommandType): string | ReactElement => {
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
          <p>👋 Hi! I&apos;m Mahdi Rashidi, a Backend Engineer with 9+ years of experience.</p>
          <p>
            I specialize in building scalable TypeScript/Node.js applications and cloud-native solutions. My expertise
            includes microservices architecture, Kubernetes, and multi-cloud platforms (Azure, AWS, GCP).
          </p>
          <p>
            Based in Berlin, Germany, I focus on delivering reliable enterprise solutions with emphasis on high availability
            and performance optimization.
          </p>
        </div>
      );

    case "skills":
      return (
        <div className="mt-2 space-y-4">
          <div>
            <p className="text-orange-500 font-bold mb-2">Programming Languages:</p>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-green-400">• TypeScript (Advanced)</span>
              <span className="text-green-400">• JavaScript/ES6+ (Advanced)</span>
              <span className="text-green-400">• Java (Intermediate)</span>
              <span className="text-green-400">• Python (Intermediate)</span>
              <span className="text-green-400">• C# (Intermediate)</span>
              <span className="text-green-400">• Bash (Intermediate)</span>
              <span className="text-green-400">• Go (Familiar)</span>
              <span className="text-green-400">• Kotlin (Familiar)</span>
            </div>
          </div>
          <div>
            <p className="text-orange-500 font-bold mb-2">Backend Frameworks:</p>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-green-400">• NestJS (Advanced)</span>
              <span className="text-green-400">• Node.js (Advanced)</span>
              <span className="text-green-400">• Express.js (Advanced)</span>
              <span className="text-green-400">• Spring Boot (Intermediate)</span>
              <span className="text-green-400">• Fastify (Intermediate)</span>
              <span className="text-green-400">• Deno (Familiar)</span>
              <span className="text-green-400">• Fiber (Familiar)</span>
            </div>
          </div>
          <div>
            <p className="text-orange-500 font-bold mb-2">Cloud & DevOps:</p>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-green-400">• Azure (Advanced)</span>
              <span className="text-green-400">• Kubernetes (Advanced)</span>
              <span className="text-green-400">• Docker (Advanced)</span>
              <span className="text-green-400">• GitLab CI/CD (Advanced)</span>
              <span className="text-green-400">• GitHub Actions (Advanced)</span>
              <span className="text-green-400">• AWS (Intermediate)</span>
              <span className="text-green-400">• GCP (Intermediate)</span>
              <span className="text-green-400">• Terraform (Intermediate)</span>
              <span className="text-green-400">• Helm (Intermediate)</span>
            </div>
          </div>
          <div>
            <p className="text-orange-500 font-bold mb-2">Databases & Data:</p>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-green-400">• PostgreSQL (Advanced)</span>
              <span className="text-green-400">• TypeORM (Advanced)</span>
              <span className="text-green-400">• MongoDB (Advanced)</span>
              <span className="text-green-400">• Mongoose (Advanced)</span>
              <span className="text-green-400">• Redis (Advanced)</span>
              <span className="text-green-400">• Sequelize (Familiar)</span>
              <span className="text-green-400">• Prisma (Familiar)</span>
              <span className="text-green-400">• Drizzle (Familiar)</span>
              <span className="text-green-400">• MikroORM (Familiar)</span>
            </div>
          </div>
          <div>
            <p className="text-orange-500 font-bold mb-2">Architecture & Protocols:</p>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-green-400">• Microservices</span>
              <span className="text-green-400">• Event-Driven Architecture</span>
              <span className="text-green-400">• RESTful APIs</span>
              <span className="text-green-400">• gRPC</span>
              <span className="text-green-400">• WebSockets</span>
              <span className="text-green-400">• GraphQL (Familiar)</span>
            </div>
          </div>
        </div>
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
              linkedin.com/in/mrdevx
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
      return (
        <div className="mt-2">
          <p className="mb-4">Visit my blog for articles on backend development and cloud architecture:</p>
          <a href="/blog" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
            mrashidi.me/blog
          </a>
          <div className="mt-4 space-y-2">
            <p className="text-orange-500 font-bold">Recent Articles:</p>
            <ul className="space-y-1">
              <li className="text-gray-400">• Building Scalable Microservices with NestJS</li>
              <li className="text-gray-400">• Optimizing Cloud Costs in Kubernetes</li>
              <li className="text-gray-400">• Real-time Data Processing with WebSockets</li>
              <li className="text-gray-400">• Security Best Practices for Node.js Applications</li>
            </ul>
          </div>
        </div>
      );

    default:
      return 'Command not found. Type "help" for available commands.';
  }
};
