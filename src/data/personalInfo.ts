export interface SocialLinks {
  github: string;
  linkedin: string;
  email: string;
  website: string;
}

export interface Language {
  language: string;
  level: string;
  progress: number;
}

export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  website: string;
  social: SocialLinks;
  languages: Language[];
  summary: string;
  description: string;
  intro: string;
  contactCta: string;
  contactDescription: string;
}

const personalInfo: PersonalInfo = {
  name: "Mahdi Rashidi",
  title: "Backend Engineer",
  location: "Berlin, Germany",
  email: "contact@mrashidi.me",
  website: "https://mrashidi.me",
  social: {
    github: "https://github.com/mrdevx",
    linkedin: "https://linkedin.com/in/deerashidi",
    email: "contact@mrashidi.me",
    website: "https://mrashidi.me",
  },
  languages: [
    { language: "Persian", level: "Native Proficiency", progress: 100 },
    { language: "English", level: "Fluent (C1)", progress: 90 },
    { language: "German", level: "Pre-Intermediate (A2)", progress: 40 },
    { language: "Turkish", level: "Elementary (A1)", progress: 20 },
  ],
  summary:
    "I'm a backend engineer with 9 years of experience, primarily focused on Node.js and TypeScript over the past 6 years. I began my career with Java and have used Python for scripting and automation across various projects. My work centers on building scalable backend systems using microservice architectures, primarily on Azure and AWS. I have experience spanning backend development, infrastructure, and DevOps, working with tools like GitLab CI/CD, Docker, Kubernetes, and Terraform. I've contributed to cloud migrations, legacy system modernization, and developing resilient, testable services across industries including e-mobility, fintech, aviation, and education. I value clean, maintainable code, system reliability, and transparent collaboration between engineering and product teams. I take a low-ego, team-first approach and thrive in environments where shared learning and constructive feedback are encouraged. I'm always looking to grow as an engineer and contribute to building systems that are both pragmatic and built to scale.",
  description:
    "I'm a backend engineer with 9 years of experience, primarily focused on Node.js and TypeScript over the past 6 years. I began my career with Java and have used Python for scripting and automation across various projects. My work centers on building scalable backend systems using microservice architectures, primarily on Azure and AWS. I have experience spanning backend development, infrastructure, and DevOps, working with tools like GitLab CI/CD, Docker, Kubernetes, and Terraform. I've contributed to cloud migrations, legacy system modernization, and developing resilient, testable services across industries including e-mobility, fintech, aviation, and education. I value clean, maintainable code, system reliability, and transparent collaboration between engineering and product teams. I take a low-ego, team-first approach and thrive in environments where shared learning and constructive feedback are encouraged. I'm always looking to grow as an engineer and contribute to building systems that are both pragmatic and built to scale.",
  intro:
    "Backend engineer with 9 years of experience building scalable systems. Focused on Node.js, TypeScript, and microservice architectures on Azure and AWS. Passionate about clean code, system reliability, and collaborative development.",
  contactCta: "Ready to Discuss Your Next Project?",
  contactDescription:
    "Looking for a backend engineer who can bring your ideas to life? Let's connect and discuss how we can work together to create scalable, efficient solutions for your business.",
};

export default personalInfo;
