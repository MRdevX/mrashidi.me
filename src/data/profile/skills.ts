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

const skillCategories: SkillCategory[] = [
  {
    category: "Programming Languages",
    skills: [
      { name: "TypeScript", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "JavaScript", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "Java", level: SkillLevel.EXPERIENCED },
      { name: "Python", level: SkillLevel.EXPERIENCED },
      { name: "Kotlin", level: SkillLevel.FAMILIAR },
      { name: "Go", level: SkillLevel.FAMILIAR },
      { name: "C#", level: SkillLevel.FAMILIAR },
      { name: "C++", level: SkillLevel.FAMILIAR },
    ],
  },
  {
    category: "Frameworks",
    skills: [
      { name: "Node.js", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "NestJS", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "Express", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "Hono", level: SkillLevel.EXPERIENCED },
      { name: "Deno", level: SkillLevel.EXPERIENCED },
      { name: "Spring Boot", level: SkillLevel.FAMILIAR },
      { name: "Django", level: SkillLevel.FAMILIAR },
    ],
  },
  {
    category: "Databases & ORMs",
    skills: [
      { name: "PostgreSQL", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "TypeORM", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "Redis", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "MongoDB", level: SkillLevel.PROFICIENT },
      { name: "Supabase", level: SkillLevel.EXPERIENCED },
      { name: "Drizzle", level: SkillLevel.FAMILIAR },
      { name: "Sequelize", level: SkillLevel.FAMILIAR },
    ],
  },
  {
    category: "APIs & Protocols",
    skills: [
      { name: "REST", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "OpenAPI", level: SkillLevel.PROFICIENT },
      { name: "Swagger", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "API Versioning", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "WebSockets", level: SkillLevel.EXPERIENCED },
      { name: "gRPC", level: SkillLevel.EXPERIENCED },
      { name: "GraphQL", level: SkillLevel.EXPERIENCED },
    ],
  },
  {
    category: "Architecture",
    skills: [
      { name: "Microservices", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "Event-Driven Architecture (EDA)", level: SkillLevel.PROFICIENT },
      { name: "API Gateway", level: SkillLevel.EXPERIENCED },
      { name: "Domain-Driven Design (DDD)", level: SkillLevel.EXPERIENCED },
      { name: "Serverless", level: SkillLevel.FAMILIAR },
      { name: "Monorepos", level: SkillLevel.EXPERIENCED },
    ],
  },
  {
    category: "Cloud",
    skills: [
      { name: "Azure", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "AWS", level: SkillLevel.EXPERIENCED, includeInMainStack: true },
      { name: "GCP", level: SkillLevel.EXPERIENCED },
      { name: "Cloudflare", level: SkillLevel.EXPERIENCED },
    ],
  },
  {
    category: "DevOps & Infrastructure",
    skills: [
      { name: "Kubernetes", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "Docker", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "GitLab CI/CD", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "Linux", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "Terraform", level: SkillLevel.EXPERIENCED, includeInMainStack: true },
      { name: "Helm", level: SkillLevel.EXPERIENCED },
      { name: "GitHub Actions", level: SkillLevel.EXPERIENCED },
    ],
  },
  {
    category: "Messaging",
    skills: [
      { name: "RabbitMQ", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "Redis Pub/Sub", level: SkillLevel.PROFICIENT },
      { name: "Azure Service Bus", level: SkillLevel.EXPERIENCED },
      { name: "AWS SQS/SNS", level: SkillLevel.FAMILIAR },
      { name: "NATS", level: SkillLevel.FAMILIAR },
    ],
  },
  {
    category: "Monitoring",
    skills: [
      { name: "Prometheus", level: SkillLevel.EXPERIENCED },
      { name: "Grafana", level: SkillLevel.EXPERIENCED },
      { name: "Loki", level: SkillLevel.EXPERIENCED },
      { name: "Sentry", level: SkillLevel.EXPERIENCED },
      { name: "Azure Monitor", level: SkillLevel.FAMILIAR },
      { name: "CloudWatch", level: SkillLevel.FAMILIAR },
      { name: "NewRelic", level: SkillLevel.FAMILIAR },
    ],
  },
  {
    category: "Testing",
    skills: [
      { name: "Jest", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "Supertest", level: SkillLevel.EXPERIENCED },
      { name: "Vitest", level: SkillLevel.EXPERIENCED },
      { name: "Postman", level: SkillLevel.EXPERIENCED },
      { name: "End-to-End Testing", level: SkillLevel.EXPERIENCED },
    ],
  },
  {
    category: "Security",
    skills: [
      { name: "OAuth2/OIDC", level: SkillLevel.EXPERIENCED },
      { name: "JWT", level: SkillLevel.EXPERIENCED },
      { name: "RBAC", level: SkillLevel.EXPERIENCED },
      { name: "API Security", level: SkillLevel.EXPERIENCED },
      { name: "SSL/TLS", level: SkillLevel.EXPERIENCED },
    ],
  },
  {
    category: "AI",
    skills: [
      { name: "LLM APIs", level: SkillLevel.EXPERIENCED },
      { name: "AI Chat-Bots", level: SkillLevel.EXPERIENCED },
      { name: "RAG", level: SkillLevel.FAMILIAR },
      { name: "Langfuse", level: SkillLevel.FAMILIAR },
    ],
  },
  {
    category: "Frontend",
    skills: [
      { name: "React", level: SkillLevel.EXPERIENCED },
      { name: "Next.js", level: SkillLevel.EXPERIENCED },
      { name: "Tailwind CSS", level: SkillLevel.EXPERIENCED },
      { name: "ShadCN", level: SkillLevel.EXPERIENCED },
      { name: "HTML5", level: SkillLevel.PROFICIENT },
      { name: "CSS3", level: SkillLevel.PROFICIENT },
    ],
  },
  {
    category: "Tools",
    skills: [
      { name: "Git", level: SkillLevel.PROFICIENT, includeInMainStack: true },
      { name: "Linux", level: SkillLevel.PROFICIENT, includeInMainStack: true },
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
