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
      <nav className="mobile-nav bottom-nav-glass swipe-enabled sm:hidden" {...swipeHandlers}>
        <div className="nav-container">
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
