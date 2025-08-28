"use client";

import { usePathname } from "next/navigation";

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
}

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
