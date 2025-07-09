export type SkillLevel = "expert" | "proficient" | "experienced" | "familiar";

export interface Skill {
  name: string;
  level?: SkillLevel;
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    category: "Programming Languages",
    skills: [
      { name: "TypeScript", level: "expert" },
      { name: "JavaScript (ES6+)", level: "expert" },
      { name: "Java", level: "proficient" },
      { name: "C#", level: "experienced" },
      { name: "C++", level: "experienced" },
      { name: "Python", level: "experienced" },
      { name: "Kotlin", level: "familiar" },
      { name: "Go", level: "familiar" },
    ],
  },
  {
    category: "Backend Frameworks",
    skills: [
      { name: "NestJS", level: "expert" },
      { name: "Node.js", level: "expert" },
      { name: "Express", level: "expert" },
      { name: "Spring Boot", level: "experienced" },
      { name: "ASP.NET", level: "experienced" },
      { name: "Django", level: "familiar" },
      { name: "Flask", level: "familiar" },
    ],
  },
  {
    category: "APIs & Protocols",
    skills: [
      { name: "REST", level: "expert" },
      { name: "gRPC", level: "expert" },
      { name: "WebSockets", level: "expert" },
      { name: "OpenAPI/Swagger", level: "expert" },
      { name: "API Versioning", level: "expert" },
      { name: "GraphQL", level: "experienced" },
    ],
  },
  {
    category: "System Architecture",
    skills: [
      { name: "Microservices", level: "expert" },
      { name: "Event-Driven Architecture (EDA)", level: "expert" },
      { name: "API Gateway", level: "expert" },
      { name: "Domain-Driven Design (DDD)", level: "expert" },
      { name: "Serverless", level: "expert" },
      { name: "Monorepos", level: "expert" },
    ],
  },
  {
    category: "Cloud Platforms",
    skills: [
      { name: "Azure (AKS, Key Vault, Blob Storage)", level: "expert" },
      { name: "AWS (Fargate, Lambda, ECS, S3, RDS, DynamoDB)", level: "experienced" },
      { name: "GCP", level: "experienced" },
    ],
  },
  {
    category: "DevOps & Infrastructure",
    skills: [
      { name: "Kubernetes", level: "expert" },
      { name: "Docker", level: "expert" },
      { name: "GitLab CI/CD", level: "expert" },
      { name: "Linux", level: "expert" },
      { name: "Terraform", level: "experienced" },
      { name: "Helm", level: "experienced" },
      { name: "GitHub Actions", level: "experienced" },
    ],
  },
  {
    category: "Databases & ORMs",
    skills: [
      { name: "PostgreSQL", level: "expert" },
      { name: "TypeORM", level: "expert" },
      { name: "Redis", level: "expert" },
      { name: "MongoDB", level: "proficient" },
      { name: "Mongoose", level: "proficient" },
      { name: "MySQL", level: "experienced" },
      { name: "MSSQL", level: "experienced" },
      { name: "JPA", level: "experienced" },
    ],
  },
  {
    category: "Event Streaming",
    skills: [
      { name: "RabbitMQ", level: "expert" },
      { name: "Redis Pub/Sub", level: "expert" },
      { name: "Azure Service Bus", level: "experienced" },
      { name: "AWS SQS/SNS", level: "experienced" },
      { name: "Apache Kafka", level: "familiar" },
    ],
  },
  {
    category: "Observability",
    skills: [
      { name: "Azure Monitor", level: "expert" },
      { name: "Sentry", level: "expert" },
      { name: "Prometheus/Grafana", level: "experienced" },
      { name: "CloudWatch", level: "experienced" },
      { name: "Fresh Ping", level: "experienced" },
    ],
  },
  {
    category: "Quality Assurance",
    skills: [
      { name: "Jest", level: "expert" },
      { name: "Unit/Integration Testing", level: "expert" },
      { name: "Postman Automated Tests", level: "experienced" },
      { name: "End-to-End Testing", level: "experienced" },
    ],
  },
  {
    category: "Security",
    skills: [
      { name: "OAuth2/OIDC", level: "expert" },
      { name: "JWT", level: "expert" },
      { name: "API Security", level: "expert" },
      { name: "RBAC", level: "expert" },
      { name: "Zero Trust", level: "proficient" },
      { name: "SSL/TLS", level: "proficient" },
    ],
  },
  {
    category: "Frontend Skills",
    skills: [
      { name: "React (Hooks, Context API)", level: "familiar" },
      { name: "Next.js (App Router, API Routes)", level: "familiar" },
      { name: "HTML5/CSS3", level: "familiar" },
    ],
  },
  {
    category: "AI Development",
    skills: [
      { name: "LLM APIs (Gemini, OpenAI)", level: "experienced" },
      { name: "Fine-tuning", level: "familiar" },
    ],
  },
  {
    category: "Tools",
    skills: [
      { name: "Git" },
      { name: "Linux Distros" },
      { name: "Cursor AI" },
      { name: "K8s Lens" },
      { name: "Jira" },
      { name: "Confluence" },
      { name: "NX" },
      { name: "Miro" },
      { name: "Figma" },
    ],
  },
];

export default skillCategories;
export { skillCategories };
