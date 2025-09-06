export interface WorkExperience {
  title: string;
  company: string;
  location: string;
  period: string;
  achievements: string[];
}

const workExperience: WorkExperience[] = [
  {
    title: "Senior Software Engineer & Technical Lead",
    company: "Fakir Technology Consultants GmbH (Client: SE inno2fleet E-Mobility Services)",
    location: "Berlin, Germany (Full-Time, Remote)",
    period: "Mar 2022 – Jan 2025",
    achievements: [
      "Defined technical specifications and delivery roadmaps in collaboration with product managers",
      "Led cloud migration from GCP to Azure with zero downtime across 3 core products, ensuring GDPR compliance",
      "Scaled and maintained AKS infrastructure supporting high-availability microservices",
      "Introduced a monorepo architecture (Lerna/NX), improving code reuse and developer efficiency",
      "Increased system stability and maintainability by upgrading core services (NestJS, PostgreSQL Flexible Server)",
      "Improved reliability and observability by redesigning messaging from Redis Pub/Sub to RabbitMQ",
      "Reduced incident resolution time by implementing observability stack (Prometheus, Grafana, Redash)",
      "Strengthened release safety with enhanced GitLab CI/CD pipelines, automated tests, and deployment validation",
      "Contributed to frontend features for Admin Portal (Next.js) and Tendergy installer website",
      "Lowered operational costs by optimizing cloud infrastructure while maintaining performance",
      "Simplified service codebases by introducing architectural improvements and reducing technical debt",
      "Mentored engineers through code reviews, pair programming, onboarding, and technical interviews",
      "Authored documentation on infrastructure, architecture, and incident response processes",
    ],
  },
  {
    title: "Senior Backend Engineer",
    company: "Fakir Technology Consultants GmbH (Client: SE inno2fleet E-Mobility Services)",
    location: "Berlin, Germany (Full-Time, Remote)",
    period: "Mar 2021 – Feb 2022",
    achievements: [
      "Developed the eConsultant MVP to calculate CO₂ emissions and EV investment requirements for European fleets",
      "Delivered REST APIs (NestJS/TypeScript) for consultation, installation, and charging workflows",
      "Optimized PostgreSQL schema and queries, reducing API response times and improving scalability",
      "Expanded test coverage with Jest and Postman, integrated into GitLab CI/CD pipelines",
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
      "Designed backend architecture from scratch (Express.js) for aviation operations and crew management",
      "Delivered REST APIs consumed by React dashboards and iPadOS apps used by pilots and crew",
      "Integrated third-party weather and navigation APIs to provide real-time flight data",
      "Implemented scheduling, weight/balance calculations, and operational document workflows",
      "Built offline synchronization to ensure mission-critical data availability without internet connectivity",
      "Aligned API contracts with frontend teams, reducing integration issues and delivery time",
      "Mentored junior developers and established coding standards and documentation practices",
    ],
  },
  {
    title: "Backend Engineer",
    company: "Iran Kish Credit Card Co (Mobile Banking, POS & Payment Gateway Services)",
    location: "Tehran, Iran (Full-Time, On-Site)",
    period: "Oct 2018 – Dec 2019",
    achievements: [
      "Introduced Node.js/TypeScript for new backend services within an existing Java/.NET stack",
      "Built REST APIs (Express, MongoDB) for user profile management and payment processing",
      "Contributed to distributed payment gateway services, enabling reliable multi-channel transactions",
      "Integrated external APIs (insurance, B2B) to expand product capabilities",
      "Upgraded encryption from 3DES to AES to strengthen security and compliance",
      "Migrated legacy iOS code from Objective-C to Swift for Mobile POS app, adding new features",
      "Automated data processing and migration workflows using Python scripts",
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
      "Built backend services and Android app for student scheduling and assignments",
      "Deployed and maintained applications on Linux/Windows servers using VMware ESXi",
    ],
  },
];

export default workExperience;
