// Shared skills data for use in main page and terminal

export type SkillLevel = "advanced" | "intermediate" | "familiar";

export interface Skill {
  name: string;
  level: SkillLevel;
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    category: "Programming Languages",
    skills: [
      { name: "TypeScript", level: "advanced" },
      { name: "JavaScript (ES6+)", level: "advanced" },
      { name: "Java", level: "intermediate" },
      { name: "C#", level: "intermediate" },
      { name: "Python", level: "intermediate" },
      { name: "Bash", level: "intermediate" },
      { name: "Go", level: "familiar" },
      { name: "Kotlin", level: "familiar" },
    ],
  },
  {
    category: "Backend Frameworks",
    skills: [
      { name: "NestJS", level: "advanced" },
      { name: "Node.js", level: "advanced" },
      { name: "Express.js", level: "advanced" },
      { name: "Spring Boot", level: "intermediate" },
      { name: "Fastify", level: "familiar" },
      { name: "Deno", level: "familiar" },
      { name: "Fiber", level: "familiar" },
      { name: "Django", level: "familiar" },
    ],
  },
  {
    category: "Cloud & DevOps",
    skills: [
      { name: "Azure (AKS, Key Vault, Blob, PostgreSQL Flexible Server)", level: "advanced" },
      { name: "Kubernetes", level: "advanced" },
      { name: "Docker", level: "advanced" },
      { name: "GitLab CI/CD", level: "advanced" },
      { name: "AWS (ECS, S3, RDS)", level: "intermediate" },
      { name: "GCP", level: "intermediate" },
      { name: "Terraform", level: "intermediate" },
      { name: "Helm", level: "intermediate" },
      { name: "GitHub Actions", level: "intermediate" },
    ],
  },
  {
    category: "Databases, ORMs & Caching",
    skills: [
      { name: "PostgreSQL", level: "advanced" },
      { name: "TypeORM", level: "advanced" },
      { name: "MongoDB", level: "advanced" },
      { name: "Mongoose", level: "advanced" },
      { name: "Redis", level: "advanced" },
      { name: "Sequelize", level: "familiar" },
      { name: "Prisma", level: "familiar" },
      { name: "Drizzle", level: "familiar" },
    ],
  },
  {
    category: "Architecture & Protocols",
    skills: [
      { name: "Microservices", level: "advanced" },
      { name: "Event-Driven Architecture", level: "advanced" },
      { name: "RESTful APIs", level: "advanced" },
      { name: "gRPC", level: "advanced" },
      { name: "WebSockets", level: "advanced" },
      { name: "API Gateway Pattern", level: "intermediate" },
      { name: "Monolithic Architecture", level: "intermediate" },
      { name: "Domain-Driven Design", level: "familiar" },
      { name: "GraphQL", level: "familiar" },
      { name: "SOAP", level: "familiar" },
    ],
  },
  {
    category: "Security & Testing",
    skills: [
      { name: "JWT", level: "advanced" },
      { name: "OAuth2/OIDC", level: "advanced" },
      { name: "Jest", level: "advanced" },
      { name: "Postman", level: "advanced" },
      { name: "SonarQube", level: "intermediate" },
      { name: "Zero Trust", level: "intermediate" },
      { name: "OWASP Top 10", level: "intermediate" },
    ],
  },
];
