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
      { name: "Kotlin", level: "familiar" },
      { name: "Go", level: "familiar" },
      { name: "C#", level: "familiar" },
      { name: "C++", level: "familiar" },
    ],
  },
  {
    category: "Frameworks",
    skills: [
      { name: "Node.js", level: "proficient, ", includeInMainStack: true },
      { name: "NestJS", level: "proficient", includeInMainStack: true },
      { name: "Express", level: "proficient", includeInMainStack: true },
      { name: "Hono", level: "experienced" },
      { name: "Deno", level: "experienced" },
      { name: "Spring Boot", level: "familiar" },
      { name: "Django", level: "familiar" },
    ],
  },
  {
    category: "Databases & ORMs",
    skills: [
      { name: "PostgreSQL", level: "proficient", includeInMainStack: true },
      { name: "TypeORM", level: "proficient", includeInMainStack: true },
      { name: "Redis", level: "proficient", includeInMainStack: true },
      { name: "MongoDB", level: "proficient" },
      { name: "Supabase", level: "experienced" },
      { name: "Drizzle", level: "familiar" },
      { name: "Sequelize", level: "familiar" },
    ],
  },
  {
    category: "APIs & Protocols",
    skills: [
      { name: "REST", level: "proficient", includeInMainStack: true },
      { name: "OpenAPI", level: "proficient" },
      { name: "Swagger", level: "proficient", includeInMainStack: true },
      { name: "API Versioning", level: "proficient", includeInMainStack: true },
      { name: "WebSockets", level: "experienced" },
      { name: "gRPC", level: "experienced" },
      { name: "GraphQL", level: "experienced" },
    ],
  },
  {
    category: "Architecture",
    skills: [
      { name: "Microservices", level: "proficient", includeInMainStack: true },
      { name: "Event-Driven Architecture (EDA)", level: "proficient", includeInMainStack: true },
      { name: "API Gateway", level: "experienced" },
      { name: "Domain-Driven Design (DDD)", level: "experienced" },
      { name: "Serverless", level: "familiar" },
      { name: "Monorepos", level: "experienced" },
    ],
  },
  {
    category: "Cloud",
    skills: [
      { name: "Azure", level: "proficient", includeInMainStack: true },
      { name: "AWS", level: "experienced", includeInMainStack: true },
      { name: "GCP", level: "experienced" },
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
      { name: "Helm", level: "experienced" },
      { name: "GitHub Actions", level: "experienced" },
    ],
  },
  {
    category: "Messaging",
    skills: [
      { name: "RabbitMQ", level: "proficient", includeInMainStack: true },
      { name: "Redis Pub/Sub", level: "proficient" },
      { name: "Azure Service Bus", level: "experienced" },
      { name: "AWS SQS/SNS", level: "familiar" },
      { name: "NATS", level: "familiar" },
    ],
  },
  {
    category: "Monitoring",
    skills: [
      { name: "Prometheus", level: "experienced" },
      { name: "Grafana", level: "experienced" },
      { name: "Loki", level: "experienced" },
      { name: "Sentry", level: "experienced" },
      { name: "Azure Monitor", level: "familiar" },
      { name: "CloudWatch", level: "familiar" },
      { name: "NewRelic", level: "familiar" },
    ],
  },
  {
    category: "Testing",
    skills: [
      { name: "Jest", level: "proficient", includeInMainStack: true },
      { name: "Supertest", level: "experienced" },
      { name: "Vitest", level: "experienced" },
      { name: "Postman", level: "experienced" },
      { name: "End-to-End Testing", level: "experienced" },
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
    category: "AI",
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
