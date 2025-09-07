"use client";

import { BottomNavigationItem, FloatingActionButton } from "@/components/layout";
import { ThemeToggle } from "@/components/ui";
import { mobileNavigationItems } from "@/data/navigation";
import { useBottomNavigation } from "@/hooks";

export function BottomNavigation() {
  const { isActive } = useBottomNavigation({
    items: mobileNavigationItems,
  });

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="mobile-nav bottom-nav-glass sm:hidden">
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
      <FloatingActionButton position="bottom-right" asButton={false}>
        <ThemeToggle size="sm" />
      </FloatingActionButton>
    </>
  );
}
