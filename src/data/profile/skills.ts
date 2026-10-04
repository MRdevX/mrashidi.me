export enum SkillLevel {
  EXPERT = "expert",
  PROFICIENT = "proficient",
  EXPERIENCED = "experienced",
  FAMILIAR = "familiar",
}

export interface Skill {
  name: string;
  level?: SkillLevel;
  includeInMainStack?: boolean;
}

export interface SkillCategory {
  category: string;
  skills: Array<{
    name: string;
    level?: SkillLevel;
    includeInMainStack?: boolean;
  }>;
}

// Tiers follow the CV's skills evidence (mrashidi-cv, skills-evidence.md):
// PROFICIENT = production or central to a CV role, EXPERIENCED = shipped in a live project or older role,
// FAMILIAR = light or off-target use.
const skillCategories: SkillCategory[] = [
  {
    category: "Programming Languages",
    skills: [
      { name: "TypeScript", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "JavaScript", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "Python", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "SQL", level: SkillLevel.PROFICIENT },
      { name: "Go", level: SkillLevel.FAMILIAR },
      { name: "Java", level: SkillLevel.FAMILIAR },
      { name: "Kotlin", level: SkillLevel.FAMILIAR },
      { name: "Dart", level: SkillLevel.FAMILIAR },
    ],
  },
  {
    category: "Frameworks",
    skills: [
      { name: "Node.js", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "NestJS", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "Express", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "Hono", level: SkillLevel.EXPERIENCED },
      { name: "Deno", level: SkillLevel.FAMILIAR },
    ],
  },
  {
    category: "Databases & ORMs",
    skills: [
      { name: "PostgreSQL", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "TypeORM", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "Redis", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "Supabase", level: SkillLevel.EXPERIENCED },
      { name: "Drizzle", level: SkillLevel.EXPERIENCED },
      { name: "MongoDB", level: SkillLevel.FAMILIAR },
    ],
  },
  {
    category: "APIs & Protocols",
    skills: [
      { name: "REST", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "OpenAPI", level: SkillLevel.PROFICIENT },
      { name: "gRPC", level: SkillLevel.EXPERIENCED },
      { name: "WebSockets", level: SkillLevel.EXPERIENCED },
    ],
  },
  {
    category: "Architecture",
    skills: [
      { name: "Microservices", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "Event-Driven Architecture (EDA)", level: SkillLevel.PROFICIENT },
      { name: "Monorepos", level: SkillLevel.PROFICIENT },
      { name: "Multi-tenancy", level: SkillLevel.EXPERIENCED },
      { name: "API Gateway", level: SkillLevel.EXPERIENCED },
      { name: "Serverless", level: SkillLevel.EXPERIENCED },
      { name: "Domain-Driven Design (DDD)", level: SkillLevel.FAMILIAR },
    ],
  },
  {
    category: "Cloud",
    skills: [
      { name: "GCP", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "Azure", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "Cloudflare", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "AWS", level: SkillLevel.FAMILIAR },
    ],
  },
  {
    category: "DevOps & Infrastructure",
    skills: [
      { name: "Kubernetes", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "Docker", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "Helm", level: SkillLevel.PROFICIENT },
      { name: "Terraform", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "GitHub Actions", level: SkillLevel.PROFICIENT },
      { name: "GitLab CI/CD", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "Linux", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "nginx", level: SkillLevel.EXPERIENCED },
      { name: "Linkerd", level: SkillLevel.FAMILIAR },
      { name: "Trivy", level: SkillLevel.FAMILIAR },
    ],
  },
  {
    category: "Messaging",
    skills: [
      { name: "RabbitMQ", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "Bull", level: SkillLevel.PROFICIENT },
      { name: "Azure Service Bus", level: SkillLevel.EXPERIENCED },
    ],
  },
  {
    category: "Monitoring",
    skills: [
      { name: "Sentry", level: SkillLevel.EXPERIENCED },
      { name: "Prometheus", level: SkillLevel.EXPERIENCED },
      { name: "Grafana", level: SkillLevel.EXPERIENCED },
      { name: "Loki", level: SkillLevel.EXPERIENCED },
      { name: "Redash", level: SkillLevel.EXPERIENCED },
      { name: "Cloud Monitoring", level: SkillLevel.FAMILIAR },
    ],
  },
  {
    category: "Testing",
    skills: [
      { name: "Jest", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "Supertest", level: SkillLevel.PROFICIENT },
      { name: "Vitest", level: SkillLevel.EXPERIENCED },
      { name: "pytest", level: SkillLevel.EXPERIENCED },
      { name: "Playwright", level: SkillLevel.EXPERIENCED },
      { name: "Postman", level: SkillLevel.EXPERIENCED },
    ],
  },
  {
    category: "Security",
    skills: [
      { name: "JWT", level: SkillLevel.PROFICIENT },
      { name: "RBAC", level: SkillLevel.PROFICIENT },
      { name: "Envelope Encryption", level: SkillLevel.PROFICIENT },
      { name: "OAuth2/OIDC", level: SkillLevel.EXPERIENCED },
      { name: "mTLS", level: SkillLevel.EXPERIENCED },
      { name: "GDPR", level: SkillLevel.EXPERIENCED },
    ],
  },
  {
    category: "AI",
    skills: [
      { name: "LLM APIs", level: SkillLevel.EXPERIENCED },
      { name: "Workers AI", level: SkillLevel.EXPERIENCED },
      { name: "WhisperX", level: SkillLevel.EXPERIENCED },
    ],
  },
  {
    category: "Frontend",
    skills: [
      { name: "Vue.js", level: SkillLevel.EXPERIENCED },
      { name: "Nuxt", level: SkillLevel.EXPERIENCED },
      { name: "React", level: SkillLevel.EXPERIENCED },
      { name: "Next.js", level: SkillLevel.EXPERIENCED },
      { name: "Vite", level: SkillLevel.EXPERIENCED },
      { name: "Tailwind CSS", level: SkillLevel.EXPERIENCED },
      { name: "shadcn/ui", level: SkillLevel.EXPERIENCED },
      { name: "HTML5", level: SkillLevel.EXPERIENCED },
      { name: "CSS3", level: SkillLevel.EXPERIENCED },
      { name: "Flutter", level: SkillLevel.FAMILIAR },
    ],
  },
  {
    category: "Tools",
    skills: [
      { name: "Git", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "Cursor AI", level: SkillLevel.EXPERIENCED },
      { name: "VS Code", level: SkillLevel.EXPERIENCED },
      { name: "Jira", level: SkillLevel.EXPERIENCED },
      { name: "Confluence", level: SkillLevel.EXPERIENCED },
      { name: "Miro", level: SkillLevel.FAMILIAR },
    ],
  },
];

export default skillCategories;
export { skillCategories };
