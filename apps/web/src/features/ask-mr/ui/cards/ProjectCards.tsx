"use client";

import { ArrowUpRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { trackAskMr } from "@/features/ask-mr/client/analytics";
import type { AskMrProjectCard } from "@/features/ask-mr/server/tools";
import { PROJECTS_PATH, projectHref, requestOpenProject } from "@/features/projects";
import { NewTabSrOnly } from "@/lib/a11y/new-tab-hint";
import { CardShell } from "./CardShell";

interface ProjectCardsProps {
  projects: AskMrProjectCard[];
  onNavigate: () => void;
}

export function ProjectCards({ projects, onNavigate }: ProjectCardsProps) {
  const router = useRouter();
  const pathname = usePathname();
  if (projects.length === 0) {
    return null;
  }

  return (
    <CardShell title={projects.length === 1 ? "Project" : "Projects"}>
      <ul className="space-y-2">
        {projects.map((project) => (
          <li
            key={project.slug}
            className="group relative rounded-md border border-gray-200 bg-white p-3 transition-colors hover:border-orange-500/60 dark:border-white/10 dark:bg-black/30"
          >
            <button
              type="button"
              className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-md focus-visible:after:ring-2 focus-visible:after:ring-orange-500/60"
              onClick={() => {
                trackAskMr("ask_mr_tool_click", { tool: "showProjects" });
                onNavigate();
                if (pathname === PROJECTS_PATH) {
                  requestOpenProject(project.slug);
                } else {
                  router.push(projectHref(project.slug));
                }
              }}
            >
              <span className="flex items-baseline justify-between gap-2">
                <span className="font-semibold text-gray-900 group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-400">
                  {project.title}
                </span>
                {project.year ? (
                  <span className="shrink-0 font-terminal text-[11px] text-gray-500">{project.year}</span>
                ) : null}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                {project.description}
              </span>
              <span className="sr-only">Open project details</span>
            </button>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded border border-orange-500/20 bg-orange-500/5 px-1.5 py-0.5 font-terminal text-[10px] text-orange-700 dark:text-orange-300"
                >
                  {tech}
                </span>
              ))}
              <span className="ml-auto flex gap-1">
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 inline-flex size-9 items-center justify-center rounded-md text-gray-500 hover:text-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
                    aria-label={`${project.title} on GitHub`}
                  >
                    <FaGithub className="size-4" aria-hidden />
                    <NewTabSrOnly />
                  </a>
                ) : null}
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 inline-flex size-9 items-center justify-center rounded-md text-gray-500 hover:text-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
                    aria-label={`${project.title} live site`}
                  >
                    <ArrowUpRight className="size-4" aria-hidden />
                    <NewTabSrOnly />
                  </a>
                ) : null}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </CardShell>
  );
}
