"use client";

import { ThemeToggle } from "@/components/ui";
import { BottomNavigationItem, FloatingActionButton } from "@/components/layout";
import { useBottomNavigation } from "@/hooks";
import { mobileNavigationItems } from "@/data/navigation";

export function BottomNavigation() {
  const { swipeHandlers, isActive } = useBottomNavigation({
    items: mobileNavigationItems,
    enableSwipe: true,
    swipeThreshold: 80,
    swipeVelocity: 0.2,
  });

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="bottom-nav bottom-nav-glass swipe-feedback sm:hidden" {...swipeHandlers}>
        <div className="flex items-center justify-around px-2 py-1">
          {mobileNavigationItems.map((item) => (
            <BottomNavigationItem
              key={item.name}
              name={item.name}
              href={item.href}
              icon={item.icon}
              isActive={isActive(item.href)}
            />
          ))}
        </div>
      </nav>

      {/* Floating Theme Toggle */}
      <FloatingActionButton position="bottom-right">
        <ThemeToggle size="sm" />
      </FloatingActionButton>
    </>
  );
}
