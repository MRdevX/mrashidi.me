export type SkillLevel = "expert" | "proficient" | "experienced" | "familiar";

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
      { name: "TypeScript", level: "proficient", includeInMainStack: true },
      { name: "JavaScript", level: "proficient", includeInMainStack: true },
      { name: "Java", level: "experienced" },
      { name: "Python", level: "experienced" },
      { name: "Go", level: "familiar" },
    ],
  },
  {
    category: "Backend Frameworks",
    skills: [
      { name: "Node.js", level: "proficient", includeInMainStack: true },
      { name: "NestJS", level: "proficient", includeInMainStack: true },
      { name: "Express", level: "proficient", includeInMainStack: true },
      { name: "Hono", level: "experienced" },
      { name: "Deno", level: "familiar" },
      { name: "Spring Boot", level: "familiar" },
      { name: "Django", level: "familiar" },
    ],
  },
  {
    category: "APIs & Protocols",
    skills: [
      { name: "REST", level: "proficient", includeInMainStack: true },
      { name: "OpenAPI", level: "proficient", includeInMainStack: true },
      { name: "Swagger", level: "proficient" },
      { name: "API Versioning", level: "proficient", includeInMainStack: true },
      { name: "WebSockets", level: "experienced" },
      { name: "GraphQL", level: "familiar" },
      { name: "gRPC", level: "familiar" },
    ],
  },
  {
    category: "System Architecture",
    skills: [
      { name: "Microservices", level: "proficient", includeInMainStack: true },
      { name: "Event-Driven Architecture", level: "proficient", includeInMainStack: true },
      { name: "Domain-Driven Design", level: "experienced" },
      { name: "Monorepos", level: "experienced" },
      { name: "Serverless", level: "familiar" },
    ],
  },
  {
    category: "Cloud Platforms",
    skills: [
      { name: "Azure", level: "proficient", includeInMainStack: true },
      { name: "AWS", level: "experienced", includeInMainStack: true },
      { name: "GCP", level: "familiar" },
      { name: "Cloudflare", level: "experienced" },
    ],
  },
  {
    category: "DevOps & Infrastructure",
    skills: [
      { name: "Kubernetes", level: "proficient", includeInMainStack: true },
      { name: "Docker", level: "proficient", includeInMainStack: true },
      { name: "GitLab CI/CD", level: "proficient", includeInMainStack: true },
      { name: "Linux", level: "proficient", includeInMainStack: true },
      { name: "Terraform", level: "experienced", includeInMainStack: true },
      { name: "Helm", level: "experienced", includeInMainStack: true },
      { name: "GitHub Actions", level: "experienced" },
    ],
  },
  {
    category: "Databases & ORMs",
    skills: [
      { name: "PostgreSQL", level: "proficient", includeInMainStack: true },
      { name: "TypeORM", level: "proficient", includeInMainStack: true },
      { name: "Redis", level: "proficient", includeInMainStack: true },
      { name: "MongoDB", level: "experienced" },
      { name: "Supabase", level: "experienced" },
      { name: "Mongoose", level: "familiar" },
      { name: "Drizzle", level: "familiar" },
      { name: "Sequelize", level: "familiar" },
    ],
  },
  {
    category: "Messaging Systems",
    skills: [
      { name: "RabbitMQ", level: "proficient", includeInMainStack: true },
      { name: "Azure Service Bus", level: "experienced" },
      { name: "NATS", level: "familiar" },
    ],
  },
  {
    category: "Observability",
    skills: [
      { name: "Prometheus", level: "experienced" },
      { name: "Grafana", level: "experienced" },
      { name: "Loki", level: "experienced" },
      { name: "Sentry", level: "experienced" },
      { name: "Azure Monitor", level: "familiar" },
      { name: "CloudWatch", level: "familiar" },
    ],
  },
  {
    category: "Quality Assurance",
    skills: [
      { name: "Jest", level: "proficient", includeInMainStack: true },
      { name: "Unit Testing", level: "proficient" },
      { name: "Integration Testing", level: "proficient" },
      { name: "Supertest", level: "experienced" },
      { name: "Postman", level: "experienced" },
      { name: "End-to-End Testing", level: "experienced" },
      { name: "Vitest", level: "familiar" },
    ],
  },
  {
    category: "Security",
    skills: [
      { name: "OAuth2/OIDC", level: "experienced" },
      { name: "JWT", level: "experienced" },
      { name: "RBAC", level: "experienced" },
      { name: "API Security", level: "experienced" },
      { name: "SSL/TLS", level: "experienced" },
    ],
  },
  {
    category: "AI Development",
    skills: [
      { name: "LLM APIs", level: "experienced" },
      { name: "AI Chat-Bots", level: "experienced" },
      { name: "RAG", level: "familiar" },
      { name: "Langfuse", level: "familiar" },
    ],
  },
  {
    category: "Frontend",
    skills: [
      { name: "React", level: "experienced" },
      { name: "Next.js", level: "experienced" },
      { name: "Tailwind CSS", level: "experienced" },
      { name: "ShadCN", level: "experienced" },
      { name: "HTML5", level: "proficient" },
      { name: "CSS3", level: "proficient" },
    ],
  },
  {
    category: "Tools",
    skills: [
      { name: "Git", level: "proficient", includeInMainStack: true },
      { name: "Linux", level: "proficient", includeInMainStack: true },
      { name: "Cursor AI", level: "experienced" },
      { name: "VS Code", level: "experienced" },
      { name: "Jira", level: "experienced" },
      { name: "Confluence", level: "experienced" },
      { name: "Miro", level: "familiar" },
    ],
  },
];

export default skillCategories;
export { skillCategories };
