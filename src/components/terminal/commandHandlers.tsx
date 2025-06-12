import { ReactElement } from 'react';
import { CommandType, AVAILABLE_COMMANDS } from './types';

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
          <p>👋 Hi! I&apos;m Mahdi Rashidi, a Senior Backend Engineer with 9+ years of experience.</p>
          <p>
            I specialize in building scalable backend systems, cloud architecture, and DevOps practices. Currently
            working with Node.js, TypeScript, and various cloud technologies.
          </p>
          <p>
            Based in Berlin, Germany, I focus on developing cloud-native applications and optimizing infrastructure
            for performance and cost efficiency.
          </p>
        </div>
      );

    case "skills":
      return (
        <div className="mt-2 space-y-4">
          <div>
            <p className="text-orange-500 font-bold mb-2">Core Technologies:</p>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-green-400">• Node.js</span>
              <span className="text-green-400">• TypeScript</span>
              <span className="text-green-400">• NestJS</span>
              <span className="text-green-400">• Express.js</span>
            </div>
          </div>
          <div>
            <p className="text-orange-500 font-bold mb-2">Cloud & DevOps:</p>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-green-400">• Azure</span>
              <span className="text-green-400">• Kubernetes</span>
              <span className="text-green-400">• Docker</span>
              <span className="text-green-400">• Terraform</span>
            </div>
          </div>
          <div>
            <p className="text-orange-500 font-bold mb-2">Databases & Messaging:</p>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-green-400">• PostgreSQL</span>
              <span className="text-green-400">• MongoDB</span>
              <span className="text-green-400">• Redis</span>
              <span className="text-green-400">• RabbitMQ</span>
            </div>
          </div>
        </div>
      );

    case "projects":
      return (
        <div className="mt-2 space-y-4">
          <div>
            <p className="text-orange-500 font-bold">E-Mobility Services Platform</p>
            <p className="text-gray-400">Cloud-native platform managing 1,500+ European charging stations</p>
            <p className="text-green-400 text-sm">Tech: Azure, Kubernetes, NestJS, TypeScript</p>
          </div>
          <div>
            <p className="text-orange-500 font-bold">Flight Operations Platform</p>
            <p className="text-gray-400">Real-time aviation operations management system</p>
            <p className="text-green-400 text-sm">Tech: Node.js, MongoDB, Redis, WebSocket</p>
          </div>
          <div>
            <p className="text-orange-500 font-bold">Open Banking System</p>
            <p className="text-gray-400">Secure banking integration platform with enhanced authentication</p>
            <p className="text-green-400 text-sm">Tech: NestJS, PostgreSQL, Redis, RabbitMQ</p>
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
            <a href="https://github.com/mrdevx" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
              github.com/mrdevx
            </a>
          </p>
          <p className="flex items-center gap-2">
            <span className="text-orange-500">LinkedIn:</span>
            <a href="https://linkedin.com/in/deerashidi" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
              linkedin.com/in/mrdevx
            </a>
          </p>
          <p className="flex items-center gap-2">
            <span className="text-orange-500">Location:</span>
            <span className="text-green-400">Berlin, Germany</span>
          </p>
        </div>
      );

    case "experience":
      return (
        <div className="mt-2 space-y-4">
          <div>
            <p className="text-orange-500 font-bold">Software Architect Technical Lead</p>
            <p className="text-green-400">Fakir Technology Consultants GmbH (2022 - 2025)</p>
            <p className="text-gray-400">Led development of microservices platform, reduced cloud costs by 45%</p>
          </div>
          <div>
            <p className="text-orange-500 font-bold">Senior Backend Engineer</p>
            <p className="text-green-400">Fakir Technology Consultants GmbH (2021 - 2025)</p>
            <p className="text-gray-400">Built fleet analysis platform, improved system reliability by 30%</p>
          </div>
          <div>
            <p className="text-orange-500 font-bold">Lead Backend Engineer</p>
            <p className="text-green-400">Mehrpardaz (2020 - 2021)</p>
            <p className="text-gray-400">Developed aviation operations platform and established engineering practices</p>
          </div>
        </div>
      );

    case "view-source":
      return (
        <div className="mt-2">
          <p>View the source code of this website on GitHub:</p>
          <a
            href="https://github.com/mrdevx/mrashidi.me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:underline"
          >
            github.com/mrdevx/mrashidi.me
          </a>
        </div>
      );

    case "achievements":
      return (
        <div className="mt-2 space-y-4">
          <div>
            <p className="text-orange-500 font-bold mb-2">Recent Certifications:</p>
            <ul className="space-y-1">
              <li className="text-green-400">• Introduction to Generative AI by Google Cloud (2024)</li>
              <li className="text-green-400">• Advanced Terraform (2024)</li>
              <li className="text-green-400">• Microservices: Security (2024)</li>
              <li className="text-green-400">• Azure Administration Essential Training (2024)</li>
            </ul>
          </div>
          <div>
            <p className="text-orange-500 font-bold mb-2">Key Achievements:</p>
            <ul className="space-y-1">
              <li className="text-gray-400">• Reduced cloud costs by 45% through infrastructure optimization</li>
              <li className="text-gray-400">• Scaled system to support 1,500+ European charging stations</li>
              <li className="text-gray-400">• Improved API response times by 35% using Kubernetes</li>
            </ul>
          </div>
        </div>
      );

    case "blog":
      return (
        <div className="mt-2">
          <p className="mb-4">Visit my blog for articles on backend development and cloud architecture:</p>
          <a
            href="/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:underline"
          >
            mrashidi.me/blog
          </a>
        </div>
      );

    case "system-info":
      return (
        <div className="mt-2 space-y-2">
          <p className="text-orange-500 font-bold">System Information:</p>
          <p><span className="text-green-400">OS:</span> <span className="text-gray-400">macOS 14.3.1</span></p>
          <p><span className="text-green-400">Browser:</span> <span className="text-gray-400">Chrome 122.0.6261.69</span></p>
          <p><span className="text-green-400">Resolution:</span> <span className="text-gray-400">1920x1080</span></p>
          <p><span className="text-green-400">Timezone:</span> <span className="text-gray-400">Europe/Berlin</span></p>
        </div>
      );

    default:
      return 'Command not found. Type "help" for available commands.';
  }
}; 