export interface NavigationItem {
  name: string;
  href: string;
}

export const navigationItems: NavigationItem[] = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Resume", href: "/resume" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

import coreConfig from "../core";

export const githubLink = {
  url: coreConfig.social.githubRepo,
  label: "Open Source",
  mobileLabel: "View Code",
  ariaLabel: "View source code on GitHub",
};
