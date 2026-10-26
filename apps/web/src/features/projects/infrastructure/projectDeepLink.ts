import { type Project, projectSlug } from "../domain/project";
import { projects } from "./projectData";

export const PROJECTS_PATH = "/projects";
const PROJECT_PARAM = "project";
const OPEN_PROJECT_EVENT = "projects:open";

export const projectHref = (slug: string) => `${PROJECTS_PATH}?${PROJECT_PARAM}=${encodeURIComponent(slug)}`;

export const findProjectBySlug = (slug: string | null): Project | null =>
  slug ? (projects.find((project) => projectSlug(project) === slug) ?? null) : null;

export const readProjectParam = (search: string): string | null => new URLSearchParams(search).get(PROJECT_PARAM);

export function requestOpenProject(slug: string): void {
  window.dispatchEvent(new CustomEvent<string>(OPEN_PROJECT_EVENT, { detail: slug }));
}

export function onOpenProjectRequest(handler: (slug: string) => void): () => void {
  const listener = (event: Event) => handler((event as CustomEvent<string>).detail);
  window.addEventListener(OPEN_PROJECT_EVENT, listener);
  return () => window.removeEventListener(OPEN_PROJECT_EVENT, listener);
}
