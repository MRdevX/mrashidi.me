export type SkillLevel = "expert" | "proficient" | "experienced";

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
      { name: "Python", level: "proficient" },
      { name: "C#", level: "proficient" },
      { name: "Bash", level: "proficient" },
      { name: "Go", level: "experienced" },
      { name: "Kotlin", level: "experienced" },
      { name: "Rust", level: "experienced" },
    ],
  },
  {
    category: "Backend Frameworks",
    skills: [
      { name: "NestJS", level: "expert" },
      { name: "Node.js", level: "expert" },
      { name: "Express", level: "proficient" },
      { name: "Spring Boot", level: "experienced" },
      { name: "FastAPI", level: "experienced" },
      { name: "Deno", level: "experienced" },
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
    ],
  },
  {
    category: "Cloud Platforms",
    skills: [
      { name: "Azure (AKS, Key Vault, Blob Storage)", level: "expert" },
      { name: "AWS (Lambda, ECS, S3, RDS, DynamoDB)", level: "experienced" },
    ],
  },
  {
    category: "DevOps & Infrastructure",
    skills: [
      { name: "Kubernetes", level: "expert" },
      { name: "Docker", level: "expert" },
      { name: "Terraform", level: "expert" },
      { name: "GitLab CI/CD", level: "expert" },
      { name: "Helm", level: "proficient" },
      { name: "GitHub Actions", level: "proficient" },
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
      { name: "Apache Kafka", level: "proficient" },
      { name: "Azure Service Bus", level: "proficient" },
      { name: "AWS SQS/SNS", level: "experienced" },
    ],
  },
  {
    category: "Observability",
    skills: [
      { name: "Prometheus/Grafana", level: "expert" },
      { name: "Sentry", level: "expert" },
      { name: "Azure Monitor", level: "proficient" },
    ],
  },
  {
    category: "Quality Assurance",
    skills: [
      { name: "Jest", level: "expert" },
      { name: "Unit/Integration Testing", level: "expert" },
      { name: "Postman", level: "proficient" },
      { name: "End-to-End Testing", level: "proficient" },
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
      { name: "React (Hooks, Context API)", level: "experienced" },
      { name: "Next.js (App Router, API Routes)", level: "experienced" },
      { name: "HTML5/CSS3", level: "experienced" },
    ],
  },
  {
    category: "AI Development",
    skills: [
      { name: "LLM APIs (Gemini, OpenAI)", level: "proficient" },
      { name: "Fine-tuning", level: "experienced" },
    ],
  },
  {
    category: "Tools",
    skills: [
      { name: "Git" },
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
