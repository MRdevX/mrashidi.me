import { describe, expect, it } from "vitest";
import { skills, workExperience } from "@/data";
import { projects } from "@/features/projects/infrastructure/projectData";
import { getMainTechStack, getTechIcon } from "@/lib/tech";

function describeIcon(techName: string): string {
  const { Icon, colorClass } = getTechIcon(techName);
  const iconName = "displayName" in Icon && Icon.displayName ? Icon.displayName : Icon.name;
  return `${iconName} ${colorClass}`.trim();
}

function lookupTable(names: Iterable<string>): Record<string, string> {
  const unique = [...new Set(names)].sort((a, b) => a.localeCompare(b));
  return Object.fromEntries(unique.map((name) => [name, describeIcon(name)]));
}

describe("getTechIcon", () => {
  it("resolves every skill name to its icon", () => {
    expect(
      lookupTable(skills.flatMap((category) => category.skills.map((skill) => skill.name)))
    ).toMatchInlineSnapshot(`
      {
        "API Gateway": "FaAws text-orange-500",
        "AWS": "FaAws text-yellow-500",
        "Azure": "VscAzure text-blue-500",
        "Azure Service Bus": "VscAzure text-blue-500",
        "Bull": "TbStack2 text-red-500",
        "CSS3": "FaCss3 text-blue-500",
        "Cloud Monitoring": "SiGooglecloud text-blue-400",
        "Cloudflare": "SiCloudflare text-orange-500",
        "Confluence": "SiConfluence text-blue-400",
        "Cursor AI": "BsFillHexagonFill text-purple-500",
        "Dart": "SiDart text-sky-500",
        "Deno": "SiDeno text-green-600",
        "Docker": "SiDocker text-blue-500",
        "Domain-Driven Design (DDD)": "FaDatabase text-purple-500",
        "Drizzle": "SiDrizzle text-blue-600",
        "Envelope Encryption": "TbKey text-amber-500",
        "Event-Driven Architecture (EDA)": "SiEventstore text-green-600",
        "Express": "SiExpress text-gray-700 dark:text-gray-300",
        "Flutter": "SiFlutter text-sky-400",
        "GCP": "SiGooglecloud text-blue-400",
        "GDPR": "TbShieldLock text-blue-600",
        "Git": "FaGit text-orange-600",
        "GitHub Actions": "SiGithubactions text-blue-500",
        "GitLab CI/CD": "SiGitlab text-orange-600",
        "Go": "SiGo text-cyan-500",
        "Grafana": "SiGrafana text-orange-400",
        "HTML5": "FaHtml5 text-orange-500",
        "Helm": "SiHelm text-blue-500",
        "Hono": "SiHono text-orange-500",
        "JWT": "SiJsonwebtokens text-purple-500",
        "Java": "SvgIcon(Java) text-red-700",
        "JavaScript": "SvgIcon(JavaScript)",
        "Jest": "SiJest text-red-500",
        "Jira": "SiJira text-blue-500",
        "Kotlin": "SiKotlin text-purple-400",
        "Kubernetes": "SiKubernetes text-blue-400",
        "LLM APIs": "TbBrain text-purple-500",
        "Linkerd": "SiLinkerd text-sky-500",
        "Linux": "SiLinux text-yellow-500",
        "Loki": "SiGrafana text-yellow-500",
        "Microservices": "FaCode text-blue-400",
        "Miro": "SiMiro text-pink-400",
        "MongoDB": "SiMongodb text-green-700",
        "Monorepos": "SiLerna text-blue-500",
        "Multi-tenancy": "TbBuildingCommunity text-indigo-500",
        "NestJS": "SiNestjs text-rose-600",
        "Next.js": "SiNextdotjs text-black dark:text-white",
        "Node.js": "FaNodeJs text-green-600",
        "Nuxt": "SiNuxt text-emerald-400",
        "OAuth2/OIDC": "TbBrandOauth text-blue-500",
        "OpenAPI": "SiOpenapiinitiative text-green-500",
        "Playwright": "FaTheaterMasks text-green-600",
        "PostgreSQL": "SvgIcon(PostgreSQL) text-blue-800",
        "Postman": "SiPostman text-orange-500",
        "Prometheus": "SiPrometheus text-orange-500",
        "Python": "SvgIcon(Python) text-yellow-300",
        "RBAC": "FaUserCog text-purple-500",
        "REST": "TbApi text-blue-500",
        "RabbitMQ": "SiRabbitmq text-orange-500",
        "React": "SiReact text-cyan-400",
        "Redash": "SiRedash text-red-500",
        "Redis": "SiRedis text-red-500",
        "SQL": "TbSql text-blue-500",
        "Sentry": "SiSentry text-orange-500",
        "Serverless": "FaAws text-orange-500",
        "Supabase": "SiSupabase text-green-600",
        "Supertest": "SiJest text-red-500",
        "Tailwind CSS": "SiTailwindcss text-sky-400",
        "Terraform": "SiTerraform text-purple-500",
        "Trivy": "SiTrivy text-cyan-500",
        "TypeORM": "SvgIcon(TypeORM)",
        "TypeScript": "SvgIcon(TypeScript)",
        "VS Code": "VscVscode text-blue-500",
        "Vite": "SiVite text-purple-500",
        "Vitest": "SiVitest text-green-500",
        "Vue.js": "SiVuedotjs text-green-500",
        "WebSockets": "FaNetworkWired text-gray-400",
        "WhisperX": "TbMicrophone text-teal-500",
        "Workers AI": "SiCloudflareworkers text-orange-500",
        "gRPC": "SiTrpc text-blue-500",
        "mTLS": "TbLockCheck text-green-600",
        "nginx": "SiNginx text-green-600",
        "pytest": "SiPytest text-sky-600",
        "shadcn/ui": "SiShadcnui text-black dark:text-white",
      }
    `);
  });

  it("resolves every main stack icon key to its icon", () => {
    expect(lookupTable(getMainTechStack().map((item) => item.iconKey))).toMatchInlineSnapshot(`
      {
        "azure": "VscAzure text-blue-500",
        "cloudflare": "SiCloudflare text-orange-500",
        "docker": "SiDocker text-blue-500",
        "express": "SiExpress text-gray-700 dark:text-gray-300",
        "gcp": "SiGooglecloud text-blue-400",
        "git": "FaGit text-orange-600",
        "gitlabci/cd": "SiGitlab text-orange-600",
        "javascript": "SvgIcon(JavaScript)",
        "jest": "SiJest text-red-500",
        "kubernetes": "SiKubernetes text-blue-400",
        "linux": "SiLinux text-yellow-500",
        "microservices": "FaCode text-blue-400",
        "nestjs": "SiNestjs text-rose-600",
        "nodejs": "FaNodeJs text-green-600",
        "postgresql": "SvgIcon(PostgreSQL) text-blue-800",
        "python": "SvgIcon(Python) text-yellow-300",
        "rabbitmq": "SiRabbitmq text-orange-500",
        "redis": "SiRedis text-red-500",
        "rest": "TbApi text-blue-500",
        "terraform": "SiTerraform text-purple-500",
        "typeorm": "SvgIcon(TypeORM)",
        "typescript": "SvgIcon(TypeScript)",
      }
    `);
  });

  it("resolves every project stack entry to its icon", () => {
    expect(lookupTable(projects.flatMap((project) => project.stack))).toMatchInlineSnapshot(`
      {
        "AWS": "FaAws text-yellow-500",
        "Android": "SiAndroid text-green-500",
        "Azure": "VscAzure text-blue-500",
        "Bash": "SiGnubash text-gray-700",
        "Biome": "FaTools text-gray-400",
        "CLI": "FaTerminal text-gray-600",
        "CSS": "FaCss3 text-blue-500",
        "Cargo": "GiCargoCrate text-orange-500",
        "Chrome Extension API": "TbApi text-green-500",
        "Database Management": "FaDatabase text-blue-600",
        "Deno": "SiDeno text-green-600",
        "DevOps": "AiOutlineKubernetes text-purple-600",
        "Docker": "SiDocker text-blue-500",
        "Drizzle": "SiDrizzle text-blue-600",
        "Express": "SiExpress text-gray-700 dark:text-gray-300",
        "Framer Motion": "SiFramer text-pink-400",
        "Git": "FaGit text-orange-600",
        "GitLab": "SiGitlab text-orange-600",
        "Go": "SiGo text-cyan-500",
        "Google Sheets API": "TbBrandGoogle text-green-600",
        "Grafana": "SiGrafana text-orange-400",
        "Graphile Worker": "SvgIcon(Graphile Worker) text-orange-600",
        "HTML": "FaHtml5 text-orange-500",
        "Helm": "SiHelm text-blue-500",
        "Hono": "SiHono text-orange-500",
        "JWT": "SiJsonwebtokens text-purple-500",
        "JavaScript": "SvgIcon(JavaScript)",
        "Jest": "SiJest text-red-500",
        "Jetpack Compose": "SiJetpackcompose text-sky-400",
        "Kotlin": "SiKotlin text-purple-400",
        "Kubernetes": "SiKubernetes text-blue-400",
        "Lerna": "SiLerna text-blue-500",
        "License Analysis": "TbLicense text-green-600",
        "MongoDB": "SiMongodb text-green-700",
        "NATS": "SiNatsdotio text-white-500",
        "NX": "SiNx text-gray-400",
        "NestJS": "SiNestjs text-rose-600",
        "Next.js": "SiNextdotjs text-black dark:text-white",
        "Node.js": "FaNodeJs text-green-600",
        "OAuth": "TbBrandOauth text-blue-500",
        "PostgreSQL": "SvgIcon(PostgreSQL) text-blue-800",
        "Postman": "SiPostman text-orange-500",
        "Prometheus": "SiPrometheus text-orange-500",
        "PyQt": "SiQt text-green-600",
        "Python": "SvgIcon(Python) text-yellow-300",
        "RESTful APIs": "TbApi text-blue-500",
        "RabbitMQ": "SiRabbitmq text-orange-500",
        "React": "SiReact text-cyan-400",
        "Redash": "SiRedash text-red-500",
        "Redis": "SiRedis text-red-500",
        "Rust": "SiRust text-orange-600",
        "Shell Scripting": "SiShell text-gray-600",
        "Spotify API": "SiSpotify text-green-500",
        "Supabase": "SiSupabase text-green-600",
        "Supertest": "SiJest text-red-500",
        "Swagger": "SiSwagger text-green-500",
        "TUS Protocol": "FaTools text-gray-400",
        "Tailwind CSS": "SiTailwindcss text-sky-400",
        "Telegram Bot API": "SiTelegram text-sky-500",
        "Translation APIs": "AiOutlineTranslation text-blue-500",
        "TypeORM": "SvgIcon(TypeORM)",
        "TypeScript": "SvgIcon(TypeScript)",
        "Vite": "SiVite text-purple-500",
        "Vitest": "SiVitest text-green-500",
        "Vue.js": "SiVuedotjs text-green-500",
        "Wails": "FaTools text-gray-400",
        "Weather APIs": "FaCloud text-blue-400",
        "Windows": "FaWindows text-blue-600",
        "WorkManager": "SiAndroid text-green-500",
        "Zod": "SiZod text-blue-500",
        "iPadOS": "FaMobile text-blue-500",
        "macOS": "SiApple text-gray-800",
      }
    `);
  });

  it("resolves every work experience stack entry to its icon", () => {
    expect(lookupTable(workExperience.flatMap((job) => job.stack ?? []))).toMatchInlineSnapshot(`{}`);
  });

  it("falls back to the tools icon for unknown names", () => {
    expect(describeIcon("not a real technology")).toBe(describeIcon("default"));
  });

  it.each([
    "System Design",
    "Software Architecture",
    "Event Sourcing",
    "Mobile Development",
    "Service Worker",
    "Zero Downtime",
  ])("does not borrow a specific icon for the generic word in %s", (techName) => {
    expect(describeIcon(techName)).toBe(describeIcon("default"));
  });
});
