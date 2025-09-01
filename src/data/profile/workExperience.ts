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
      "Worked with product managers to translate business needs into technical specs and roadmaps",
      "Led migration from GCP to Azure, ensuring GDPR compliance and zero downtime across 3 major products",
      "Managed Azure Kubernetes Service (AKS) infrastructure for high-availability microservices",
      "Architected a monorepo with Lerna/NX and shared libraries to standardize service development",
      "Upgraded core systems including NestJS and PostgreSQL Flexible Server",
      "Migrated messaging from Redis Pub/Sub to RabbitMQ, improving reliability and monitoring",
      "Implemented observability with Prometheus, Grafana, and Redash, reducing incident resolution times",
      "Enhanced GitLab CI/CD with automated testing and deployment validations",
      "Contributed to frontend work on the Admin Portal (Next.js) and the Tendergy installer website",
      "Defined API contracts and integration standards across services to improve consistency and reduce friction",
      "Led incident response and postmortems, driving actions that improved uptime and resilience",
      "Optimized cloud resources to reduce infrastructure costs while maintaining performance",
      "Introduced architectural improvements and addressed technical debt to simplify codebases",
      "Mentored engineers through code reviews, pair programming, and onboarding; led technical interviews",
      "Created documentation for infrastructure architecture and incident response processes",
    ],
  },
  {
    title: "Senior Backend Engineer",
    company: "Fakir Technology Consultants GmbH (Client: SE inno2fleet E-Mobility Services)",
    location: "Berlin, Germany (Full-Time, Remote)",
    period: "Mar 2021 – Feb 2022",
    achievements: [
      "Built the eConsultant MVP to calculate CO₂ emissions and EV investment needs for European fleets",
      "Developed REST APIs with NestJS/TypeScript for consultation, installation, and charging workflows",
      "Optimized PostgreSQL schema and queries, reducing API response times on high-traffic endpoints",
      "Expanded automated testing with Jest and Postman, integrated into GitLab CI/CD",
      "Refactored billing into modular components, enabling parallel feature delivery and easier maintenance",
      "Documented architecture and service contracts to support collaboration and onboarding",
    ],
  },
  {
    title: "Senior Backend Engineer",
    company: "Mehrpardaz Co (EN-Route Flight Operations Platform)",
    location: "Tehran, Iran (Full-Time, Remote)",
    period: "Jan 2020 – Feb 2021",
    achievements: [
      "Designed backend architecture from scratch with Express.js/JavaScript for aviation operations and crew management",
      "Built REST APIs consumed by React.js dashboards and iPadOS apps used by pilots and crew",
      "Integrated third-party weather and navigation APIs to deliver real-time flight data",
      "Implemented scheduling, weight/balance calculations, and operational document workflows",
      "Built offline synchronization for mission-critical data to ensure usability without connectivity",
      "Collaborated with frontend engineers to align API contracts with editor workflows",
      "Improved API performance via MongoDB schema design and indexing strategies",
      "Ensured compliance with aviation data safety standards through validation and error handling",
      "Onboarded and mentored junior developers; established coding standards and documentation practices",
    ],
  },
  {
    title: "Backend Engineer",
    company: "Iran Kish Credit Card Co (Mobile Banking, POS & Payment Gateway Services)",
    location: "Tehran, Iran (Full-Time, On-Site)",
    period: "Oct 2018 – Dec 2019",
    achievements: [
      "Adopted the Node.js/TypeScript ecosystem for new backend services alongside the existing Java/.NET stack",
      "Built REST APIs with Express and MongoDB for user profile management and payment processing",
      "Contributed to distributed payment gateway services, ensuring reliable multi-channel transactions",
      "Integrated external services (insurance, B2B) to expand platform functionality",
      "Upgraded encryption from 3DES to AES, improving security and compliance",
      "Migrated legacy iOS code from Objective-C to Swift for the Mobile POS app and added new features",
      "Developed Python scripts to automate data processing and migration tasks",
      "Collaborated with mobile, security, and operations teams to deliver stable, secure payment solutions",
    ],
  },
  {
    title: "Software Developer",
    company: "Baharan Sarv Gostar (Learning Management System)",
    location: "Tehran, Iran (Full-Time, On-Site)",
    period: "Oct 2015 – Sep 2018",
    achievements: [
      "Contributed to migration of a legacy LMS from ASP.NET WebForms to Java EE",
      "Developed LMS modules with Java EE and Oracle Database for scheduling, enrollment, and submissions",
      "Built backend services and an Android application for student scheduling and assignments",
      "Integrated Adobe Connect API for online class hosting within the LMS",
      "Deployed and maintained applications on Linux and Windows servers using VMware ESXi",
    ],
  },
];

export default workExperience;
