"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSwipeGesture } from "./useSwipeGesture";

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
}

interface UseBottomNavigationOptions {
  items: NavigationItem[];
  enableSwipe?: boolean;
  swipeThreshold?: number;
  swipeVelocity?: number;
}

export function useBottomNavigation({
  items,
  enableSwipe = true,
  swipeThreshold = 80,
  swipeVelocity = 0.2,
}: UseBottomNavigationOptions) {
  const pathname = usePathname();
  const router = useRouter();

  const currentIndex = items.findIndex((item) => item.href === pathname);

  const handleSwipeLeft = () => {
    if (currentIndex < items.length - 1) {
      router.push(items[currentIndex + 1].href);
    }
  };

  const handleSwipeRight = () => {
    if (currentIndex > 0) {
      router.push(items[currentIndex - 1].href);
    }
  };

  const swipeHandlers = enableSwipe
    ? useSwipeGesture({
        onSwipeLeft: handleSwipeLeft,
        onSwipeRight: handleSwipeRight,
        threshold: swipeThreshold,
        velocity: swipeVelocity,
      })
    : {};

  return {
    currentIndex,
    currentPath: pathname,
    items,
    swipeHandlers,
    isActive: (href: string) => pathname === href,
  };
}
