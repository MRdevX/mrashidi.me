export interface WorkExperience {
  title: string;
  company: string;
  location: string;
  period: string;
  achievements: string[];
}

const workExperience: WorkExperience[] = [
  {
    title: "Senior Backend Engineer & Technical Lead",
    company: "Fakir Technology Consultants GmbH (Client: SE inno2fleet E-Mobility Services)",
    location: "Berlin, Germany (Full-Time, Remote)",
    period: "Mar 2022 – Jan 2025",
    achievements: [
      "Partnered with product managers to translate business requirements into technical specifications and delivery roadmaps",
      "Led cloud migration from GCP to Azure with zero downtime across 3 core products, ensuring GDPR compliance",
      "Owned and scaled AKS infrastructure supporting distributed, high-availability microservices",
      "Established a monorepo architecture (Lerna/NX) with shared libraries, improving code reuse and consistency",
      "Upgraded core systems (NestJS, PostgreSQL Flexible Server) for better stability and maintainability",
      "Redesigned messaging layer by migrating from Redis Pub/Sub to RabbitMQ, improving reliability and observability",
      "Implemented observability stack (Prometheus, Grafana, Redash), reducing incident resolution time significantly",
      "Enhanced GitLab CI/CD pipelines with automated tests and deployment validation for safer releases",
      "Contributed to frontend development for the Admin Portal (Next.js) and Tendergy installer website",
      "Optimized cloud infrastructure, cutting operational costs while maintaining system performance",
      "Introduced architectural improvements and reduced technical debt to simplify service codebases",
      "Mentored engineers through code reviews, pair programming, onboarding, and technical interviews",
      "Authored documentation covering infrastructure, architecture, and incident response processes",
    ],
  },
  {
    title: "Senior Backend Engineer",
    company: "Fakir Technology Consultants GmbH (Client: SE inno2fleet E-Mobility Services)",
    location: "Berlin, Germany (Full-Time, Remote)",
    period: "Mar 2021 – Feb 2022",
    achievements: [
      "Built the eConsultant MVP to calculate CO₂ emissions and EV investment requirements for European fleets",
      "Developed REST APIs (NestJS/TypeScript) supporting consultation, installation, and charging workflows",
      "Optimized PostgreSQL schema and queries, reducing API response times and improving scalability",
      "Expanded automated testing (Jest, Postman) integrated into GitLab CI/CD pipelines",
      "Refactored billing services into modular components, enabling parallel feature development",
      "Produced architecture and API documentation to streamline collaboration and onboarding",
    ],
  },
  {
    title: "Senior Backend Engineer",
    company: "Mehrpardaz Co (EN-Route Flight Operations Platform)",
    location: "Tehran, Iran (Full-Time, Remote)",
    period: "Jan 2020 – Feb 2021",
    achievements: [
      "Designed backend architecture from scratch with Express.js for aviation operations and crew management",
      "Delivered REST APIs consumed by React.js dashboards and iPadOS apps used by pilots and crew",
      "Integrated third-party weather and navigation APIs to provide real-time flight data",
      "Implemented scheduling, weight/balance calculations, and operational document workflows",
      "Built offline synchronization for mission-critical data to ensure usability without internet connectivity",
      "Aligned API contracts with frontend teams to streamline workflows and reduce friction",
      "Mentored junior developers and established coding standards and documentation practices",
    ],
  },
  {
    title: "Backend Engineer",
    company: "Iran Kish Credit Card Co (Mobile Banking, POS & Payment Gateway Services)",
    location: "Tehran, Iran (Full-Time, On-Site)",
    period: "Oct 2018 – Dec 2019",
    achievements: [
      "Introduced Node.js/TypeScript for new backend services alongside an existing Java/.NET stack",
      "Built REST APIs (Express, MongoDB) for user profile management and payment processing",
      "Contributed to distributed payment gateway services, enabling reliable multi-channel transactions",
      "Integrated external APIs (insurance, B2B) to expand product capabilities",
      "Upgraded encryption from 3DES to AES to strengthen security and regulatory compliance",
      "Migrated legacy iOS code from Objective-C to Swift for Mobile POS app, adding new features",
      "Developed Python scripts to automate data processing and migration workflows",
      "Collaborated with cross-functional teams (mobile, security, operations) to deliver secure solutions",
    ],
  },
  {
    title: "Software Developer",
    company: "Baharan Sarv Gostar (Learning Management System)",
    location: "Tehran, Iran (Full-Time, On-Site)",
    period: "Oct 2015 – Sep 2018",
    achievements: [
      "Supported migration of a legacy LMS from ASP.NET WebForms to Java EE",
      "Developed LMS modules (Java EE, Oracle DB) for scheduling, enrollment, and submissions",
      "Built backend services and Android application for student scheduling and assignments",
      "Deployed and maintained applications on Linux/Windows servers using VMware ESXi",
    ],
  },
];

export default workExperience;
