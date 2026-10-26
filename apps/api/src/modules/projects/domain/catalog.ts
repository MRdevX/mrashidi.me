import type { CatalogOverview, Project, StackGroup } from "@mrashidi/types";

const TOP_STACK_LIMIT = 10;
const UNGROUPED = "More";

const NAMED_GROUPS: readonly StackGroup[] = [
  { name: "Languages", items: ["TypeScript", "JavaScript", "Go", "Rust", "Kotlin", "Python", "Bash"] },
  {
    name: "Frameworks",
    items: [
      "NestJS",
      "Next.js",
      "React",
      "Express",
      "Hono",
      "Vue.js",
      "Vite",
      "Wails",
      "Jetpack Compose",
      "PyQt",
      "Tailwind CSS",
      "Framer Motion",
    ],
  },
  {
    name: "Data & messaging",
    items: ["PostgreSQL", "MongoDB", "Redis", "Supabase", "TypeORM", "Drizzle", "RabbitMQ", "NATS", "Graphile Worker"],
  },
  {
    name: "Infra & DevOps",
    items: ["Docker", "Kubernetes", "Azure", "AWS", "Helm", "GitLab", "Grafana", "Prometheus", "Redash", "NX", "Lerna"],
  },
  { name: "Platforms", items: ["Node.js", "Deno", "Android", "macOS", "Windows", "iPadOS", "Chrome Extension API"] },
  {
    name: "Testing & tooling",
    items: ["Jest", "Vitest", "Supertest", "Swagger", "Postman", "Zod", "Biome", "CLI", "Git"],
  },
];

export function countStackUsage(projects: readonly Project[]): Map<string, number> {
  const usage = new Map<string, number>();
  for (const project of projects) {
    for (const tech of project.stack) {
      usage.set(tech, (usage.get(tech) ?? 0) + 1);
    }
  }
  return usage;
}

export function topStacks(usage: ReadonlyMap<string, number>, limit: number): string[] {
  return [...usage.keys()]
    .sort((a, b) => (usage.get(b) ?? 0) - (usage.get(a) ?? 0) || a.localeCompare(b))
    .slice(0, limit);
}

export function groupStacks(usage: ReadonlyMap<string, number>): StackGroup[] {
  const groups = NAMED_GROUPS.map((group) => ({
    name: group.name,
    items: group.items.filter((tech) => usage.has(tech)),
  }));
  const grouped = new Set(groups.flatMap((group) => group.items));
  const other = [...usage.keys()].filter((tech) => !grouped.has(tech)).sort((a, b) => a.localeCompare(b));

  return [...groups, { name: UNGROUPED, items: other }].filter((group) => group.items.length > 0);
}

export function describeCatalog(projects: readonly Project[]): CatalogOverview {
  const usage = countStackUsage(projects);
  return {
    projectCount: projects.length,
    openSourceCount: projects.filter((project) => project.openSource).length,
    stackCount: usage.size,
    topStacks: topStacks(usage, TOP_STACK_LIMIT),
    stackGroups: groupStacks(usage),
  };
}
