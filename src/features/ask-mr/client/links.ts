import { certificates, config, education } from "@/data";
import { projects } from "@/features/projects/infrastructure/projectData";

const hostOf = (url: string | undefined): string | null => {
  if (!url) {
    return null;
  }
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
};

/** Hosts the assistant may link to: anything that appears in the site's own data. */
const ALLOWED_HOSTS = new Set(
  [
    config.person.website,
    ...Object.values(config.social),
    ...projects.flatMap((p) => [p.githubUrl, p.liveUrl]),
    ...certificates.flatMap((c) => c.certificates.map((cert) => cert.url)),
    ...education.map((e) => e.url),
  ]
    .map(hostOf)
    .filter((host): host is string => host !== null)
);

const isAllowedHost = (host: string) =>
  ALLOWED_HOSTS.has(host) || host === "medium.com" || host.endsWith(".medium.com");

export type SafeLink = { href: string; external: boolean } | null;

/** Returns a safe href for an assistant link, or `null` to render it as plain text. */
export function safeLink(href: string | undefined, siteOrigin: string): SafeLink {
  if (!href) {
    return null;
  }
  if (href.startsWith("/") && !href.startsWith("//")) {
    return { href, external: false };
  }
  if (href.startsWith("mailto:")) {
    return href === `mailto:${config.person.email}` ? { href, external: true } : null;
  }
  try {
    const url = new URL(href);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return null;
    }
    if (url.origin === siteOrigin || hostOf(href) === hostOf(config.person.website)) {
      return { href: `${url.pathname}${url.search}${url.hash}`, external: false };
    }
    const host = hostOf(href);
    return host && isAllowedHost(host) ? { href: url.toString(), external: true } : null;
  } catch {
    return null;
  }
}
