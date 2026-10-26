import { fixtureContent } from "@mrashidi/types/fixtures";
import { describe, expect, it } from "vitest";
import { getMainTechStack } from "@/features/home/techStack";
import { getTechIcon } from "@/lib/tech";

const { experience, projects, skills } = fixtureContent;

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
        "Azure": "VscAzure text-blue-500",
        "Cloudflare": "SiCloudflare text-orange-500",
        "Docker": "SiDocker text-blue-500",
        "GCP": "SiGooglecloud text-blue-400",
        "Git": "FaGit text-orange-600",
        "Go": "SiGo text-cyan-500",
        "Hono": "SiHono text-orange-500",
        "JavaScript": "SvgIcon(JavaScript)",
        "Kubernetes": "SiKubernetes text-blue-400",
        "NestJS": "SiNestjs text-rose-600",
        "Node.js": "FaNodeJs text-green-600",
        "PostgreSQL": "SvgIcon(PostgreSQL) text-blue-800",
        "Python": "SvgIcon(Python) text-yellow-300",
        "RabbitMQ": "SiRabbitmq text-orange-500",
        "Redis": "SiRedis text-red-500",
        "Terraform": "SiTerraform text-purple-500",
        "TypeScript": "SvgIcon(TypeScript)",
        "Vitest": "SiVitest text-green-500",
      }
    `);
  });

  it("resolves every main stack icon key to its icon", () => {
    expect(lookupTable(getMainTechStack(skills).map((item) => item.iconKey))).toMatchInlineSnapshot(`
      {
        "docker": "SiDocker text-blue-500",
        "gcp": "SiGooglecloud text-blue-400",
        "javascript": "SvgIcon(JavaScript)",
        "nestjs": "SiNestjs text-rose-600",
        "nodejs": "FaNodeJs text-green-600",
        "postgresql": "SvgIcon(PostgreSQL) text-blue-800",
        "python": "SvgIcon(Python) text-yellow-300",
        "typescript": "SvgIcon(TypeScript)",
      }
    `);
  });

  it("resolves every project stack entry to its icon", () => {
    expect(lookupTable(projects.flatMap((project) => project.stack))).toMatchInlineSnapshot(`
      {
        "Cloudflare": "SiCloudflare text-orange-500",
        "Docker": "SiDocker text-blue-500",
        "Go": "SiGo text-cyan-500",
        "Hono": "SiHono text-orange-500",
        "JavaScript": "SvgIcon(JavaScript)",
        "Kubernetes": "SiKubernetes text-blue-400",
        "NestJS": "SiNestjs text-rose-600",
        "Node.js": "FaNodeJs text-green-600",
        "PostgreSQL": "SvgIcon(PostgreSQL) text-blue-800",
        "Python": "SvgIcon(Python) text-yellow-300",
        "Redis": "SiRedis text-red-500",
        "Rust": "SiRust text-orange-600",
        "TypeScript": "SvgIcon(TypeScript)",
      }
    `);
  });

  it("resolves every work experience stack entry to its icon", () => {
    expect(lookupTable(experience.flatMap((job) => job.stack ?? []))).toMatchInlineSnapshot(`
      {
        "Docker": "SiDocker text-blue-500",
        "Kubernetes": "SiKubernetes text-blue-400",
        "Node.js": "FaNodeJs text-green-600",
        "PostgreSQL": "SvgIcon(PostgreSQL) text-blue-800",
        "Python": "SvgIcon(Python) text-yellow-300",
        "Redis": "SiRedis text-red-500",
        "TypeScript": "SvgIcon(TypeScript)",
      }
    `);
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
