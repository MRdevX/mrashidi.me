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
    company: "Fakir Technology Consultants GmbH (Client: SE (inno2fleet E-Mobility Services))",
    location: "Berlin, Germany (Full-Time, Remote)",
    period: "Mar 2022 – Jan 2025",
    achievements: [
      "Aligned with Head of Product to translate business needs into technical specs and development roadmaps",
      "Led GCP to Azure migration, ensuring GDPR compliance and zero downtime across 3 major products",
      "Managed Azure Kubernetes Service (AKS) infrastructure supporting EV charging platform with high availability and scalability requirements",
      "Architected monorepo solution using Lerna and NX, developing reusable generic libraries deployed across multiple microservices",
      "Upgraded core systems: NestJS major versions and PostgreSQL Flexible Server migration",
      "Migrated messaging infrastructure from Redis Pub/Sub to RabbitMQ for enhanced monitoring capabilities and system stability",
      "Optimized cloud infrastructure costs through resource monitoring and implementing comprehensive observability stack",
      "Deployed monitoring solutions including Grafana, Prometheus, and Redash via Helm Charts for improved system visibility",
      "Enhanced CI/CD pipeline efficiency in GitLab, integrating automated testing and improving deployment reliability across core microservices",
      "Mentored and onboarded backend developers to accelerate team productivity and knowledge transfer",
      "Conducted technical interviews for team expansion and candidate evaluation",
      "Created comprehensive documentation for infrastructure architecture and incident management processes",
      "Managed technical debt resolution by upgrading outdated libraries and improving code maintainability across the entire codebase",
    ],
  },
  {
    title: "Senior Backend Engineer",
    company: "Fakir Technology Consultants GmbH (Client: SE (inno2fleet E-Mobility Services))",
    location: "Berlin, Germany (Full-Time, Remote)",
    period: "Mar 2021 – Feb 2022",
    achievements: [
      "Built eConsultant MVP from ground up, to calculate CO2 emissions and EV transition investment for European fleets",
      "Developed RESTful APIs using NestJS/TypeScript to support consultation, installation, and charging services for enterprise clients",
      "Integrated Postman and Jest tests into GitLab CI/CD, improving coverage across key services",
      "Optimized database performance through PostgreSQL query optimization, reducing API response times for consultation endpoints",
      "Refactored billing service into modular components, enabling parallel development and improving system maintainability",
      "Documented technical architecture and processes to streamline team workflows and facilitate knowledge transfer across development team",
    ],
  },
  {
    title: "Senior Backend Engineer",
    company: "Mehrpardaz Co (EN‑Route Flight Operations Platform)",
    location: "Tehran, Iran (Full-Time, Remote)",
    period: "Jan 2020 – Feb 2021",
    achievements: [
      "Built complete backend architecture from scratch using Express.js and JavaScript for aviation operations and crew management",
      "Designed and implemented RESTful APIs serving React dashboard and iPadOS application for flight crew operations",
      "Integrated meteorological APIs to deliver real‑time weather forecast data for specific flight routes",
      "Developed features for weight/balance calculations, crew scheduling, and flight document processing",
      "Architected offline synchronization system enabling flight crews to access critical data without connectivity",
      "Onboarded and mentored 2 junior developers, establishing development guidelines and documentation standards",
      "Designed MongoDB schema optimized for aviation data including crew schedules, flight plans, and operational documents",
      "Implemented data validation and error handling mechanisms to ensure aviation safety compliance",
      "Collaborated with frontend teams to establish API contracts and ensure seamless platform integration",
      "Created comprehensive technical documentation covering backend services, APIs, and system architecture",
    ],
  },
  {
    title: "Backend Engineer",
    company: "Iran Kish Credit Card Co (Mobile Banking, POS & Payment Gateway Services)",
    location: "Tehran, Iran (Full-Time, On‑Site)",
    period: "Oct 2018 – Dec 2019",
    achievements: [
      "Transitioned from Java/.NET technology stack to Node.js ecosystem",
      "Built RESTful API using Node.js, Express, and MongoDB for user profile management and payment processing",
      "Contributed to backend services development for Hamput payment application, integrating B2B services for insurance, money transfer, etc",
      "Enhanced application security by upgrading encryption from 3DES to AES implementation",
      "Developed Node.js backend services with third‑party service integrations for payment platform functionality",
      "Migrated legacy Objective‑C code to Swift in Mobile POS iOS application while adding new features and UI improvements",
      "Participated in cross‑platform development across web APIs, mobile applications, and payment processing systems",
      "Developed Python scripts to automate data processing and migration tasks",
    ],
  },
  {
    title: "Software Developer",
    company: "Baharan Sarv Gostar (Learning Management System)",
    location: "Tehran, Iran (Full-Time, On‑Site)",
    period: "Oct 2015 – Sep 2018",
    achievements: [
      "Contributed to ASP.NET WebForms LMS migration to Java EE architecture while maintaining existing system functionality",
      "Developed LMS components using Java EE and Oracle Database for new platform requirements",
      "Built backend services and Android application for student class scheduling and assignment submission",
      "Integrated Adobe Connect API for online class hosting within the LMS platform",
      "Deployed applications on Linux and Windows servers using VMware ESXi virtualization and VM management",
    ],
  },
];

export default workExperience;
