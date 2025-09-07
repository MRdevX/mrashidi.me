import type { LucideIcon } from "lucide-react";
import { BookOpen, FileText, FolderOpen, Home, MessageSquare, User } from "lucide-react";
import { config } from "./config";

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  showInMobile?: boolean;
  showInDesktop?: boolean;
}

export const navigationItems: NavigationItem[] = [
  { name: "Home", href: "/", icon: Home, showInMobile: true, showInDesktop: true },
  { name: "Projects", href: "/projects", icon: FolderOpen, showInMobile: true, showInDesktop: true },
  { name: "Blog", href: "/blog", icon: BookOpen, showInMobile: true, showInDesktop: true },
  { name: "Resume", href: "/resume", icon: FileText, showInMobile: true, showInDesktop: true },
  { name: "About", href: "/about", icon: User, showInMobile: true, showInDesktop: true },
  { name: "Contact", href: "/contact", icon: MessageSquare, showInMobile: false, showInDesktop: true },
];

export const mobileNavigationItems = navigationItems.filter((item) => item.showInMobile);
export const desktopNavigationItems = navigationItems.filter((item) => item.showInDesktop);

export function getNavigationItems(type: "mobile" | "desktop" | "all" = "all"): NavigationItem[] {
  switch (type) {
    case "mobile":
      return mobileNavigationItems;
    case "desktop":
      return desktopNavigationItems;
    default:
      return navigationItems;
  }
}

export const githubLink = {
  url: config.social.githubRepo,
  label: "Open Source",
  mobileLabel: "View Code",
  ariaLabel: "View source code on GitHub",
};
