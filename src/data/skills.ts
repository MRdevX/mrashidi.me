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
      { name: "Java", level: "experienced", includeInMainStack: true },
      { name: "C#", level: "experienced" },
      { name: "Python", level: "experienced", includeInMainStack: true },
      { name: "C++", level: "experienced" },
      { name: "Kotlin", level: "familiar" },
      { name: "Go", level: "familiar" },
    ],
  },
  {
    category: "Backend Frameworks",
    skills: [
      { name: "Node.js", level: "proficient", includeInMainStack: true },
      { name: "NestJS", level: "proficient", includeInMainStack: true },
      { name: "Express", level: "proficient", includeInMainStack: true },
      { name: "Spring Boot", level: "experienced" },
      { name: "Java EE", level: "experienced" },
      { name: "Django", level: "familiar" },
      { name: "Flask", level: "familiar" },
    ],
  },
  {
    category: "APIs & Protocols",
    skills: [
      { name: "REST", level: "proficient", includeInMainStack: true },
      { name: "gRPC", level: "proficient", includeInMainStack: true },
      { name: "OpenAPI", level: "proficient" },
      { name: "Swagger", level: "proficient", includeInMainStack: true },
      { name: "API Versioning", level: "proficient" },
      { name: "WebSockets", level: "experienced" },
      { name: "GraphQL", level: "familiar" },
    ],
  },
  {
    category: "System Architecture",
    skills: [
      { name: "Microservices", includeInMainStack: true },
      { name: "Event-Driven Architecture", includeInMainStack: true },
      { name: "API Gateway" },
      { name: "Domain-Driven Design" },
      { name: "Serverless" },
      { name: "Monorepos" },
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
      { name: "Helm", level: "experienced" },
      { name: "GitHub Actions", level: "experienced" },
    ],
  },
  {
    category: "Databases & ORMs",
    skills: [
      { name: "PostgreSQL", level: "proficient" },
      { name: "TypeORM", level: "proficient", includeInMainStack: true },
      { name: "Redis", level: "proficient", includeInMainStack: true },
      { name: "MongoDB", level: "proficient", includeInMainStack: true },
      { name: "Mongoose", level: "proficient", includeInMainStack: true },
      { name: "MySQL", level: "experienced" },
      { name: "MSSQL", level: "experienced" },
      { name: "JPA", level: "familiar" },
    ],
  },
  {
    category: "Messaging Systems",
    skills: [
      { name: "RabbitMQ", level: "proficient", includeInMainStack: true },
      { name: "Redis Pub/Sub", level: "proficient", includeInMainStack: true },
      { name: "MQTT", level: "proficient" },
      { name: "Azure Service Bus", level: "experienced" },
      { name: "AMQP", level: "experienced" },
      { name: "AWS SQS", level: "familiar" },
      { name: "AWS SNS", level: "familiar" },
      { name: "Apache Kafka", level: "familiar" },
    ],
  },
  {
    category: "Observability",
    skills: [
      { name: "Azure Monitor", level: "proficient" },
      { name: "Sentry", level: "proficient", includeInMainStack: true },
      { name: "Prometheus", level: "experienced", includeInMainStack: true },
      { name: "Grafana", level: "experienced", includeInMainStack: true },
      { name: "Fresh Ping", level: "experienced" },
      { name: "CloudWatch", level: "familiar" },
    ],
  },
  {
    category: "Quality Assurance",
    skills: [
      { name: "Jest", level: "proficient", includeInMainStack: true },
      { name: "Unit Testing", level: "proficient" },
      { name: "Integration Testing", level: "proficient" },
      { name: "Postman", level: "experienced", includeInMainStack: true },
      { name: "End-to-End Testing", level: "experienced" },
      { name: "Supertest", level: "experienced" },
    ],
  },
  {
    category: "Security",
    skills: [
      { name: "OAuth2" },
      { name: "JWT", includeInMainStack: true },
      { name: "API Security" },
      { name: "RBAC" },
      { name: "SSL/TLS" },
      { name: "Zero Trust" },
    ],
  },
  {
    category: "AI Development",
    skills: [
      { name: "LLM APIs", level: "experienced" },
      { name: "Gemini", level: "experienced" },
      { name: "OpenAI", level: "experienced" },
      { name: "Fine-tuning", level: "familiar" },
    ],
  },
  {
    category: "Frontend Skills",
    skills: [
      { name: "React", level: "familiar" },
      { name: "Next.js", level: "familiar" },
      { name: "HTML5", level: "familiar" },
      { name: "CSS3", level: "familiar" },
    ],
  },
  {
    category: "Tools",
    skills: [
      { name: "Git", includeInMainStack: true },
      { name: "Linux Distros" },
      { name: "Cursor AI" },
      { name: "VS Code" },
      { name: "K8s Lens" },
      { name: "Jira" },
      { name: "Confluence" },
      { name: "Miro" },
    ],
  },
];

export default skillCategories;
export { skillCategories };
