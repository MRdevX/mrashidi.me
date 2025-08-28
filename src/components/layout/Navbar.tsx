"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui";
import { desktopNavigationItems } from "@/data/navigation";
import { useScrollPosition } from "@/hooks";
import { BrandLogo } from "./BrandLogo";
import { NavigationItem } from "./NavigationItem";
import { VersionBadge } from "./VersionBadge";

export default function Navbar() {
  const isScrolled = useScrollPosition();
  const pathname = usePathname();

  const getNavbarClasses = () => {
    return `fixed w-full z-50 transition-all duration-300 ${isScrolled ? "navbar-glass" : "bg-transparent"}`;
  };

  return (
    <nav className={getNavbarClasses()} aria-label="Main Navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex justify-between w-full">
            <div className="flex items-center space-x-4">
              <BrandLogo />
              <VersionBadge variant="desktop" />
            </div>

            <nav className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8" aria-label="Main Menu">
              {desktopNavigationItems.map((item) => (
                <NavigationItem key={item.name} item={item} isActive={pathname === item.href} />
              ))}
              <ThemeToggle size="sm" />
            </nav>
          </div>
        </div>
      </div>
    </nav>
  );
}
