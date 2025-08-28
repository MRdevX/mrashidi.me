import { Home, FolderOpen, BookOpen, FileText, User, MessageSquare } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  showInMobile?: boolean;
  showInDesktop?: boolean;
}

export const allNavigationItems: NavigationItem[] = [
  { name: "Home", href: "/", icon: Home, showInMobile: true, showInDesktop: true },
  { name: "Projects", href: "/projects", icon: FolderOpen, showInMobile: true, showInDesktop: true },
  { name: "Blog", href: "/blog", icon: BookOpen, showInMobile: true, showInDesktop: true },
  { name: "Resume", href: "/resume", icon: FileText, showInMobile: true, showInDesktop: true },
  { name: "About", href: "/about", icon: User, showInMobile: true, showInDesktop: true },
  { name: "Contact", href: "/contact", icon: MessageSquare, showInMobile: false, showInDesktop: true },
];

export const mobileNavigationItems = allNavigationItems.filter((item) => item.showInMobile);

export const desktopNavigationItems = allNavigationItems.filter((item) => item.showInDesktop);

export function getNavigationItems(type: "mobile" | "desktop" | "all" = "all"): NavigationItem[] {
  switch (type) {
    case "mobile":
      return mobileNavigationItems;
    case "desktop":
      return desktopNavigationItems;
    case "all":
    default:
      return allNavigationItems;
  }
}
