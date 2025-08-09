export type SkillLevel = "expert" | "proficient" | "experienced" | "familiar";

export interface Skill {
  name: string;
  level?: SkillLevel;
  excludeFromMainStack?: boolean;
}

export interface SkillCategory {
  category: string;
  skills: Array<{
    name: string;
    level?: SkillLevel;
    excludeFromMainStack?: boolean;
  }>;
}

const skillCategories: SkillCategory[] = [
  {
    category: "Programming Languages",
    skills: [
      { name: "TypeScript", level: "proficient" },
      { name: "JavaScript", level: "proficient" },
      { name: "Java", level: "experienced" },
      { name: "C#", level: "experienced" },
      { name: "Python", level: "experienced" },
      { name: "C++", level: "experienced" },
      { name: "Kotlin", level: "familiar" },
      { name: "Go", level: "familiar" },
    ],
  },
  {
    category: "Backend Frameworks",
    skills: [
      { name: "Node.js", level: "proficient" },
      { name: "NestJS", level: "proficient" },
      { name: "Express", level: "proficient" },
      { name: "Spring Boot", level: "experienced" },
      { name: "Java EE", level: "experienced" },
      { name: "Django", level: "familiar" },
      { name: "Flask", level: "familiar" },
    ],
  },
  {
    category: "APIs & Protocols",
    skills: [
      { name: "REST", level: "proficient" },
      { name: "gRPC", level: "proficient" },
      { name: "OpenAPI", level: "proficient" },
      { name: "Swagger", level: "proficient" },
      { name: "API Versioning", level: "proficient" },
      { name: "WebSockets", level: "experienced" },
      { name: "GraphQL", level: "familiar" },
    ],
  },
  {
    category: "System Architecture",
    skills: [
      { name: "Microservices" },
      { name: "Event-Driven Architecture" },
      { name: "API Gateway" },
      { name: "Domain-Driven Design" },
      { name: "Serverless" },
      { name: "Monorepos" },
    ],
  },
  {
    category: "Cloud Platforms",
    skills: [
      { name: "Azure", level: "proficient" },
      { name: "AKS", level: "proficient" },
      { name: "Azure Key Vault", level: "proficient" },
      { name: "Azure Blob Storage", level: "proficient" },
      { name: "AWS", level: "experienced" },
      { name: "AWS Fargate", level: "experienced" },
      { name: "AWS ECS", level: "experienced" },
      { name: "AWS S3", level: "experienced" },
      { name: "AWS Amplify", level: "experienced" },
      { name: "GCP", level: "experienced" },
      { name: "GKE", level: "experienced" },
      { name: "Cloudflare", level: "experienced" },
    ],
  },
  {
    category: "DevOps & Infrastructure",
    skills: [
      { name: "Kubernetes", level: "proficient" },
      { name: "Docker", level: "proficient" },
      { name: "GitLab CI/CD", level: "proficient" },
      { name: "Linux", level: "proficient" },
      { name: "Terraform", level: "experienced" },
      { name: "Helm", level: "experienced" },
      { name: "GitHub Actions", level: "experienced" },
    ],
  },
  {
    category: "Databases & ORMs",
    skills: [
      { name: "PostgreSQL", level: "proficient" },
      { name: "TypeORM", level: "proficient" },
      { name: "Redis", level: "proficient" },
      { name: "MongoDB", level: "proficient" },
      { name: "Mongoose", level: "proficient" },
      { name: "MySQL", level: "experienced" },
      { name: "MSSQL", level: "experienced" },
      { name: "JPA", level: "experienced" },
    ],
  },
  {
    category: "Messaging Systems",
    skills: [
      { name: "RabbitMQ", level: "proficient" },
      { name: "Redis Pub/Sub", level: "proficient" },
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
      { name: "Azure Monitor", level: "proficient", excludeFromMainStack: true },
      { name: "Sentry", level: "proficient" },
      { name: "Prometheus", level: "experienced" },
      { name: "Grafana", level: "experienced" },
      { name: "Fresh Ping", level: "experienced" },
      { name: "CloudWatch", level: "familiar" },
    ],
  },
  {
    category: "Quality Assurance",
    skills: [
      { name: "Jest", level: "proficient" },
      { name: "Unit Testing", level: "proficient" },
      { name: "Integration Testing", level: "proficient" },
      { name: "Postman", level: "experienced" },
      { name: "End-to-End Testing", level: "experienced" },
      { name: "Supertest", level: "experienced" },
    ],
  },
  {
    category: "Security",
    skills: [
      { name: "OAuth2" },
      { name: "OIDC" },
      { name: "JWT" },
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
      { name: "Git" },
      { name: "Linux Distros" },
      { name: "Cursor AI" },
      { name: "K8s Lens" },
      { name: "Jira" },
      { name: "Confluence" },
      { name: "Miro" },
    ],
  },
];

export default skillCategories;
export { skillCategories };
