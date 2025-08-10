export interface NavigationItem {
  name: string;
  href: string;
}

export const navigationItems: NavigationItem[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Resume", href: "/resume" },
  { name: "Contact", href: "/contact" },
];

export const githubLink = {
  url: "https://github.com/MRdevX/mrashidi.me",
  label: "Open Source",
  mobileLabel: "View Code",
  ariaLabel: "View source code on GitHub",
};
