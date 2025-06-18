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
      "Optimized database performance through PostgreSQL query optimization, reducing API response times for high-traffic consultation endpoints",
      "Refactored billing service into modular components, enabling parallel development and improving system maintainability",
      "Documented technical architecture and processes to streamline team workflows and facilitate knowledge transfer across development team",
    ],
  },
  {
    title: "Senior Backend Engineer",
    company: "Mehrpardaz Co (EN-Route Flight Operations Platform)",
    location: "Tehran, Iran (Full-Time, Remote)",
    period: "Jan 2020 – Feb 2021",
    achievements: [
      "Built backend architecture from scratch using Express.js and JavaScript for aviation operations and crew management",
      "Designed and implemented RESTful APIs serving a React dashboard and iPadOS app for flight crew",
      "Integrated weather forecast APIs to deliver flight-specific meteorological data",
      "Developed features for weight/luggage management, crew scheduling, and document handling",
      "Architected offline sync system to provide flight crews with latest data before takeoff",
      "Onboarded and mentored 2 junior developers, creating onboarding docs and dev guidelines",
      "Established agile workflows using Jira and Mattermost for project and team management",
      "Designed MongoDB schema tailored to aviation data (crew schedules, flight plans, docs)",
      "Collaborated with frontend and iOS teams to ensure smooth API integration and UX",
      "Created technical documentation for backend services, APIs, and overall architecture",
    ],
  },
  {
    title: "Backend Engineer",
    company: "Iran Kish Credit Card Co (Mobile Banking, POS & Payment Gateway Services)",
    location: "Tehran, Iran (Full-Time, On-Site)",
    period: "Oct 2018 – Dec 2019",
    achievements: [
      "Developed REST backend services using Express.js, JavaScript, and MongoDB, migrating from Java to Node.js ecosystem",
      "Integrated third-party RESTful and SOAP financial APIs to expand banking features",
      "Improved security by migrating from legacy 3DES to modern AES encryption standards",
      "Automated data migration via Python scripts converting legacy data to JSON format",
    ],
  },
  {
    title: "Software Developer",
    company: "Baharan Sarv Gostar (Learning Management System)",
    location: "Tehran, Iran (Full-Time, On-Site)",
    period: "Oct 2015 – Sep 2018",
    achievements: [
      "Participated in migrating legacy ASP.NET WebForms LMS to Java Spring framework",
      "Maintained and debugged ASP.NET WebForms/MVC applications, resolving user issues and implementing feature enhancements",
      "Assisted with VMware ESXi server administration including VM deployment and monitoring",
    ],
  },
];

export default workExperience;
