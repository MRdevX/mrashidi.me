"use client";

import { usePathname } from "next/navigation";
import type { NavigationItem } from "@/data/navigation";

interface UseBottomNavigationOptions {
  items: NavigationItem[];
}

export function useBottomNavigation({ items }: UseBottomNavigationOptions) {
  const pathname = usePathname();

  const currentIndex = items.findIndex((item) => item.href === pathname);

  return {
    currentIndex,
    currentPath: pathname,
    items,
    isActive: (href: string) => pathname === href,
  };
}
