export type { SkillCategory } from "@mrashidi/types";

import type { SkillCategory } from "@mrashidi/types";

// Tiers follow the CV's skills evidence (mrashidi-cv, skills-evidence.md):
// PROFICIENT = production or central to a CV role, EXPERIENCED = shipped in a live project or older role,
// FAMILIAR = light or off-target use.
const skillCategories: SkillCategory[] = [
  {
    category: "Programming Languages",
    skills: [
      { name: "TypeScript", level: "proficient", includeInMainStack: true },
      { name: "JavaScript", level: "proficient", includeInMainStack: true },
      { name: "Python", level: "proficient", includeInMainStack: true },
      { name: "SQL", level: "proficient" },
      { name: "Go", level: "familiar" },
      { name: "Java", level: "familiar" },
      { name: "Kotlin", level: "familiar" },
      { name: "Dart", level: "familiar" },
    ],
  },
  {
    category: "Frameworks",
    skills: [
      { name: "Node.js", level: "proficient", includeInMainStack: true },
      { name: "NestJS", level: "proficient", includeInMainStack: true },
      { name: "Express", level: "proficient", includeInMainStack: true },
      { name: "Hono", level: "experienced" },
      { name: "Deno", level: "familiar" },
    ],
  },
  {
    category: "Databases & ORMs",
    skills: [
      { name: "PostgreSQL", level: "proficient", includeInMainStack: true },
      { name: "TypeORM", level: "proficient", includeInMainStack: true },
      { name: "Redis", level: "proficient", includeInMainStack: true },
      { name: "Supabase", level: "experienced" },
      { name: "Drizzle", level: "experienced" },
      { name: "MongoDB", level: "familiar" },
    ],
  },
  {
    category: "APIs & Protocols",
    skills: [
      { name: "REST", level: "proficient", includeInMainStack: true },
      { name: "OpenAPI", level: "proficient" },
      { name: "gRPC", level: "experienced" },
      { name: "WebSockets", level: "experienced" },
    ],
  },
  {
    category: "Architecture",
    skills: [
      { name: "Microservices", level: "proficient", includeInMainStack: true },
      { name: "Event-Driven Architecture (EDA)", level: "proficient" },
      { name: "Monorepos", level: "proficient" },
      { name: "Multi-tenancy", level: "experienced" },
      { name: "API Gateway", level: "experienced" },
      { name: "Serverless", level: "experienced" },
      { name: "Domain-Driven Design (DDD)", level: "familiar" },
    ],
  },
  {
    category: "Cloud",
    skills: [
      { name: "GCP", level: "proficient", includeInMainStack: true },
      { name: "Azure", level: "proficient", includeInMainStack: true },
      { name: "Cloudflare", level: "proficient", includeInMainStack: true },
      { name: "AWS", level: "familiar" },
    ],
  },
  {
    category: "DevOps & Infrastructure",
    skills: [
      { name: "Kubernetes", level: "proficient", includeInMainStack: true },
      { name: "Docker", level: "proficient", includeInMainStack: true },
      { name: "Helm", level: "proficient" },
      { name: "Terraform", level: "proficient", includeInMainStack: true },
      { name: "GitHub Actions", level: "proficient" },
      { name: "GitLab CI/CD", level: "proficient", includeInMainStack: true },
      { name: "Linux", level: "proficient", includeInMainStack: true },
      { name: "nginx", level: "experienced" },
      { name: "Linkerd", level: "familiar" },
      { name: "Trivy", level: "familiar" },
    ],
  },
  {
    category: "Messaging",
    skills: [
      { name: "RabbitMQ", level: "proficient", includeInMainStack: true },
      { name: "Bull", level: "proficient" },
      { name: "Azure Service Bus", level: "experienced" },
    ],
  },
  {
    category: "Monitoring",
    skills: [
      { name: "Sentry", level: "experienced" },
      { name: "Prometheus", level: "experienced" },
      { name: "Grafana", level: "experienced" },
      { name: "Loki", level: "experienced" },
      { name: "Redash", level: "experienced" },
      { name: "Cloud Monitoring", level: "familiar" },
    ],
  },
  {
    category: "Testing",
    skills: [
      { name: "Jest", level: "proficient", includeInMainStack: true },
      { name: "Supertest", level: "proficient" },
      { name: "Vitest", level: "experienced" },
      { name: "pytest", level: "experienced" },
      { name: "Playwright", level: "experienced" },
      { name: "Postman", level: "experienced" },
    ],
  },
  {
    category: "Security",
    skills: [
      { name: "JWT", level: "proficient" },
      { name: "RBAC", level: "proficient" },
      { name: "Envelope Encryption", level: "proficient" },
      { name: "OAuth2/OIDC", level: "experienced" },
      { name: "mTLS", level: "experienced" },
      { name: "GDPR", level: "experienced" },
    ],
  },
  {
    category: "AI",
    skills: [
      { name: "LLM APIs", level: "experienced" },
      { name: "Workers AI", level: "experienced" },
      { name: "WhisperX", level: "experienced" },
    ],
  },
  {
    category: "Frontend",
    skills: [
      { name: "Vue.js", level: "experienced" },
      { name: "Nuxt", level: "experienced" },
      { name: "React", level: "experienced" },
      { name: "Next.js", level: "experienced" },
      { name: "Vite", level: "experienced" },
      { name: "Tailwind CSS", level: "experienced" },
      { name: "shadcn/ui", level: "experienced" },
      { name: "HTML5", level: "experienced" },
      { name: "CSS3", level: "experienced" },
      { name: "Flutter", level: "familiar" },
    ],
  },
  {
    category: "Tools",
    skills: [
      { name: "Git", level: "proficient", includeInMainStack: true },
      { name: "Cursor AI", level: "experienced" },
      { name: "VS Code", level: "experienced" },
      { name: "Jira", level: "experienced" },
      { name: "Confluence", level: "experienced" },
      { name: "Miro", level: "familiar" },
    ],
  },
];

export { skillCategories };
