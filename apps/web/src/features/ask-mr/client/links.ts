import type { SiteContent } from "@/lib/content";

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

export type SafeLink = { href: string; external: boolean } | null;

/** Hosts the assistant may link to: anything that appears in the site's own data. */
export function createSafeLink({ profile, projects, certificates, education }: SiteContent) {
  const allowedHosts = new Set(
    [
      profile.person.website,
      ...Object.values(profile.social),
      ...projects.flatMap((p) => [p.githubUrl, p.liveUrl]),
      ...certificates.flatMap((c) => c.certificates.map((cert) => cert.url)),
      ...education.map((e) => e.url),
    ]
      .map(hostOf)
      .filter((host): host is string => host !== null)
  );
  const isAllowedHost = (host: string) =>
    allowedHosts.has(host) || host === "medium.com" || host.endsWith(".medium.com");

  return function safeLink(href: string | undefined, siteOrigin: string): SafeLink {
    if (!href) {
      return null;
    }
    if (href.startsWith("/") && !href.startsWith("//")) {
      return { href, external: false };
    }
    if (href.startsWith("mailto:")) {
      return href === `mailto:${profile.person.email}` ? { href, external: true } : null;
    }
    try {
      const url = new URL(href);
      if (url.protocol !== "https:" && url.protocol !== "http:") {
        return null;
      }
      if (url.origin === siteOrigin || hostOf(href) === hostOf(profile.person.website)) {
        return { href: `${url.pathname}${url.search}${url.hash}`, external: false };
      }
      const host = hostOf(href);
      return host && isAllowedHost(host) ? { href: url.toString(), external: true } : null;
    } catch {
      return null;
    }
  };
}
