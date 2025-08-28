"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Home, FolderOpen, BookOpen, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui";
import { useSwipeGesture } from "@/hooks";

interface BottomNavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const bottomNavItems: BottomNavItem[] = [
  { name: "Home", href: "/", icon: Home },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Blog", href: "/blog", icon: BookOpen },
  { name: "Resume", href: "/resume", icon: FileText },
  { name: "About", href: "/about", icon: User },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  // Get current page index
  const currentIndex = bottomNavItems.findIndex((item) => item.href === pathname);

  // Swipe gesture handlers
  const handleSwipeLeft = () => {
    if (currentIndex < bottomNavItems.length - 1) {
      router.push(bottomNavItems[currentIndex + 1].href);
    }
  };

  const handleSwipeRight = () => {
    if (currentIndex > 0) {
      router.push(bottomNavItems[currentIndex - 1].href);
    }
  };

  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    threshold: 80, // Minimum swipe distance
    velocity: 0.2, // Minimum swipe velocity
  });

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="bottom-nav bottom-nav-glass swipe-feedback sm:hidden" {...swipeHandlers}>
        <div className="flex items-center justify-around px-2 py-1">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "nav-item flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-2 rounded-lg transition-all duration-200",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  "focus:outline-none"
                )}
                aria-label={item.name}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 mb-1 transition-colors duration-200",
                    isActive ? "text-orange-600 dark:text-orange-400" : "text-gray-500 dark:text-gray-400"
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "text-xs font-medium transition-colors duration-200 truncate",
                    isActive ? "text-orange-600 dark:text-orange-400" : "text-gray-600 dark:text-gray-300"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Floating Theme Toggle */}
      <div className="fixed bottom-20 right-4 z-50 sm:hidden">
        <div className="bg-white/80 backdrop-blur-lg rounded-full p-2 shadow-lg dark:bg-gray-900/80">
          <ThemeToggle size="sm" />
        </div>
      </div>
    </>
  );
}
